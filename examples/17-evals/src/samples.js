// 三种通知资料覆盖已知入口、不同入口和入口尚未公布的情况。
export const samples = [
  { input: { notice: { venue: '南门', source: '场馆通知' } }, groundTruth: { status: '已确认', venue: '南门', source: '场馆通知' } },
  { input: { notice: { venue: '东门', source: '场馆通知' } }, groundTruth: { status: '已确认', venue: '东门', source: '场馆通知' } },
  { input: { notice: { venue: null, source: '场馆通知' } }, groundTruth: { status: '待确认', venue: null, source: '场馆通知' } }
]
