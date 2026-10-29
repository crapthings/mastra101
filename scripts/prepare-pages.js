import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { chapters } from '../src/curriculum.js'

// 为每个课程路由写入入口文件，使 Pages 支持章节直达和刷新。
const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8')
// 同时覆盖课程目录与历史兼容路由。
const routerSource = await readFile(new URL('../src/router.jsx', import.meta.url), 'utf8')
// 去重后生成静态目录，不改变浏览器中的课程路由。
const paths = new Set([
  ...chapters.flatMap(chapter => chapter.lessons.map(lesson => lesson.path.slice(1))),
  ...Array.from(routerSource.matchAll(/path: '([^']+)'/g), match => match[1]).filter(path => path !== '/')
])
for (const path of paths) {
  const directory = new URL(`../dist/${path}/`, import.meta.url)
  await mkdir(directory, { recursive: true })
  await writeFile(new URL('index.html', directory), html)
}
await writeFile(new URL('../dist/.nojekyll', import.meta.url), '')
console.log(`Prepared ${paths.size} direct lesson URLs.`)
