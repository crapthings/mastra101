import { createHash } from 'node:crypto'
import { z } from 'zod'

// 约定本地教学批准记录，真实应用仍需从可信审批系统取得并验证记录。
export const approvalSchema = z.object({
  id: z.string().min(1), applicationId: z.string().min(1),
  approvedAt: z.iso.date(),
  maxAmount: z.number().positive(), source: z.string().min(1)
})

// 将归属、材料版本与核查事实保存在一个可重新读取的教学清单中。
export const caseSchema = z.object({
  applicationId: z.literal('APP-001'), resourceId: z.literal('demo-user'),
  threadId: z.string().min(1), revision: z.number().int().positive(),
  amount: z.number().positive(), limit: z.number().positive(),
  stayDate: z.iso.date(),
  policySource: z.string().min(1), approval: approvalSchema.nullable()
})

// 用固定申请建立案例起点，后续命令继续同一个 thread 而不是重建任务。
export function createCaseFacts (threadId) {
  return caseSchema.parse({
    applicationId: 'APP-001', resourceId: 'demo-user', threadId, revision: 1,
    amount: 560, limit: 500, stayDate: '2026-11-14',
    policySource: '教学制度 v1：每晚 500 元，超额须事先书面批准', approval: null
  })
}

// 由代码检查批准与申请、金额和时间是否对应，模型只负责解释这些证据。
export function assessCase (input) {
  const facts = caseSchema.parse(input)
  const validApproval = facts.approval &&
    facts.approval.applicationId === facts.applicationId &&
    facts.approval.maxAmount >= facts.amount &&
    facts.approval.approvedAt < facts.stayDate
  const missing = facts.amount > facts.limit && !validApproval
    ? ['适用于本申请及金额的事先书面批准记录']
    : []
  return {
    status: missing.length ? '待补批准' : '材料齐全，待人工确认',
    missing, approvalId: validApproval ? facts.approval.id : null
  }
}

// 用材料摘要识别旧报告是否仍对应当前事实，避免补材料后继续显示旧结论。
export function caseFingerprint (input) {
  return createHash('sha256').update(JSON.stringify(caseSchema.parse(input))).digest('hex')
}

// 同时生成程序值和模型可读说明，使一次更新的两个表示保持一致。
export function caseState (input) {
  const facts = caseSchema.parse(input)
  return {
    id: 'application', mode: 'snapshot',
    cacheKey: `${facts.applicationId}:v${facts.revision}:${caseFingerprint(facts)}`,
    value: facts,
    contents: `教学申请与制度材料：${JSON.stringify(facts)}。程序核对：${JSON.stringify(assessCase(facts))}。材料齐全也只是待人工确认；不得声称已报销或已提交。`
  }
}
