export const dynamic = 'force-dynamic'

import React from 'react'
import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/posts'
import PostCard from '@/components/PostCard'
import CategoriesClient from '@/components/CategoriesClient'

export const metadata: Metadata = {
  title: 'Posts',
  description:
    'Jamie Next Blog의 전체 포스트 목록. AI, 맛집, 여행, 블로그 제작 기록을 카테고리별로 볼 수 있습니다.',
  alternates: { canonical: '/posts' },
  openGraph: {
    title: 'Posts | Jamie Next Blog',
    description:
      'AI, 맛집, 여행, 블로그 제작 기록을 카테고리별로 볼 수 있습니다.',
    url: 'https://jamie-next-blog.vercel.app/posts',
    type: 'website',
  },
}

type Category = 'All' | 'Blog' | 'Foodie' | 'A.I' | 'Life' | 'News'

type SearchParamsInput = { category?: string } | Promise<{ category?: string }> | undefined

function normalizeCategory(input?: string): Category {
  const value = (input ?? '').toString().trim().toLowerCase()
  if (!value || value === 'all') return 'All'
  if (value === 'blog') return 'Blog'
  if (value === 'foodie') return 'Foodie'
  if (value === 'life') return 'Life'
  if (value === 'news') return 'News'
  const aiVariants = ['a.i', 'ai', 'a.i.', 'a i']
  if (aiVariants.includes(value)) return 'A.I'
  return 'All'
}

function filterPostsByCategory(posts: any[], category: Category) {
  if (category === 'All') return posts
  return posts.filter((p) => normalizeCategory(p.category ?? p?.meta?.category) === category)
}

export default async function PostsPage({ searchParams }: { searchParams?: SearchParamsInput }) {
  const resolvedSearchParams = await Promise.resolve(searchParams)
  const allPosts = getAllPosts()
  const rawCategory = resolvedSearchParams?.category
  const currentCategory = normalizeCategory(rawCategory)
  const filteredPosts = filterPostsByCategory(allPosts, currentCategory)

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px 120px' }}>
      <h1
        style={{
          fontSize: 40,
          fontWeight: 600,
          letterSpacing: '-0.01em',
          margin: '0 0 24px',
          color: 'var(--color-ink, #1d1d1f)',
        }}
      >
        Posts
      </h1>
      <React.Suspense fallback={<div />}>
        <CategoriesClient />
      </React.Suspense>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: 1,
          background: 'var(--border)',
          borderRadius: 'var(--radius-card, 28px)',
          overflow: 'hidden',
        }}
      >
        {filteredPosts.map((post: any) => (
          <div key={post.slug} style={{ background: 'var(--card-bg)' }}>
            <PostCard post={post} />
          </div>
        ))}
      </div>
    </div>
  )
}
