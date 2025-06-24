// src/app/noticia/[slug]/page.tsx
export const revalidate = 60   // ISR de 1 min para cada post

import { getDatabaseItems, getPageBySlug, getRecordMap } from '@/lib/notion'
import NoticiaContent from '@/components/NoticiaContent'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const posts = await getDatabaseItems()
  return posts.map(post => {
    const slug = (post.properties as any).Slug?.rich_text?.[0]?.plain_text ?? post.id
    return { slug }
  })
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const page = await getPageBySlug(params.slug)
  if (!page) return {}

  const p = page.properties as any
  const title = p.Name?.title?.[0]?.plain_text ?? 'Contra Poder'
  const description = p.Resumen?.rich_text?.[0]?.plain_text ?? ''
  const image = p.Imagen?.url ?? '/default-og.png'
  const url   = `${process.env.NEXT_PUBLIC_SITE_URL}/noticia/${params.slug}`

  return {
    title, description,
    openGraph: { title, description, url, images:[{ url:image }] },
    twitter:   { card:'summary_large_image', title, description, images:[image] }
  }
}

export default async function NoticiaPage({ params }: { params: { slug: string } }) {
  const page = await getPageBySlug(params.slug)
  if (!page) return notFound()

  const p = page.properties as any
  const recordMap = await getRecordMap(page.id)

  return (
    <NoticiaContent
      title       = {p.Name?.title?.[0]?.plain_text        ?? 'Sin título'}
      subtitulo   = {p['Subtítulo']?.rich_text?.[0]?.plain_text ?? ''}
      fecha       = {p.Fecha?.date?.start                  ?? ''}
      description = {p.Resumen?.rich_text?.[0]?.plain_text ?? ''}
      url         = {`${process.env.NEXT_PUBLIC_SITE_URL}/noticia/${params.slug}`}
      recordMap   = {recordMap}
    />
  )
}
