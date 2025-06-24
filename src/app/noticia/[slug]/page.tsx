
// src/app/noticia/[slug]/page.tsx  (versión final compacta)

import { Client } from '@notionhq/client'
import { NotionAPI } from 'notion-client'
import { ExtendedRecordMap } from 'notion-types'
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import NoticiaContent from '@/components/NoticiaContent'

type PageParams = { params: { slug: string } }

export default async function NoticiaPage({ params }: PageParams) {
  const { slug } = params

  const notion = new Client({ auth: process.env.NOTION_TOKEN })
  const dbId = process.env.NOTION_DATABASE_ID!

  const { results } = await notion.databases.query({
    database_id: dbId,
    filter: { property: 'Slug', rich_text: { equals: slug } }
  })

  if (!results.length) return <div>Noticia no encontrada</div>

  const page = results[0] as PageObjectResponse
  const recordMap: ExtendedRecordMap = await new NotionAPI().getPage(page.id)

  const props = page.properties
const title =
  (props.Name && props.Name.type === 'title'
    ? props.Name.title[0]?.plain_text
    : undefined) ?? 'Sin título'


const subtitulo =
  (props['Subtítulo'] && props['Subtítulo'].type === 'rich_text'
    ? props['Subtítulo'].rich_text[0]?.plain_text
    : '') ?? ''



const fecha =
  (props.Fecha && props.Fecha.type === 'date'
    ? props.Fecha.date?.start
    : '') ?? ''


const description =
  (props.Resumen && props.Resumen.type === 'rich_text'
    ? props.Resumen.rich_text[0]?.plain_text
    : '') ?? ''


  const url         = `${process.env.NEXT_PUBLIC_SITE_URL}/noticia/${slug}`

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
