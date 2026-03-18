import { getPostBySlug } from '@/lib/posts'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote'
import ClientMDX from '@/components/ClientMDX'
import React from 'react'
import styled from 'styled-components'
import prose from '@/styles/prose'
import CodeBlock from '@/components/CodeBlock'

const Article = styled.article`
  max-width:780px;margin:40px auto;padding:24px;background:white;border-radius:8px;box-shadow:0 4px 18px rgba(15,23,42,0.03);
  ${prose}
`

const Meta = styled.div`
  color:#6b7280;font-size:14px;margin-bottom:18px;
`

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }){
  // In App Router params may be a Promise; await to unwrap before use
  const resolved = await params
  const post = getPostBySlug(resolved.slug)
  if(!post) return <div>Not found</div>
  // Diagnostic checks: ensure loader provided content as string
  if (!post.content) {
    throw new Error(`DEBUG_EMPTY_CONTENT: slug=${resolved.slug}`)
  }
  if (typeof post.content !== 'string') {
    throw new Error(`DEBUG_INVALID_CONTENT_TYPE: slug=${resolved.slug} type=${typeof post.content}`)
  }
  const mdxSource = await serialize(post.content || '')
  return (
    <Article>
      <h1 style={{marginBottom:8}}>{post.meta.title}</h1>
      <Meta>{post.meta.date} • {post.readingTime} {post.meta.tags? '• '+post.meta.tags.join(', '): ''}</Meta>
      <div className="prose mt-6">
        <ClientMDX mdxSource={mdxSource} />
      </div>
    </Article>
  )
}
