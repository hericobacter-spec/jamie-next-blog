import Link from 'next/link'
import styled from 'styled-components'

const Wrap = styled.header`
  background: white;
  border-bottom: 1px solid #e6edf3;
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
  font-weight:700;font-size:20px;
  @media (max-width:640px){font-size:18px}
`
export default function Header(){
  const toggle = ()=>{
    try{
      const cur = localStorage.getItem('theme') === 'dark' ? 'dark' : 'light'
      const next = cur === 'dark' ? 'light' : 'dark'
      localStorage.setItem('theme', next)
      // notify ThemeProviderClient
      window.dispatchEvent(new CustomEvent('theme-change', { detail: { mode: next }}))
      document.documentElement.setAttribute('data-theme', next)
    }catch(e){/* ignore */}
  }
  return (
    <Wrap>
      <Inner>
        <Logo><Link href="/">Jamie Next</Link></Logo>
        <Nav>
          <Link href="/posts">Posts</Link>
          <Link href="/about">About</Link>
          <button id="theme-toggle" aria-label="Toggle theme" onClick={toggle} style={{marginLeft:12, padding:'6px 8px', borderRadius:6, border:'1px solid #e6edf3', background:'transparent', cursor:'pointer'}}>🌓</button>
        </Nav>
      </Inner>
    </Wrap>
  )
}
