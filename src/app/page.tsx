// src/app/page.tsx
export const revalidate = 60   // ISR cada minuto

import { getDatabaseItems } from '@/lib/notion'
import Image from 'next/image'
import Link from 'next/link'

export default async function HomePage() {
  const posts = await getDatabaseItems()

  return (
    <main className="max-w-4xl mx-auto p-4">
      {posts.map(post => {
        const p = post.properties as any
        const title      = p.Name?.title?.[0]?.plain_text        ?? 'Sin título'
        const subtitle   = p['Subtítulo']?.rich_text?.[0]?.plain_text ?? ''
        const slug       = p.Slug?.rich_text?.[0]?.plain_text    ?? post.id
        const fecha      = p.Fecha?.date?.start                  ?? ''
        const imagenUrl  = p.Imagen?.url                         ?? ''

        return (
          <Link key={post.id} href={`/noticia/${slug}`} className="block mb-8 group">
            {imagenUrl && (
              <div className="relative w-full aspect-video mb-2">
                <Image
                  src={imagenUrl}
                  alt={title}
                  fill
                  className="object-cover rounded-md transition-opacity group-hover:opacity-90"
                  sizes="(max-width: 768px) 100vw, 600px"
                  priority
                />
              </div>
            )}

            <h2 className="text-2xl font-bold">{title}</h2>
            {subtitle && <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>}
            <span className="text-sm text-gray-500">{fecha}</span>
          </Link>
        )
      })}
    </main>
  )
}
