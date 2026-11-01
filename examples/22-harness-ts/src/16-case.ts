import { randomUUID } from 'node:crypto'
import { readFile, writeFile, rename } from 'node:fs/promises'
import { Mastra } from '@mastra/core'
import { createAssistant, createStorage } from './assistant.ts'
import { receiveTurn } from './thread-runtime.ts'
import { approvalSchema, caseSchema, createCaseFacts, assessCase, caseFingerprint, caseState } from './case-facts.ts'

// 在同一目录通过独立进程读取文件，每次只接受完整写入的教学记录。
async function readOptional (path) {
  try {
    return JSON.parse(await readFile(path, 'utf8'))
  } catch (error) {
    if (error.code === 'ENOENT') return null
    throw error
  }
}

// 用临时文件与重命名减少中断造成的半份 JSON，本案例只支持串行命令。
async function saveJson (path, value) {
  await writeFile(`${path}.tmp`, JSON.stringify(value, null, 2) + '\n')
  await rename(`${path}.tmp`, path)
}

// 复用持久线程串起初始化、核查、补材料与再次核查，只有 review 请求模型。
async function main () {
  const command = process.argv[2] || 'inspect'
  if (!['init', 'inspect', 'supplement', 'review'].includes(command)) {
    throw new Error('仅支持 init、inspect、supplement、review。')
  }
  const storage = await createStorage('case-study')
  const reviewer = createAssistant(storage)
  const mastra = new Mastra({ agents: { reviewer }, storage })
  try {
    const path = './data/case-001.json'
    const reportPath = './data/case-001-report.json'
    const saved = await readOptional(path)
    let facts
    if (saved) {
      facts = caseSchema.parse(saved)
    } else if (command === 'init') {
      facts = createCaseFacts(randomUUID())
      const memory = await reviewer.getMemory()
      await memory.createThread({ threadId: facts.threadId, resourceId: facts.resourceId, title: 'APP-001 连续核查' })
      await saveJson(path, facts)
    } else {
      throw new Error('先运行 init 建立申请；不要只复制指针文件而遗漏数据库。')
    }
    const memory = await reviewer.getMemory()
    const storedThread = await memory.getThreadById({ threadId: facts.threadId })
    if (!storedThread || storedThread.resourceId !== facts.resourceId) {
      throw new Error('数据库中的原线程或归属不匹配，停止处理。')
    }
    const thread = { threadId: facts.threadId, resourceId: facts.resourceId }
    if (command === 'supplement') {
      const approval = approvalSchema.parse(JSON.parse(await readFile(new URL('../materials/case-approval.json', import.meta.url), 'utf8')))
      if (JSON.stringify(facts.approval) !== JSON.stringify(approval)) {
        facts = caseSchema.parse({ ...facts, approval, revision: facts.revision + 1 })
        await saveJson(path, facts)
      }
    }
    if (command !== 'inspect') {
      const signal = await reviewer.sendStateSignal(caseState(facts), { ...thread, ifIdle: { behavior: 'persist' } })
      if (!signal.skipped) {
        const accepted = await signal.accepted
        if (accepted.action !== 'persist') throw new Error('没有进入预期的仅保存状态分支。')
        await signal.persisted
      }
      console.log('状态已保存，本次是否跳过重复版本：', Boolean(signal.skipped))
    }
    if (command === 'review') {
      const subscription = await reviewer.subscribeToThread({ ...thread, withRunStatus: true })
      try {
        const run = await receiveTurn(subscription, () => reviewer.sendMessage('请只按最新 application 状态核查 APP-001。说明金额、上限、批准记录是否适用与下一步；不要把旧轮次的缺项当作最新事实，不声称完成报销。', thread))
        if (!run.text.trim()) throw new Error('没有最终说明，不写入新的核查报告。')
        const report = {
          applicationId: facts.applicationId, threadId: facts.threadId, runId: run.runId,
          revision: facts.revision, fingerprint: caseFingerprint(facts),
          assessment: assessCase(facts), evidence: facts,
          modelCommentary: run.text, commentaryReview: '待人工对照材料核实'
        }
        await saveJson(reportPath, report)
        console.log('已保存本次核查报告：', reportPath)
      } finally {
        subscription.unsubscribe()
      }
    }
    const report = await readOptional(reportPath)
    console.dir({
      applicationId: facts.applicationId, threadId: facts.threadId,
      revision: facts.revision, currentAssessment: assessCase(facts),
      report: report ? { runId: report.runId, revision: report.revision, stale: report.fingerprint !== caseFingerprint(facts) } : null
    }, { depth: null })
    if (command === 'init' && saved) console.log('沿用已有申请，没有重置材料或线程。')
    if (command === 'supplement') console.log('补材料只保存状态，不会自动请求模型；运行 review 后再读取新报告。')
  } finally {
    await mastra.shutdown()
    await storage.close()
  }
}

// 保留失败原因与退出码，旧报告不被当作本次成功的新结果。
main().catch(error => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
