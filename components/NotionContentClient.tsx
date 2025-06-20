'use client'

import { NotionRenderer } from 'react-notion-x'
import dynamic from 'next/dynamic'
import React from 'react'

// Estos imports dinámicos son necesarios para react-notion-x
const Code = dynamic(() => import('react-notion-x/build/third-party/code').then((m) => m.Code), { ssr: false })
const Collection = dynamic(() => import('react-notion-x/build/third-party/collection').then((m) => m.Collection), { ssr: false })
const Equation = dynamic(() => import('react-notion-x/build/third-party/equation').then((m) => m.Equation), { ssr: false })
const Pdf = dynamic(() => import('react-notion-x/build/third-party/pdf').then((m) => m.Pdf), { ssr: false })
const Modal = dynamic(() => import('react-notion-x/build/third-party/modal').then((m) => m.Modal), { ssr: false })

export default function NotionContentClient({ recordMap }: { recordMap: any }) {
  return (
    <NotionRenderer
      recordMap={recordMap}
      fullPage={false}
      darkMode={false}
      components={{
        Code,
        Collection,
        Equation,
        Pdf,
        Modal
      }}
    />
  )
}
