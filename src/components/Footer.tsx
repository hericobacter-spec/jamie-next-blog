import Link from 'next/link'
import styled from 'styled-components'

const Wrap = styled.footer`
  background: white;border-top:1px solid #e6edf3;padding:32px 0;margin-top:48px;
`
const Inner = styled.div`
  max-width:960px;margin:0 auto;padding:0 24px;text-align:center;color:#6b7280;font-size:14px;
`
const Links = styled.div`
  display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin-bottom:10px;
`
export default function Footer(){
  return (
    <Wrap>
      <Inner>
        <Links>
          <Link href="/">Home</Link>
          <Link href="/posts">Posts</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy-policy">Privacy Policy</Link>
        </Links>
        <div>© {new Date().getFullYear()} Jamie — Built with Next.js</div>
      </Inner>
    </Wrap>
  )
}
