// 读取系统时钟，并将同一时刻转换为指定时区的中文时间。
export function readTime (timeZone: string) {
  try {
    const formatter = new Intl.DateTimeFormat('zh-CN', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
      timeZoneName: 'longOffset'
    })
    const now = new Date()
    return {
      ok: true as const,
      timeZone,
      capturedAt: now.toISOString(),
      localTime: formatter.format(now)
    }
  } catch (error) {
    if (error instanceof RangeError) {
      return {
        ok: false as const,
        timeZone,
        error: '无法识别这个时区，请提供有效的时区，例如 Asia/Tokyo。'
      }
    }
    throw error
  }
}
