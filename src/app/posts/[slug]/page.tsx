import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import styled from 'styled-components'
import remarkGfm from 'remark-gfm'
import type { Metadata } from 'next'
import { getPostBySlug, getPostImage, getRelatedPosts, isIndexablePost } from '@/lib/posts'
import prose from '@/styles/prose'
import CodeBlock from '@/components/CodeBlock'
import Comments from '@/components/Comments'
import PostCard from '@/components/PostCard'

const siteUrl = 'https://jamie-next-blog.vercel.app'

const Shell = styled.main`
  width: min(100% - 40px, 1180px);
  margin: 0 auto;
  padding: clamp(56px, 8vw, 112px) 0 40px;

  @media (max-width: 640px) {
    width: min(100% - 28px, 1180px);
  }
`

const ArticleHeader = styled.header`
  max-width: 940px;
  margin: 0 auto;
  text-align: center;
`

const Breadcrumb = styled.div`
  margin-bottom: 24px;
  color: var(--forest);
  font-size: 13px;
  font-weight: 700;

  a {
    color: inherit;
  }
`

const Title = styled.h1`
  margin: 0;
  font-family: var(--font-serif), serif;
  font-size: clamp(2.5rem, 6.4vw, 5.5rem);
  font-weight: 600;
  line-height: 1.18;
  letter-spacing: -0.065em;
  text-wrap: balance;
`

const Deck = styled.p`
  max-width: 760px;
  margin: 24px auto 0;
  color: var(--muted);
  font-size: clamp(1rem, 2vw, 1.22rem);
  line-height: 1.75;
  text-wrap: balance;
`

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 9px;
  margin-top: 28px;
  color: var(--muted);
  font-size: 13px;

  strong {
    color: var(--color-ink);
  }
`

const HeroImage = styled.div`
  position: relative;
  aspect-ratio: 16 / 9;
  margin: 54px 0 0;
  overflow: hidden;
  background: linear-gradient(140deg, var(--sand), var(--sage));
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);

  img {
    object-fit: cover;
  }

  @media (max-width: 640px) {
    margin-top: 38px;
    border-radius: var(--radius-card-compact);
  }
`

const ArticleWrap = styled.article`
  max-width: 760px;
  margin: 0 auto;
  padding: 64px 0 30px;
  ${prose}

  @media (max-width: 640px) {
    padding-top: 44px;
  }
`

const Author = styled.aside`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 18px;
  align-items: center;
  max-width: 760px;
  margin: 46px auto 0;
  padding: 24px;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-card-compact);

  @media (max-width: 640px) {
    grid-template-columns: auto 1fr;

    > a {
      grid-column: 1 / -1;
    }
  }
`

const Avatar = styled.div`
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  color: var(--primary-foreground);
  background: var(--forest);
  border-radius: 50%;
  font-family: var(--font-serif), serif;
  font-size: 21px;
  font-weight: 700;
`

const AuthorCopy = styled.div`
  strong {
    display: block;
    margin-bottom: 3px;
  }

  p {
    margin: 0;
    color: var(--muted);
    font-size: 14px;
    line-height: 1.6;
  }
`

const AuthorLink = styled(Link)`
  font-size: 14px;
  font-weight: 700;
`

const Related = styled.section`
  padding: 82px 0 30px;
  border-top: 1px solid var(--border);

  h2 {
    margin: 0 0 28px;
    font-family: var(--font-serif), serif;
    font-size: clamp(1.9rem, 4vw, 3rem);
    font-weight: 600;
    letter-spacing: -0.055em;
  }
`

const RelatedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;

  @media (max-width: 840px) {
    grid-template-columns: 1fr;
  }
`

const mdxComponents = {
  pre: (props: any) => <div {...props} />,
  code: ({ className, children }: any) => <CodeBlock className={className}>{children}</CodeBlock>,
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) return { title: '글을 찾을 수 없습니다', robots: { index: false, follow: false } }

  const title = post.meta.title || '글'
  const description = post.meta.description || `${title}에 관한 Jamie의 기록입니다.`
  const url = `${siteUrl}/posts/${post.slug}`
  const image = getPostImage(post) || '/images/hero-main.jpg'
  const indexable = isIndexablePost(post)

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: indexable ? undefined : { index: false, follow: false, googleBot: { index: false, follow: false } },
    openGraph: {
      type: 'article',
      locale: 'ko_KR',
      url,
      title,
      description,
      publishedTime: post.meta.date,
      authors: ['Jamie'],
      images: [{ url: image, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const image = getPostImage(post)
  const related = isIndexablePost(post) ? getRelatedPosts(post) : []
  const description = post.meta.description || ''
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.meta.title,
    description,
    datePublished: post.meta.date,
    author: { '@type': 'Person', name: 'Jamie', url: `${siteUrl}/about` },
    publisher: { '@type': 'Organization', name: 'Jamie Next Blog', url: siteUrl },
    mainEntityOfPage: `${siteUrl}/posts/${post.slug}`,
    ...(image ? { image: `${siteUrl}${image}` } : {}),
  }

  return (
    <Shell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <ArticleHeader>
        <Breadcrumb><Link href="/posts">모든 기록</Link> / {post.meta.category || '기록'}</Breadcrumb>
        <Title>{post.meta.title}</Title>
        {description ? <Deck>{description}</Deck> : null}
        <Meta>
          <strong>Jamie</strong><span>·</span><time dateTime={post.meta.date}>{post.meta.date}</time><span>·</span><span>{post.readingTime}</span>
        </Meta>
      </ArticleHeader>

      {image ? <HeroImage><Image src={image} alt="" fill priority sizes="(max-width: 1180px) 100vw, 1180px" /></HeroImage> : null}

      <ArticleWrap>
        <div className="prose">
          <MDXRemote source={post.content || ''} components={mdxComponents} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
        </div>
        <Comments term={post.slug} />
      </ArticleWrap>

      <Author>
        <Avatar aria-hidden="true">J</Avatar>
        <AuthorCopy>
          <strong>Jamie</strong>
          <p>직접 사용하고 방문하고 경험한 것을 과장 없이 기록합니다. AI 도구, 가족 여행, 동네의 맛에 관심이 많습니다.</p>
        </AuthorCopy>
        <AuthorLink href="/about">작성 원칙 ↗</AuthorLink>
      </Author>

      {related.length ? (
        <Related>
          <h2>이어지는 기록</h2>
          <RelatedGrid>{related.map((item) => <PostCard key={item.slug} post={item} />)}</RelatedGrid>
        </Related>
      ) : null}
    </Shell>
  )
}
