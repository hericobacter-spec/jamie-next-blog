import Link from 'next/link'
import styled from 'styled-components'
import ThemeToggle from './ThemeToggle'

const Wrap = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  background: color-mix(in srgb, var(--background) 86%, transparent);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border-bottom: 1px solid var(--border);
`

const Inner = styled.div`
  width: min(100% - 40px, 1280px);
  min-height: 64px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;

  @media (max-width: 640px) {
    width: min(100% - 28px, 1280px);
    min-height: 58px;
  }
`

const Logo = styled(Link)`
  color: var(--color-ink);
  font-family: var(--font-serif), serif;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.04em;
  white-space: nowrap;

  &:hover {
    color: var(--forest);
  }
`

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 4px;
`

const NavLink = styled(Link)<{ $secondary?: boolean }>`
  padding: 8px 11px;
  border-radius: var(--radius-button);
  color: var(--color-ink);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.02em;

  &:hover {
    color: var(--forest);
    background: var(--card-muted);
  }

  @media (max-width: 680px) {
    display: ${(props) => (props.$secondary ? 'none' : 'inline-flex')};
    padding-inline: 9px;
    font-size: 13px;
  }
`

export default function Header() {
  return (
    <Wrap>
      <Inner>
        <Logo href="/">Jamie Next</Logo>
        <Nav aria-label="주요 메뉴">
          <NavLink href="/posts">글</NavLink>
          <NavLink href="/about">소개</NavLink>
          <NavLink href="/contact" $secondary>연락</NavLink>
          <NavLink href="/privacy-policy" $secondary>개인정보</NavLink>
          <ThemeToggle />
        </Nav>
      </Inner>
    </Wrap>
  )
}
