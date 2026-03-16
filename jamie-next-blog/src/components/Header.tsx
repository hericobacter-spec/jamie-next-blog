"use client"
import Link from 'next/link'
import styled from 'styled-components'
import React, { useEffect, useState } from 'react'

const Wrap = styled.header`
  background: ${p=>p.theme.colors.bg};
  border-bottom: 1px solid ${p=>p.theme.colors.surface};
`
const Inner = styled.div`
  max-width:960px;margin:0 auto;padding:16px 20px;display:flex;align-items:center;justify-content:space-between;
  @media (max-width:640px){padding:12px 16px}
`
const Nav = styled.nav`
  display:flex;gap:18px;align-items:center;
  @media (max-width:640px){gap:12px}
`
const Logo = styled.div`
  font-weight:700;font-size:20px;color:${p=>p.theme.colors.primary};
  @media (max-width:640px){font-size:18px}
`
const Toggle = styled.button`
  background:transparent;border:1px solid ${p=>p.theme.colors.surface};padding:6px 8px;border-radius:8px;color:${p=>p.theme.colors.primary};cursor:pointer;font-size:14px
`
export default function Header(){
  const [mode,setMode] = useState<'light'|'dark'>('light')
  useEffect(()=>{
    const saved = (typeof window !== 'undefined') && localStorage.getItem('theme')
    if(saved === 'dark') setMode('dark')
  },[])
  const toggle = () => {
    const next = mode === 'light' ? 'dark' : 'light'
    setMode(next)
    if(typeof window !== 'undefined') localStorage.setItem('theme', next)
    document.documentElement.setAttribute('data-theme', next)
  }
  return (
    <Wrap>
      <Inner>
        <Logo><Link href="/">Jamie Next</Link></Logo>
        <Nav>
          <Link href="/posts">Posts</Link>
          <Link href="/about">About</Link>
          <Toggle onClick={toggle}>{mode==='light' ? 'Dark' : 'Light'}</Toggle>
        </Nav>
      </Inner>
    </Wrap>
  )
}
