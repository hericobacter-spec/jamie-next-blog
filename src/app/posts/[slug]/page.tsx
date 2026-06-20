import { getPostBySlug } from '@/lib/posts'
import { MDXRemote } from 'next-mdx-remote/rsc'
import React from 'react'
import styled from 'styled-components'
import prose from '@/styles/prose'
import CodeBlock from '@/components/CodeBlock'
import Comments from '@/components/Comments'
import remarkGfm from 'remark-gfm'
import type { Metadata } from 'next'

const ArticleWrap = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 80px 24px 120px;
  ${prose}
`

const Title = styled.h1`
  font-size: clamp(2rem, 6vw, 3rem);
  font-weight: 700;
  line-height: 1.07;
  letter-spacing: -0.022em;
  margin: 0 0 8px;
  color: var(--color-ink, #1d1d1f);
`

const Meta = styled.div`
  color: var(--muted, #707070);
  font-size: 14px;
  margin-bottom: 40px;
  border-bottom: 1px solid var(--border);
  padding-bottom: 20px;
`

const mdxComponents = {
  pre: (props: any) => <div {...props} />,
  code: ({ className, children }: any) => <CodeBlock className={className}>{children}</CodeBlock>,
}

const siteUrl = 'https://jamie-next-blog.vercel.app'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const resolved = await params
  const post = getPostBySlug(resolved.slug)

  if (!post) {
    return { title: 'Post not found', robots: { index: false, follow: false } }
  }

  const title = post.meta?.title || 'Post'
  const description = post.meta?.description || 'Jamie Next Blog 포스트'
  const url = `${siteUrl}/posts/${post.slug}`
  const image = post.meta?.thumbnail || '/images/hero-main.jpg'

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      locale: 'ko_KR',
      url,
      title,
      description,
      images: [{ url: image, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolved = await params
  const post = getPostBySlug(resolved.slug)
  if (!post) return <div style={{ padding: 80, textAlign: 'center' }}>Not found</div>

  return (
    <ArticleWrap>
      <Title>{post.meta.title}</Title>
      <Meta>
        {post.meta.date} · {post.readingTime}
        {post.meta.tags ? ' · ' + post.meta.tags.join(', ') : ''}
      </Meta>
      <div className="prose">
        <MDXRemote
          source={post.content || ''}
          components={mdxComponents}
          options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
        />
      </div>
      <Comments term={post.slug} />
    </ArticleWrap>
  )
}
