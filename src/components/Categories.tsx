import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

const Wrap = styled.div`
  display:flex;flex-wrap:wrap;gap:8px;margin:16px 0 24px;
`
const Pill = styled.button<{active?:boolean}>`
  border:none;padding:8px 12px;border-radius:999px;background:${p=>p.active? '#2563eb':'#f1f5f9'};color:${p=>p.active? '#fff':'#0f172a'};cursor:pointer;font-size:13px;
  &:hover{opacity:0.9}
`

export default function Categories({tags}:{tags:string[]}){
  const pathname = usePathname()
  const params = useSearchParams()
  const active = params?.get('tag') || 'All'
  return (
    <Wrap>
      <Link href={{pathname, query: {tag: 'All'}}} legacyBehavior passHref>
        <Pill as="a" active={active==='All'}>All</Pill>
      </Link>
      {tags.map(t=> (
        <Link key={t} href={{pathname, query: {tag: t}}} legacyBehavior passHref>
          <Pill as="a" active={active===t}>{t}</Pill>
        </Link>
      ))}
    </Wrap>
  )
}
