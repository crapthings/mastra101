import { publicUrl } from '@/lib/public-url'
import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import content from '@/locales/diagrams/image-detail.zh.json'
import { DiagramFrame, DiagramSvg, Node, Arrow } from './frame'

i18n.addResourceBundle('zh', 'imageDetailDiagram', { content })

// 用图示说明整图提供背景，局部图补充细节，不执行实际模型处理。
export function ImageDetailDiagram () {
  const { t } = useTranslation('imageDetailDiagram')
  const d = t('content', { returnObjects: true })
  return <DiagramFrame title={d.title} caption={d.caption}><DiagramSvg height={410} label={d.caption}>{marker => <>

    <text x='155' y='30' textAnchor='middle' fontSize='15' fontWeight='600' fill='#292524'>{d.whole}</text>
    <text x='450' y='30' textAnchor='middle' fontSize='15' fontWeight='600' fill='#292524'>{d.crop}</text>
    <image href={publicUrl(d.noticeSrc)} x='25' y='55' width='260' height='178.75' />
    <rect x='45.3' y='166.58' width='155.73' height='14.9' fill='none' stroke='#2563eb' strokeWidth='2' />
    <Arrow d='M 202 174 H 318' marker={marker} />
    <rect x='320' y='140' width='265' height='64' rx='10' fill='#eff6ff' stroke='#2563eb' />
    <svg x='325' y='159.8' width='255' height='24.4' viewBox='75 412 575 55' overflow='hidden'>
      <image href={publicUrl(d.noticeSrc)} width='960' height='660' />
    </svg>
    <Arrow d='M 155 239 V 272 H 240 V 318' marker={marker} />
    <Arrow d='M 450 204 V 272 H 360 V 318' marker={marker} />
    <Node x={65} y={320} width={470} title={d.combine} subtitle={d.combineDetail} active />
  </>}</DiagramSvg></DiagramFrame>
}
