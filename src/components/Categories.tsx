"use client"
import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

const Wrap = styled.div`
  display:flex;flex-wrap:wrap;gap:8px;margin:16px 0 24px;
`
// Use transient props ($color, $active) to avoid React DOM warnings
const PillLink = styled(Link)<{ $active?: boolean; $color?: string }>`
  display:inline-block;
  padding:8px 12px;border-radius:999px;cursor:pointer;font-size:13px;text-decoration:none;
  background: ${p => (p.$active ? p.$color || '#2563eb' : '#f1f5f9')};
  color: ${p => (p.$active ? '#fff' : '#0f172a')};
  &:hover{opacity:0.9}
`

const CATEGORIES: {key:string,label:string,color:string}[] = [
  {key:'All', label:'All', color: '#94a3b8'},
  {key:'Blog', label:'Blog', color: '#2563eb'},
  {key:'Foodie', label:'Foodie', color: '#fb923c'},
  {key:'A.I', label:'A.I', color: '#7c3aed'},
  {key:'Life', label:'Life', color: '#10b981'},
]

export default function Categories(){
  const pathname = usePathname()
  const params = useSearchParams()
  const active = params?.get('category') || 'All'
  return (
    <Wrap>
      {CATEGORIES.map(c=> {
        const href = c.key === 'All' ? pathname : { pathname, query: { category: c.key } }
        return (
          <PillLink key={c.key} href={href} $color={c.color} $active={active===c.key}>
            {c.label}
          </PillLink>
        )
      })}
    </Wrap>
  )
}
