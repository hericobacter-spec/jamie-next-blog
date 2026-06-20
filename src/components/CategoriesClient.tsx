'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

const categories = ['All', 'Blog', 'Foodie', 'A.I', 'Life', 'News']

function getHref(category: string) {
  return category === 'All' ? '/posts' : `/posts?category=${encodeURIComponent(category)}`
}

export default function CategoriesClient() {
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category') ?? 'All'

  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        marginBottom: 24,
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
              padding: '8px 16px',
              borderRadius: 'var(--radius-button, 999px)',
              border: isActive ? 'none' : '1px solid var(--border-strong, #d2d2d7)',
              background: isActive ? 'var(--color-azure, #0071e3)' : 'transparent',
              color: isActive ? '#ffffff' : 'var(--color-ink, #1d1d1f)',
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 400,
              transition: 'background 0.15s ease, border-color 0.15s ease',
            }}
          >
            {category}
          </Link>
        )
      })}
    </div>
  )
}
