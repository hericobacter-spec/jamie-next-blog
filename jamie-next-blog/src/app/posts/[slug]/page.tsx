import { getPostBySlug } from '@/lib/posts'
import { serialize } from 'next-mdx-remote/mdx'
import { MDXRemote } from 'next-mdx-remote'
import React from 'react'

export default async function PostPage({ params }: { params: { slug: string } }){
  const post = getPostBySlug(params.slug)
  if(!post) return <div>Not found</div>
  const mdxSource = await serialize(post.content || '')
  return (
    <div style={{maxWidth:800,margin:'0 auto',padding:24}}>
      <h1>{post.meta.title}</h1>
      <div className="prose mt-6">
        <MDXRemote {...mdxSource} />
      </div>
    </div>
  )
}
