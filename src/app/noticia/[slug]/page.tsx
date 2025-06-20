import { getPostBySlug, getDatabaseItems, getRecordMap } from '@/lib/notion';
import NoticiaContent from '@/components/NoticiaContent';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const posts = await getDatabaseItems();
  return posts.map((post) => {
    const slugProp = post.properties['Slug'];
    const slug = slugProp?.type === 'rich_text' ? slugProp.rich_text[0]?.plain_text : post.id;
    return { slug };
  });
}


type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;

  const post = await getPostBySlug(slug);
  if (!post) return {};

  const title = post.properties['Name'].type === 'title'
    ? post.properties['Name'].title[0]?.plain_text
    : 'Sin título';

  return {
    title: `${title} - Contra Poder`,
  };
}





export default async function NoticiaPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;

  const post = await getPostBySlug(slug);
  if (!post) return notFound();

  const title = post.properties['Name'].type === 'title'
    ? post.properties['Name'].title[0]?.plain_text
    : 'Sin título';

  const subtitulo = post.properties['Subtítulo']?.type === 'rich_text'
    ? post.properties['Subtítulo'].rich_text[0]?.plain_text
    : '';

  const fecha = post.properties['Fecha']?.type === 'date'
    ? post.properties['Fecha'].date?.start
    : undefined; // lo dejamos opcional

  const description = post.properties['Resumen']?.type === 'rich_text'
    ? post.properties['Resumen'].rich_text[0]?.plain_text
    : '';

  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/noticia/${slug}`;

  const recordMap = await getRecordMap(post.id);

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
