import { getPublishedPosts } from '@/lib/notion'
import { NotionAPI } from 'notion-client'
import NotionRenderer from '@/components/NotionRenderer'
import { notFound } from 'next/navigation'
import Link from 'next/link'



function normalizePageId(id: string): string {
  return id
    .replace(/-/g, '')
    .replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5')
}



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





export default async function NoticiaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const url = `http://localhost:3000/noticia/${slug}`
  

  const posts: any[] = await getPublishedPosts(process.env.NOTION_DATABASE_ID!)
  const post = posts.find((p) => {
    const s = p.properties.Slug?.rich_text[0]?.plain_text || p.id
    return s === slug
  })

  if (!post) return notFound()

  const notion = new NotionAPI()
  const recordMap = await notion.getPage(normalizePageId(post.id))

  const title = post.properties.Name.title[0]?.plain_text || 'Sin título'
  const subtitulo =
    post.properties.Subtítulo?.rich_text[0]?.plain_text || ''
  const fecha = post.properties.Fecha.date?.start || ''
  const description = post.properties.Resumen?.rich_text[0]?.plain_text || ''

  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/visitas/${slug}`, {
  next: { revalidate: 60 }, // para que no se cachee permanentemente
})
const data = await res.json()
/* const visitas = data.views || 0 */

let visitas = 0

try {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/visitas/${slug}`)
  const data = await res.json()
  visitas = data.views || 0
} catch (err) {
  console.error('Error al obtener visitas:', err)
}





  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold">{title}</h1>
      

      {subtitulo && (
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
          {subtitulo}
        </p>
      )}
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        <span>{fecha}</span> · <span>{visitas} visita{visitas !== 1 ? 's' : ''}</span>
      </div>
      <hr className="my-4" />
      <NotionRenderer recordMap={recordMap} />



      <div className="mt-6 flex gap-4">
        <span className="text-sm font-medium text-gray-500">Compartir:</span>
        <Link
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
        >
            Facebook
        </Link>
        <Link
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(title)}%20${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:underline"
        >
            WhatsApp
        </Link>
        <Link
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
        >
            X (Twitter)
        </Link>
        <Link
            href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-700 hover:underline"
        >
            LinkedIn
        </Link>
        </div>

      


    </main>
  )
}

export async function generateStaticParams() {
  const posts: any[] = await getPublishedPosts(
    process.env.NOTION_DATABASE_ID!
  )
  return posts.map((post) => {
    const slug =
      post.properties.Slug?.rich_text[0]?.plain_text || post.id
    return { slug }
  })
}



