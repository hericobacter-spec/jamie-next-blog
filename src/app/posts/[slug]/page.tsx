import { getPostBySlug } from '@/lib/posts'
import { MDXRemote } from 'next-mdx-remote/rsc'
import React from 'react'
import styled from 'styled-components'
import prose from '@/styles/prose'
import CodeBlock from '@/components/CodeBlock'
import Comments from '@/components/Comments'
import remarkGfm from 'remark-gfm'
import type { Metadata } from 'next'

const Article = styled.article`
  max-width:780px;margin:40px auto;padding:24px;background:white;border-radius:8px;box-shadow:0 4px 18px rgba(15,23,42,0.03);
  ${prose}
`

const Meta = styled.div`
  color:#6b7280;font-size:14px;margin-bottom:18px;
`

const mdxComponents = {
  pre: (props: any) => <div {...props} />,
  code: ({ className, children }: any) => (
    <CodeBlock className={className}>{children}</CodeBlock>
  ),
}

const siteUrl = 'https://jamie-next-blog.vercel.app'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolved = await params
  const post = getPostBySlug(resolved.slug)

  if (!post) {
    return {
      title: 'Post not found',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const title = post.meta?.title || 'Post'
  const description = post.meta?.description || 'Jamie Next Blog 포스트'
  const url = `${siteUrl}/posts/${post.slug}`
  const image = post.meta?.thumbnail || '/images/hero-main.jpg'

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'article',
      locale: 'ko_KR',
      url,
      title,
      description,
      images: [
        {
          url: image,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }){
  const resolved = await params
  const post = getPostBySlug(resolved.slug)
  if(!post) return <div>Not found</div>
  return (
    <Article>
      <h1 style={{marginBottom:8}}>{post.meta.title}</h1>
      <Meta>{post.meta.date} • {post.readingTime} {post.meta.tags? '• '+post.meta.tags.join(', '): ''}</Meta>
      <div className="prose mt-6">
        <MDXRemote source={post.content || ''} components={mdxComponents} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
      </div>
      <Comments term={post.slug} />
    </Article>
  )
}
