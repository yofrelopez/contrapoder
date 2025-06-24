// lib/notion.ts
import { Client } from '@notionhq/client'
import { NotionAPI } from 'notion-client'
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import type { RecordMap, ExtendedRecordMap } from 'notion-types'

const notion = new Client({ auth: process.env.NOTION_TOKEN })

// ────────────────────────────────────────────────────────────
// Lista todos los posts publicados (ordenados por fecha desc.)
// ────────────────────────────────────────────────────────────
export async function getDatabaseItems() {
  const { results } = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    sorts: [{ property: 'Fecha', direction: 'descending' }],
    filter: {
      property: 'Publicado',
      checkbox: { equals: true }
    }
  })
  return results as PageObjectResponse[]
}

// ────────────────────────────────────────────────────────────
// Devuelve la página de Notion que coincide con el slug
// ────────────────────────────────────────────────────────────
export async function getPageBySlug(slug: string) {
  const { results } = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      property: 'Slug',
      rich_text: { equals: slug }
    },
    page_size: 1
  })
  return (results[0] ?? null) as PageObjectResponse | null
}

// ────────────────────────────────────────────────────────────
// Descarga el contenido completo (recordMap) para <NotionRenderer>
// ────────────────────────────────────────────────────────────

export async function getRecordMap(pageId: string) {
  const api = new NotionAPI()
  return api.getPage(pageId) as Promise<ExtendedRecordMap>
}
