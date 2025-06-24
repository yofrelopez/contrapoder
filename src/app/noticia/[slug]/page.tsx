// src/app/noticia/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { NotionAPI } from 'notion-client'
import { Client } from '@notionhq/client'
import { ExtendedRecordMap } from 'notion-types'

import NoticiaContent from '@/components/NoticiaContent'

type Props = {
  params: { slug: string }   // ←  ❚  NO PROMISE, simple objeto
}

export default async function NoticiaPage({ params }: Props) {
  const { slug } = params         // ←  ❚  ya NO se hace “await”

  /* ────────── Notion ────────── */
  const notion = new Client({ auth: process.env.NOTION_TOKEN })
  const { results } = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      property: 'Slug',
      rich_text: { equals: slug },
    },
  })

  if (!results.length) return notFound()

  const page = results[0] as any
  const recordMap: ExtendedRecordMap = await new NotionAPI().getPage(page.id)

  /* ────────── Propiedades (cast “any” para no pelear con tipos del SDK) ────────── */
  const p = page.properties as any
  const title       = p.Name?.title?.[0]?.plain_text        ?? 'Sin título'
  const subtitulo   = p.Subtítulo?.rich_text?.[0]?.plain_text ?? ''
  const fecha       = p.Fecha?.date?.start                  ?? ''
  const description = p.Resumen?.rich_text?.[0]?.plain_text ?? ''
  const url         = `${process.env.NEXT_PUBLIC_SITE_URL}/noticia/${slug}`

  /* ────────── Render ────────── */
  return (
    <NoticiaContent
      title={title}
      subtitulo={subtitulo}
      fecha={fecha}
      description={description}
      url={url}
      recordMap={recordMap}
    />
  )
}
