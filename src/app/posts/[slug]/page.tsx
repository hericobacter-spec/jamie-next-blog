import { getPostBySlug } from '@/lib/posts'
import { MDXRemote } from 'next-mdx-remote/rsc'
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

const mdxComponents = {
  pre: (props: any) => <div {...props} />,
  code: ({ className, children }: any) => (
    <CodeBlock className={className}>{children}</CodeBlock>
  ),
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
        <MDXRemote source={post.content || ''} components={mdxComponents} />
      </div>
    </Article>
  )
}
