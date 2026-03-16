import Link from 'next/link'
import styled from 'styled-components'

const Wrap = styled.header`
  background: var(--bg, #fff);
  border-bottom: 1px solid #e5e7eb;
`

export default function Header(){
  return (
    <Wrap>
      <div style={{maxWidth:1024,margin:'0 auto',padding:'16px'}}>
        <Link href="/">Jamie Next Blog</Link>
      </div>
    </Wrap>
  )
}
