import Link from 'next/link'
import styled from 'styled-components'

const Wrap = styled.footer`
  margin-top: 80px;
  border-top: 1px solid var(--border);
  background: var(--card-bg);
`

const Inner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 24px;
  text-align: center;
`

const Links = styled.div`
  display: flex;
  gap: 4px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 20px;
`

const FooterLink = styled(Link)`
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 400;
  color: var(--color-ink, #1d1d1f);

  &:hover {
    opacity: 0.65;
    color: var(--color-ink, #1d1d1f);
  }
`

const Copy = styled.div`
  color: var(--muted, #707070);
  font-size: 12px;
`

export default function Footer() {
  return (
    <Wrap>
      <Inner>
        <Links>
          <FooterLink href="/">Home</FooterLink>
          <FooterLink href="/posts">Posts</FooterLink>
          <FooterLink href="/about">About</FooterLink>
          <FooterLink href="/contact">Contact</FooterLink>
          <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
          <FooterLink href="/rss.xml" target="_blank" rel="noopener noreferrer">
            RSS
          </FooterLink>
        </Links>
        <Copy>© {new Date().getFullYear()} Jamie — Built with Next.js</Copy>
      </Inner>
    </Wrap>
  )
}
