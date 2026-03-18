'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

const categories = ['All', 'Blog', 'Foodie', 'A.I', 'Life']

function getHref(category: string) {
  return category === 'All'
    ? '/posts'
    : `/posts?category=${encodeURIComponent(category)}`
}

export default function CategoriesClient() {
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category') ?? 'All'

  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        marginBottom: 20,
        flexWrap: 'wrap',
      }}
    >
      {categories.map((category) => {
        const isActive = currentCategory === category

        return (
          <Link
            key={category}
            href={getHref(category)}
            prefetch={false}
            style={{
              padding: '8px 14px',
              borderRadius: 999,
              border: '1px solid',
              borderColor: isActive ? '#111827' : '#d1d5db',
              background: isActive ? '#111827' : '#ffffff',
              color: isActive ? '#ffffff' : '#111827',
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            {category}
          </Link>
        )
      })}
    </div>
  )
}