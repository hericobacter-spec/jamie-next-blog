import React from 'react'
import { getAllPosts } from '@/lib/posts'
import PostCard from '@/components/PostCard'
<<<<<<< HEAD
import React from 'react'
import CategoriesClient from '@/components/CategoriesClient'

export const dynamic = 'force-dynamic'

export default function Posts({ searchParams }: { searchParams?: { category?: string } }) {

  const all = getAllPosts()

  const category = searchParams?.category

  const filtered =
    category && category !== 'All'
      ? all.filter((p: any) => p?.category === category || p?.meta?.category === category)
      : all

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16 }}>Posts</h1>
=======
import CategoriesClient from '@/components/CategoriesClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

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
    const rawCategory = post?.category ?? post?.meta?.category
    return normalizeCategory(rawCategory) === category
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
>>>>>>> feature/add-phu-quoc-post-clean2

      <React.Suspense fallback={<div />}>
        <CategoriesClient />
      </React.Suspense>

<<<<<<< HEAD
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
        {filtered.map((p: any) => (
          <PostCard key={p.slug} post={p} />
=======
      <div
        key={currentCategory}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))',
          gap: 20,
        }}
      >
        {filteredPosts.map((post: any) => (
          <PostCard key={post.slug} post={post} />
>>>>>>> feature/add-phu-quoc-post-clean2
        ))}
      </div>
    </div>
  )
}