// components/NotionRenderer.tsx
'use client'

import dynamic from 'next/dynamic'
import 'react-notion-x/src/styles.css'
import 'prismjs/themes/prism-tomorrow.css'
import type { RecordMap, ExtendedRecordMap } from 'notion-types'

const NotionRendererBase = dynamic(
  () => import('react-notion-x').then((m) => m.NotionRenderer),
  { ssr: false }
)

export default function NotionRenderer({ recordMap }: { recordMap: ExtendedRecordMap }) {
  return (
    <NotionRendererBase
      recordMap={recordMap}
      fullPage={false}
      darkMode={false}
      components={{ Collection: () => null }}
    />
  )
}
