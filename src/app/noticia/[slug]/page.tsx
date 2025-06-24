// src/app/noticia/[slug]/page.tsx
import { Client } from '@notionhq/client'
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { NotionAPI } from 'notion-client'
import { ExtendedRecordMap } from 'notion-types'

import NoticiaContent from '@/components/NoticiaContent'

export default async function NoticiaPage(
  { params }: { params: { slug: string } }
) {
  const { slug } = params

  /* 1️⃣  Obtener la página que corresponde al slug */
  const notion = new Client({ auth: process.env.NOTION_TOKEN })
  const databaseId = process.env.NOTION_DATABASE_ID!

  const { results } = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: 'Slug',
      rich_text: { equals: slug }
    }
  })

  if (!results.length) return <div>Noticia no encontrada</div>

  const page = results[0] as PageObjectResponse

  /* 2️⃣  Descargar el contenido en formato recordMap para react-notion-x */
  const recordMap: ExtendedRecordMap = await new NotionAPI().getPage(page.id)

  /* 3️⃣  Extraer campos con chequeo de tipo seguro */
  const props = page.properties

  const title =
    props.Name?.type === 'title'
      ? props.Name.title[0]?.plain_text ?? 'Sin título'
      : 'Sin título'

  const subtitulo =
    props['Subtítulo']?.type === 'rich_text'
      ? props['Subtítulo'].rich_text[0]?.plain_text ?? ''
      : ''

  const fecha =
    props.Fecha?.type === 'date'
      ? props.Fecha.date?.start ?? ''
      : ''

  const description =
    props.Resumen?.type === 'rich_text'
      ? props.Resumen.rich_text[0]?.plain_text ?? ''
      : ''

  /* 4️⃣  URL canónica para compartir */
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/noticia/${slug}`

  /* 5️⃣  Render del componente de contenido */
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
