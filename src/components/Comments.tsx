'use client'

import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

const Wrapper = styled.section`
  margin-top: 60px;
`

const Inner = styled.div`
  border-radius: var(--radius-card, 28px);
  padding: 32px;
  background: var(--card-bg);

  @media (max-width: 640px) {
    padding: 24px;
    border-radius: var(--radius-card-compact, 20px);
  }
`

const Title = styled.h2`
  margin: 0 0 24px;
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--color-ink, #1d1d1f);
`

const GISCUS_CONFIG = {
  repo: 'hericobacter-spec/jamie-next-blog',
  repoId: 'R_kgDORoYQdw',
  category: 'General',
  categoryId: 'DIC_kwDORoYQd84C5DZq',
  mapping: 'pathname',
  strict: '0',
  reactionsEnabled: '1',
  inputPosition: 'bottom',
  lang: 'ko',
}

type CommentsProps = {
  term?: string
}

export default function Comments({ term }: CommentsProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<'light' | 'dark'>('light')

  // Determine initial theme
  useEffect(() => {
    const saved = localStorage.getItem('theme')
    const initial = saved === 'dark' ? 'dark' : 'light'
    setMode(initial)
  }, [])

  // Listen for theme changes from the toggle
  useEffect(() => {
    const handler = (e: any) => {
      const m = e?.detail?.mode || (localStorage.getItem('theme') === 'dark' ? 'dark' : 'light')
      setMode(m)
    }
    window.addEventListener('theme-change', handler as EventListener)
    return () => window.removeEventListener('theme-change', handler as EventListener)
  }, [])

  // (Re)load Giscus when mode changes
  useEffect(() => {
    const container = ref.current
    if (!container) return

    container.innerHTML = ''

    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.async = true
    script.crossOrigin = 'anonymous'

    const giscusTheme = mode === 'dark' ? 'dark_dimmed' : 'light'

    script.setAttribute('data-repo', GISCUS_CONFIG.repo)
    script.setAttribute('data-repo-id', GISCUS_CONFIG.repoId)
    script.setAttribute('data-category', GISCUS_CONFIG.category)
    script.setAttribute('data-category-id', GISCUS_CONFIG.categoryId)
    script.setAttribute('data-mapping', GISCUS_CONFIG.mapping)
    if (term && GISCUS_CONFIG.mapping === 'specific') {
      script.setAttribute('data-term', term)
    }
    script.setAttribute('data-strict', GISCUS_CONFIG.strict)
    script.setAttribute('data-reactions-enabled', GISCUS_CONFIG.reactionsEnabled)
    script.setAttribute('data-emit-metadata', '0')
    script.setAttribute('data-input-position', GISCUS_CONFIG.inputPosition)
    script.setAttribute('data-theme', giscusTheme)
    script.setAttribute('data-lang', GISCUS_CONFIG.lang)
    script.setAttribute('data-loading', 'lazy')

    container.appendChild(script)
  }, [mode, term])

  return (
    <Wrapper>
      <Inner>
        <Title>Comments</Title>
        <div ref={ref} />
      </Inner>
    </Wrapper>
  )
}
