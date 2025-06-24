
// lib/notion.ts

import { Client } from '@notionhq/client'
import { NotionAPI } from 'notion-client'
import { ExtendedRecordMap } from 'notion-types'

const notion = new Client({ auth: process.env.NOTION_TOKEN! })

export async function getDatabaseItems() {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      property: 'Publicado',
      checkbox: { equals: true }
    },
    sorts: [
      { property: 'Fecha', direction: 'descending' }
    ]
  })

  return response.results
}

export async function getPageContent(pageId: string): Promise<ExtendedRecordMap> {
  const notionX = new NotionAPI()
  return await notionX.getPage(pageId)
}
