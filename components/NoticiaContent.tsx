'use client'

import { useEffect } from 'react'
import NotionRenderer from '@/components/NotionRenderer'
import Link from 'next/link'

interface Props {
  title: string
  subtitulo: string
  fecha: string
  visitas: number
  slug: string
  url: string
  description: string
  recordMap: any
}

export default function NoticiaContent({
  title,
  subtitulo,
  fecha,
  visitas,
  slug,
  url,
  description,
  recordMap,
}: Props) {
  useEffect(() => {
    fetch(`/api/visitas/${slug}`).catch((err) => {
      console.error('Error al contar visita:', err);
    });
  }, [slug])

  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold">{title}</h1>
      {subtitulo && (
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">{subtitulo}</p>
      )}
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        <span>{fecha}</span> · <span>{visitas} visita{visitas !== 1 ? 's' : ''}</span>
      </div>
      <hr className="my-4" />
      <NotionRenderer recordMap={recordMap} />

      <div className="mt-6 flex gap-4">
        <span className="text-sm font-medium text-gray-500">Compartir:</span>
        <Link href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
          Facebook
        </Link>
        <Link href={`https://api.whatsapp.com/send?text=${encodeURIComponent(title)}%20${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
          WhatsApp
        </Link>
        <Link href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
          X (Twitter)
        </Link>
        <Link href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description)}`} target="_blank" rel="noopener noreferrer" className="text-sky-700 hover:underline">
          LinkedIn
        </Link>
      </div>
    </main>
  )
}
