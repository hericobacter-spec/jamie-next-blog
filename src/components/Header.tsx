import Link from 'next/link'
import styled from 'styled-components'

const Wrap = styled.header`
  background: white;
  border-bottom: 1px solid #e6edf3;
`
const Inner = styled.div`
  max-width:960px;margin:0 auto;padding:20px 24px;display:flex;align-items:center;justify-content:space-between;
`
const Nav = styled.nav`
  display:flex;gap:18px;align-items:center;
`
const Logo = styled.div`
  font-weight:700;font-size:20px;
`
export default function Header(){
  return (
    <Wrap>
      <Inner>
        <Logo><Link href="/">Jamie Next</Link></Logo>
        <Nav>
          <Link href="/posts">Posts</Link>
          <Link href="/about">About</Link>
        </Nav>
      </Inner>
    </Wrap>
  )
}
