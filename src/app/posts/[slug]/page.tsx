import React from 'react'
import styled from 'styled-components'
import { MDXRemote } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'

import { getPostBySlug, getPostSlugs } from '@/lib/posts'
import prose from '@/styles/prose'

export const dynamicParams = false

export async function generateStaticParams() {
  const slugs = getPostSlugs()
  return slugs.map((s) => ({
    slug: s.replace(/\.mdx?$/, ''),
  }))
}

const Article = styled.article`
  max-width: 780px;
  margin: 40px auto;
  padding: 24px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 18px rgba(15, 23, 42, 0.03);
  ${prose}

  @media (max-width: 768px) {
    margin: 20px auto;
    padding: 18px;
    border-radius: 0;
    box-shadow: none;
  }
`

const Meta = styled.div`
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 18px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
`

const ContentLayout = styled.div`
  display: flex;
  gap: 24px;
  align-items: flex-start;

  @media (max-width: 900px) {
    flex-direction: column;
    gap: 16px;
  }
`

const MainContent = styled.div`
  flex: 1;
  min-width: 0;
  width: 100%;
`

const TocAside = styled.aside`
  width: 220px;
  flex: 0 0 220px;

  @media (max-width: 900px) {
    width: 100%;
    flex: none;
    display: none; /* hide TOC on small screens */
  }
`

function extractHeadings(content: string) {
  const lines = content.split('
')
  const headings: { text: string; id: string; level: number }[] = []

  for (const line of lines) {
    const match = line.match(/^(##+?)\s+(.*)/)
    if (match) {
      const level = match[1].length
      const text = match[2].replace(/`/g, '').trim()
      const id = text.toLowerCase().replace(/[^a-z0-9가-힣]+/g, '-')
      headings.push({ text, id, level })
    }
  }

  return headings
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params
  const post = getPostBySlug(slug)
  if (!post) return {}

  const meta: any = post.meta || {}
  const desc = meta.description || meta.excerpt || (post as any).description || ''

  return {
    title: meta.title || post.slug,
    description: desc,
    openGraph: {
      title: meta.title || post.slug,
      description: desc,
      images: meta.thumbnail ? [{ url: meta.thumbnail }] : undefined,
      url: `https://jamie-next-blog.vercel.app/posts/${post.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title || post.slug,
      description: desc,
    },
  }
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const post = getPostBySlug(slug)

  if (!post) return <div>Not found</div>

  const mdxSource = await serialize(post.content || '')
  const headings = extractHeadings(post.content || '')

  return (
    <Article>
      <h1 style={{ marginBottom: 12, fontSize: 40, fontWeight: 800 }}>{post.meta.title}</h1>

      <Meta>
        <span style={{ fontSize: 14, color: '#6b7280' }}>{post.meta?.category || (post as any).category}</span>
        <span>·</span>
        <span style={{ fontSize: 14, color: '#6b7280' }}>
          {new Date(post.meta.date).toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
          })}
        </span>
        <span>·</span>
        <span style={{ fontSize: 14, color: '#6b7280' }}>{post.readingTime}</span>
        {post.meta.tags ? <span style={{ fontSize: 14, color: '#6b7280' }}>· {post.meta.tags.join(', ')}</span> : null}
      </Meta>

      <ContentLayout>
        <MainContent>
          <div className="prose mt-6">
            <MDXRemote {...mdxSource} />
          </div>
        </MainContent>

        <TocAside>
          <div style={{ position: 'sticky', top: 80 }}>
            <h4 style={{ marginTop: 0, fontSize: 14, color: '#6b7280' }}>
              On this page
            </h4>

            <nav style={{ fontSize: 14 }}>
              {headings.length === 0 ? (
                <div style={{ color: '#9ca3af' }}>No headings</div>
              ) : (
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                  }}
                >
                  {headings.map((h) => (
                    <li key={h.id} style={{ marginLeft: (h.level - 2) * 8 }}>
                      <a href={`#${h.id}`} style={{ color: '#2563eb', textDecoration: 'none' }}>
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </nav>
          </div>
        </TocAside>
      </ContentLayout>
    </Article>
  )
}
