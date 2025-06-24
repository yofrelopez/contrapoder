import { NotionAPI } from 'notion-client';
import { ExtendedRecordMap } from 'notion-types';
import NoticiaContent from '@/components/NoticiaContent';
import { Client } from '@notionhq/client';

type PageProps<T> = {
  params: T;
};


type PageParams = {
  params: { slug: string };  // ✅ SIN PROMISE
};




export default async function NoticiaPage({ params }: PageProps<{ slug: string }>) {

const { slug } = params;


  const notion = new Client({
    auth: process.env.NOTION_TOKEN,
  });

  const databaseId = process.env.NOTION_DATABASE_ID!;
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: 'Slug',
      rich_text: {
        equals: slug,
      },
    },
  });

  if (!response.results.length) {
    return <div>Noticia no encontrada</div>;
  }

  const page = response.results[0] as any;
  const pageId = page.id;

  const recordMap: ExtendedRecordMap = await new NotionAPI().getPage(pageId);

  const title = page.properties?.Name?.title?.[0]?.plain_text || 'Sin título';
  const subtitulo = page.properties?.Subtítulo?.rich_text?.[0]?.plain_text || '';
  const fecha = page.properties?.Fecha?.date?.start ?? '';
  const description = page.properties?.Resumen?.rich_text?.[0]?.plain_text || '';
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/noticia/${slug}`;

  return (
    <NoticiaContent
      title={title}
      subtitulo={subtitulo}
      fecha={fecha}
      description={description}
      url={url}
      recordMap={recordMap}
    />
  );
}


