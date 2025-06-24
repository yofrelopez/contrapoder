import { Metadata } from "next";
import { getDatabaseItems, getPageContent } from "@/lib/notion";
import NoticiaContent from "@/components/NoticiaContent";

type Props = {
  params: { slug: string };
};

// Genera los paths en build
export async function generateStaticParams() {
  const posts = await getDatabaseItems();
  return posts.map((post) => ({
    slug: post.properties.Slug?.rich_text?.[0]?.plain_text,
  }));
}

// Genera los metadatos para SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const posts = await getDatabaseItems();
  const post = posts.find(
    (p) => p.properties.Slug?.rich_text?.[0]?.plain_text === params.slug
  );

  if (!post) return {};

  return {
    title: post.properties.Name?.title?.[0]?.plain_text,
    description: post.properties.Resumen?.rich_text?.[0]?.plain_text || "",
  };
}

export default async function NoticiaPage({ params }: Props) {
  const posts = await getDatabaseItems();
  const post = posts.find(
    (p) => p.properties.Slug?.rich_text?.[0]?.plain_text === params.slug
  );

  if (!post) return <div>Post no encontrado</div>;

  const recordMap = await getPageContent(post.id);

  return (
    <NoticiaContent
      title={post.properties.Name.title[0].plain_text}
      subtitulo={post.properties.Subtítulo?.rich_text?.[0]?.plain_text || ""}
      fecha={post.properties.Fecha?.date?.start || ""}
      description={post.properties.Resumen?.rich_text?.[0]?.plain_text || ""}
      recordMap={recordMap}
      url={`${process.env.NEXT_PUBLIC_SITE_URL}/noticia/${params.slug}`}
    />
  );
}

