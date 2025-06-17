
import { getPublishedPosts } from '@/lib/notion'
import { NotionAPI } from 'notion-client'
import NotionRenderer from '@/components/NotionRenderer'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { useEffect } from 'react'
import { getAbsoluteUrl } from '@/lib/getAbsoluteUrl';
import NoticiaContent from '@/components/NoticiaContent'

function normalizePageId(id: string): string {
  return id
    .replace(/-/g, '')
    .replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5')
}

// METADATOS PARA SEO Y REDES SOCIALES
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const posts: any[] = await getPublishedPosts(process.env.NOTION_DATABASE_ID!)
  const post = posts.find((p) => {
    const s = p.properties.Slug?.rich_text[0]?.plain_text || p.id
    return s === slug
  })

  if (!post) return {}

  const title = post.properties.Name.title[0]?.plain_text || 'Contra Poder'
  const description = post.properties.Resumen?.rich_text[0]?.plain_text || ''
  const image = post.properties.Imagen?.url || '/default-og.png'
  const url = `https://tusitio.com/noticia/${slug}`



  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: [{ url: image }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}

// PÁGINA PRINCIPAL DE LA NOTICIA

export default async function NoticiaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/noticia/${slug}`

  const posts: any[] = await getPublishedPosts(process.env.NOTION_DATABASE_ID!)
  const post = posts.find((p) => {
    const s = p.properties.Slug?.rich_text[0]?.plain_text || p.id
    return s === slug
  })

  if (!post) return notFound()

  const notion = new NotionAPI()
  const recordMap = await notion.getPage(normalizePageId(post.id))

  const title = post.properties.Name.title[0]?.plain_text || 'Sin título'
  const subtitulo = post.properties.Subtítulo?.rich_text[0]?.plain_text || ''
  const fecha = post.properties.Fecha.date?.start || ''
  const description = post.properties.Resumen?.rich_text[0]?.plain_text || ''

  let visitas = 0
  try {
    const res = await fetch(getAbsoluteUrl(`/api/visitas/${slug}`))
    const data = await res.json()
    visitas = data.views || 0
  } catch (err) {
    console.error('Error al obtener visitas:', err)
  }

  return (
    <NoticiaContent
      title={title}
      subtitulo={subtitulo}
      fecha={fecha}
      visitas={visitas}
      slug={slug}
      url={url}
      description={description}
      recordMap={recordMap}
    />
  )
}


// PARA GENERAR PÁGINAS ESTÁTICAS
export async function generateStaticParams() {
  const posts: any[] = await getPublishedPosts(process.env.NOTION_DATABASE_ID!)
  return posts.map((post) => {
    const slug = post.properties.Slug?.rich_text[0]?.plain_text || post.id
    return { slug }
  })
}
