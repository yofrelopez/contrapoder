import { Client } from "@notionhq/client";
import { NotionAPI } from "notion-client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export async function getDatabaseItems() {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
  });

  return response.results as any[];
}

export async function getPageContent(pageId: string) {
  const notionClient = new NotionAPI();
  const recordMap = await notionClient.getPage(pageId);
  return recordMap;
}
