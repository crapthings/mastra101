import { createLab } from './lab.ts'
import { samples } from './samples.ts'

// 数据集存入框架存储，保留原始版本后再修改一个样本。
const mastra = createLab()
try {
  const dataset = await mastra.datasets.create({ name: '入场通知核对', description: '覆盖已知入口与入口未公布' })
  const added = await dataset.addItems({ items: samples })
  const before = await dataset.getDetails()
  const updated = await dataset.updateItem({ itemId: added[0].id, metadata: { reviewed: true } })
  const after = await dataset.getDetails()
  const snapshot = await dataset.listItems({ version: before.version, page: 0, perPage: 10 })
  console.log('原版本：', before.version, '修改后版本：', after.version)
  const original = snapshot.items.find(item => item.id === updated.id)
  console.log('原版本已审核：', original.metadata?.reviewed ?? false, '新版本已审核：', updated.metadata.reviewed)
  console.table(snapshot.items.map(item => ({ id: item.id, input: JSON.stringify(item.input), groundTruth: JSON.stringify(item.groundTruth) })))
} finally {
  await mastra.shutdown()
}
