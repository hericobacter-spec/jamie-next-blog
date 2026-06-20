import Link from 'next/link'
import styled from 'styled-components'
import ThemeToggle from './ThemeToggle'

const Wrap = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(245, 245, 247, 0.72);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  border-bottom: 1px solid var(--border);
`

const Inner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Nav = styled.nav`
  display: flex;
  gap: 4px;
  align-items: center;
`

const NavLink = styled(Link)`
  padding: 8px 12px;
  border-radius: var(--radius-button, 999px);
  font-size: 12px;
  font-weight: 400;
  color: var(--color-ink, #1d1d1f);
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.65;
    color: var(--color-ink, #1d1d1f);
  }
`

const Logo = styled(Link)`
  font-weight: 600;
  font-size: 18px;
  letter-spacing: -0.015em;
  color: var(--color-ink, #1d1d1f);

  &:hover {
    color: var(--color-ink, #1d1d1f);
  }
`

export default function Header() {
  return (
    <Wrap>
      <Inner>
        <Logo href="/">Jamie Next</Logo>
        <Nav>
          <NavLink href="/posts">Posts</NavLink>
          <NavLink href="/about">About</NavLink>
          <NavLink href="/contact">Contact</NavLink>
          <NavLink href="/privacy-policy">Privacy</NavLink>
          <NavLink href="/rss.xml" target="_blank" rel="noopener noreferrer" aria-label="RSS Feed">
            RSS
          </NavLink>
          <ThemeToggle />
        </Nav>
      </Inner>
    </Wrap>
  )
}
