import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { MDocument } from '@mastra/rag'

// 从教学目录读取原文与来源属性，不调用模型抽取元数据。
export async function loadDocuments () {
  const catalog = JSON.parse(await readFile(new URL('../materials/catalog.json', import.meta.url), 'utf8'))
  return Promise.all(catalog.map(async item => ({ ...item, text: await readFile(new URL('../materials/' + item.file, import.meta.url), 'utf8') })))
}

// 按 Markdown 标题切分并保留稳定来源，每个片段独立关联文档版本。
export async function prepareChunks () {
  const documents = await loadDocuments()
  const chunks = []
  for (const document of documents) {
    const parts = await MDocument.fromMarkdown(document.text).chunk({ strategy: 'markdown', headers: [['#', 'heading'], ['##', 'section']] })
    for (const [position, part] of parts.entries()) {
      const hash = createHash('sha256').update(part.text).digest('hex').slice(0, 12)
      chunks.push({ id: `${document.docId}:${document.version}:${position}:${hash}`, text: part.text, metadata: {
        ...part.metadata, docId: document.docId, version: document.version,
        teamId: document.teamId, active: document.active,
        source: document.file, title: document.title, text: part.text
      } })
    }
  }
  return chunks
}
