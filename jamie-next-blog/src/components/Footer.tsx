import styled from 'styled-components'

const Wrap = styled.footer`
  background: var(--bg, #fff);
  border-top: 1px solid #e5e7eb;
  padding: 24px 0;
  text-align: center;
  color: #6b7280;
`

export default function Footer(){
  return (
    <Wrap>
      <div style={{maxWidth:1024,margin:'0 auto'}}>© {new Date().getFullYear()} Jamie</div>
    </Wrap>
  )
}
