import Link from 'next/link'
import styled from 'styled-components'
import ThemeToggle from './ThemeToggle'

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
  return (
    <Wrap>
      <Inner>
        <Logo><Link href="/">Jamie Next</Link></Logo>
        <Nav>
          <Link href="/posts">Posts</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy-policy">Privacy</Link>
          <Link href="/rss.xml" target="_blank" rel="noopener noreferrer" aria-label="RSS Feed">RSS</Link>
          <ThemeToggle />
        </Nav>
      </Inner>
    </Wrap>
  )
}
