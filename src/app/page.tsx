// app/page.tsx
import { getPublishedPosts } from '@/lib/notion'
import Image from 'next/image'
import Link from 'next/link'

export default async function HomePage() {
  const posts = await getPublishedPosts(process.env.NOTION_DATABASE_ID!)
  console.log('posts:', posts)

  return (
    <main className="max-w-3xl mx-auto p-4">
      {/* <h1 className="text-3xl font-bold mb-6">Contra Poder</h1> */}
      <ul className="space-y-4">
        {posts.map((post: any) => {
          const title = post.properties.Name.title[0]?.plain_text || 'Sin título'
          const fecha = post.properties.Fecha.date?.start || 'Sin fecha'
          const subtitulo = post.properties.Subtítulo?.rich_text[0]?.plain_text || ''
          const slug = post.properties.Slug?.rich_text[0]?.plain_text || post.id
          const imagen = post.properties.Imagen?.url || null

          return (
            <li key={post.id}>
              <Link href={`/noticia/${slug}`} className="block group">
                {imagen && (
                  <div className="mb-2 aspect-video relative w-full">
                    <Image
                      src={imagen}
                      alt={title}
                      fill
                      className="object-cover rounded-md group-hover:opacity-90 transition-opacity"
                      sizes="(max-width: 768px) 100vw, 600px"
                      priority
                    />
                  </div>
                )}
                <h2 className="text-xl font-semibold">{title}</h2>
                {subtitulo && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">{subtitulo}</p>
                )}
                <span className="text-xs text-gray-500">{fecha}</span>
              </Link>
            </li>
          )


          
          
        })}
      </ul>
    </main>
  )
}
