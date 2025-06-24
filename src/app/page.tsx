// src/app/page.tsx

import Link from 'next/link'
import Image from 'next/image'
import { getDatabaseItems } from '@/lib/notion'

export default async function HomePage() {
  const posts = await getDatabaseItems()

  return (
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Noticias Recientes</h1>

      {posts.map((post: any) => {
        const properties = post.properties
        const title = properties?.Name?.title?.[0]?.plain_text || 'Sin título'
        const slug = properties?.Slug?.rich_text?.[0]?.plain_text || post.id
        const subtitulo = properties?.Subtítulo?.rich_text?.[0]?.plain_text || ''
        const imagenUrl = properties?.Imagen?.url || '' // aquí asumes que Imagen es un campo tipo URL

        return (
          <Link key={post.id} href={`/noticia/${slug}`}>
            <div className="mb-6 p-4 border rounded shadow hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer">
              {imagenUrl && (
                <div className="mb-4 relative aspect-video">
                  <Image
                    src={imagenUrl}
                    alt={title}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              )}
              <h2 className="text-2xl font-bold">{title}</h2>
              {subtitulo && (
                <p className="text-gray-600 dark:text-gray-400">{subtitulo}</p>
              )}
            </div>
          </Link>
        )
      })}
    </main>
  )
}
