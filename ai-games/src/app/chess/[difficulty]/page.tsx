import ChessGame from '@/components/chess/ChessGame'

export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const post = await fetchPostBySlug(params.slug);
  const parentMetadata = await parent;

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      ...parentMetadata.openGraph,
      title: post.title,
      description: post.excerpt,
      url: `/posts/${params.slug}`,
      images: [{ url: post.ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      ...parentMetadata.twitter,
      title: post.title,
      description: post.excerpt,
      images: [post.twitterImage],
    },
  };
}

const Page = async () => {
  return (
    <ChessGame />
  )
}

export default Page