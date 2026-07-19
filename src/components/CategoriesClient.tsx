'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

const categories = [
  { value: 'All', label: '전체' },
  { value: 'A.I', label: 'AI & Tech' },
  { value: 'Life', label: '일상 & 여행' },
  { value: 'Foodie', label: '맛집' },
  { value: 'Blog', label: '블로그 제작' },
]

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
        const isActive = currentCategory === category.value || (category.value === 'All' && !searchParams.get('category'))

        return (
          <Link
            key={category.value}
            href={getHref(category.value)}
            prefetch={false}
            aria-current={isActive ? 'page' : undefined}
            style={{
              padding: '9px 17px',
              borderRadius: 'var(--radius-button, 999px)',
              border: isActive ? 'none' : '1px solid var(--border-strong, #d2d2d7)',
              background: isActive ? 'var(--forest)' : 'var(--card-bg)',
              color: isActive ? '#ffffff' : 'var(--color-ink, #1d1d1f)',
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 600,
              transition: 'background 0.15s ease, border-color 0.15s ease',
            }}
          >
            {category.label}
          </Link>
        )
      })}
    </div>
  )
}
