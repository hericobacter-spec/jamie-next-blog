import React from 'react'
import { getAllPosts } from '@/lib/posts'
import PostCard from '@/components/PostCard'
import CategoriesClient from '@/components/CategoriesClient'

export const dynamic = 'force-dynamic'

type Category = 'All' | 'Blog' | 'Foodie' | 'A.I' | 'Life'

type SearchParamsInput =
  | { category?: string }
  | Promise<{ category?: string }>
  | undefined

function normalizeCategory(input?: string): Category {
  const value = (input ?? '').trim().toLowerCase()

  if (!value || value === 'all') return 'All'
  if (value === 'blog') return 'Blog'
  if (value === 'foodie') return 'Foodie'
  if (value === 'life') return 'Life'
  if (value === 'a.i' || value === 'ai' || value === 'a.i.' || value === 'a i') {
    return 'A.I'
  }

  return 'All'
}

function filterPostsByCategory(posts: any[], category: Category) {
  if (category === 'All') return posts

  return posts.filter((post: any) => {
    const raw = post?.category ?? post?.meta?.category
    return normalizeCategory(raw) === category
  })
}

export default async function PostsPage({
  searchParams,
}: {
  searchParams?: SearchParamsInput
}) {
  const resolvedSearchParams = await Promise.resolve(searchParams)
  const allPosts = getAllPosts()

  const rawCategory = resolvedSearchParams?.category
  const currentCategory = normalizeCategory(rawCategory)
  const filteredPosts = filterPostsByCategory(allPosts, currentCategory)

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16 }}>
        Posts
      </h1>

      <React.Suspense fallback={<div />}>
        <CategoriesClient />
      </React.Suspense>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))',
          gap: 20,
        }}
      >
        {filteredPosts.map((post: any) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  )
}