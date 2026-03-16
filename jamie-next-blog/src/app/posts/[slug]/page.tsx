import { getPostBySlug } from '@/lib/posts'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote'
import React from 'react'
import styled from 'styled-components'
import prose from '@/styles/prose'
import CodeBlock from '@/components/CodeBlock'

const Article = styled.article`
  max-width:780px;margin:40px auto;padding:24px;background:white;border-radius:8px;box-shadow:0 4px 18px rgba(15,23,42,0.03);
  ${prose}
`

const Meta = styled.div`
  color:#6b7280;font-size:14px;margin-bottom:18px;display:flex;gap:8px;flex-wrap:wrap;align-items:center
`
const components = {
  pre: (props:any)=> <div {...props} />,
  code: ({className, children}:any)=> <CodeBlock className={className}>{children}</CodeBlock>
}

function extractHeadings(content:string){
  const lines = content.split('\n')
  const headings: {text:string,id:string,level:number}[] = []
  for(const l of lines){
    const m = l.match(/^(##+?)\s+(.*)/)
    if(m){
      const level = m[1].length
      const text = m[2].replace(/`/g,'').trim()
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g,'-')
      headings.push({text,id,level})
    }
  }
  return headings
}

export default async function PostPage({ params }: { params: { slug: string } }){
  const post = getPostBySlug(params.slug)
  if(!post) return <div>Not found</div>
  const mdxSource = await serialize(post.content || '')
  const headings = extractHeadings(post.content || '')
  return (
    <Article>
      <h1 style={{marginBottom:8}}>{post.meta.title}</h1>
      <Meta>
        <span>{post.meta.category || post.category}</span>
        <span>·</span>
        <span>{new Date(post.meta.date).toLocaleDateString('en-US',{month:'short',day:'2-digit',year:'numeric'})}</span>
        <span>·</span>
        <span>{post.readingTime}</span>
        {post.meta.tags? <span>· {post.meta.tags.join(', ')}</span> : null}
      </Meta>

      <div style={{display:'flex',gap:24}}>
        <div style={{flex:1}}>
          <div className="prose mt-6">
            <MDXRemote {...mdxSource} components={components} />
          </div>
        </div>
        <aside style={{width:220,flex:'0 0 220px'}}>
          <div style={{position:'sticky',top:80}}>
            <h4 style={{marginTop:0,fontSize:14,color:'#6b7280'}}>On this page</h4>
            <nav style={{fontSize:14}}>
              {headings.length===0? <div style={{color:'#9ca3af'}}>No headings</div> : (
                <ul style={{listStyle:'none',padding:0,margin:0,display:'flex',flexDirection:'column',gap:6}}>
                  {headings.map(h=> (
                    <li key={h.id} style={{marginLeft: (h.level-2)*8}}><a href={`#${h.id}`} style={{color:'#2563eb',textDecoration:'none'}}>{h.text}</a></li>
                  ))}
                </ul>
              )}
            </nav>
          </div>
        </aside>
      </div>
    </Article>
  )
}
