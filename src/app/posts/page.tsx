import React from 'react'
import { getAllPosts } from '@/lib/posts'
import { normalizeCategory, filterPostsByCategory } from '@/lib/category'
import PostCard from '@/components/PostCard'
import CategoriesClient from '@/components/CategoriesClient'

export const dynamic = 'force-dynamic'

type SearchParams = {
  category?: string
}

export default function PostsPage({
  searchParams,
}: {
  searchParams?: SearchParams
}) {
  const allPosts = getAllPosts()

  const rawCategory = searchParams?.category
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