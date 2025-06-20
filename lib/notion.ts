import { Client } from '@notionhq/client';
import { QueryDatabaseResponse, PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { NotionAPI } from 'notion-client';




// Inicializamos el cliente oficial de Notion
const notion = new Client({
  auth: process.env.NOTION_TOKEN!,
});

const databaseId = process.env.NOTION_DATABASE_ID!;

export async function getDatabaseItems(): Promise<PageObjectResponse[]> {
  const response = await notion.databases.query({
    database_id: databaseId,
    sorts: [
      {
        property: 'Fecha',
        direction: 'descending',
      },
    ],
  });

  // Cast para indicar que todos los resultados son páginas completas
  return response.results as PageObjectResponse[];
}

export async function getPostBySlug(slug: string): Promise<PageObjectResponse | null> {
  const items = await getDatabaseItems();
  return items.find((item) => {
    const slugProp = item.properties['Slug'];
    if (slugProp?.type === 'rich_text') {
      return slugProp.rich_text[0]?.plain_text === slug;
    }
    return false;
  }) ?? null;
}

export async function getRecordMap(pageId: string) {
  const notionClient = new NotionAPI();
  return await notionClient.getPage(pageId);
}
