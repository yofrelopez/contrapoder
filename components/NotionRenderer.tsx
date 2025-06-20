// components/NotionRenderer.tsx
'use client'

import dynamic from 'next/dynamic'
import 'react-notion-x/src/styles.css'
import 'prismjs/themes/prism-tomorrow.css'

const NotionRendererBase = dynamic(() =>
  import('react-notion-x').then((m) => m.NotionRenderer),
  { ssr: false }
)

export default function NotionRenderer({ recordMap }: { recordMap: any }) {
  return (
    <div className="notion notion-custom-font">
      <NotionRendererBase
        recordMap={recordMap}
        fullPage={false}
        darkMode={false}
        components={{ Collection: () => null }}
      />
    </div>
  )
}
