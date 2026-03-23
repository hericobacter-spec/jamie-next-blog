'use client'

import { useEffect, useRef } from 'react'
import styled from 'styled-components'

const Wrapper = styled.section`
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
`

const Title = styled.h2`
  margin: 0 0 16px;
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
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
  theme: 'preferred_color_scheme',
  lang: 'ko',
}

type CommentsProps = {
  term?: string
}

export default function Comments({ term }: CommentsProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = ref.current
    if (!container) return

    container.innerHTML = ''

    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.async = true
    script.crossOrigin = 'anonymous'

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
    script.setAttribute('data-theme', GISCUS_CONFIG.theme)
    script.setAttribute('data-lang', GISCUS_CONFIG.lang)
    script.setAttribute('data-loading', 'lazy')

    container.appendChild(script)
  }, [term])

  return (
    <Wrapper>
      <Title>Comments</Title>
      <div ref={ref} />
    </Wrapper>
  )
}
