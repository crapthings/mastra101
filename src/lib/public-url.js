// 为站内静态文件添加部署基础路径，同时保留外部链接。
export function publicUrl (path) {
  return path.startsWith('/') && !path.startsWith('//')
    ? `${import.meta.env.BASE_URL}${path.slice(1)}`
    : path
}
