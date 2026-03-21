export const dynamic = 'force-dynamic'

import React from 'react'
import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/posts'
import PostCard from '@/components/PostCard'
import CategoriesClient from '@/components/CategoriesClient'

export const metadata: Metadata = {
  title: 'Posts',
  description: 'Jamie Next Blog의 전체 포스트 목록. AI, 맛집, 여행, 블로그 제작 기록을 카테고리별로 볼 수 있습니다.',
  alternates: {
    canonical: '/posts',
  },
  openGraph: {
    title: 'Posts | Jamie Next Blog',
    description: 'AI, 맛집, 여행, 블로그 제작 기록을 카테고리별로 볼 수 있습니다.',
    url: 'https://jamie-next-blog.vercel.app/posts',
    type: 'website',
  },
}

type Category = 'All' | 'Blog' | 'Foodie' | 'A.I' | 'Life'

type SearchParamsInput = { category?: string } | Promise<{ category?: string }> | undefined

function normalizeCategory(input?: string): Category {
  const value = (input ?? '').toString().trim().toLowerCase()
  if (!value || value === 'all') return 'All'
  if (value === 'blog') return 'Blog'
  if (value === 'foodie') return 'Foodie'
  if (value === 'life') return 'Life'
  const aiVariants = ['a.i', 'ai', 'a.i.', 'a i']
  if (aiVariants.includes(value)) return 'A.I'
  return 'All'
}

function filterPostsByCategory(posts: any[], category: Category){
  if(category === 'All') return posts
  return posts.filter(p => normalizeCategory(p.category ?? p?.meta?.category) === category)
}

export default async function PostsPage({ searchParams }: { searchParams?: SearchParamsInput }){
  const resolvedSearchParams = await Promise.resolve(searchParams)
  const allPosts = getAllPosts()
  const rawCategory = resolvedSearchParams?.category
  const currentCategory = normalizeCategory(rawCategory)
  const filteredPosts = filterPostsByCategory(allPosts, currentCategory)

  return (
    <div style={{maxWidth:960,margin:'0 auto',padding:24}}>
      <h1 style={{fontSize:32,fontWeight:700,marginBottom:16}}>Posts</h1>
      <React.Suspense fallback={<div /> }>
        <CategoriesClient />
      </React.Suspense>
      <div key={currentCategory} style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:20}}>
        {filteredPosts.map((post:any)=> <PostCard key={post.slug} post={post} />)}
      </div>
    </div>
  )
}
