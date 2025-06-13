// lib/notion.ts
import { Client } from '@notionhq/client'

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

export async function getPublishedPosts(databaseId: string) {
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: 'Publicado',
      checkbox: {
        equals: true,
      },
    },
    sorts: [
      {
        property: 'Fecha',
        direction: 'descending',
      },
    ],
  })

  return response.results
}
