import styled from 'styled-components'

const Wrap = styled.footer`
  background: white;border-top:1px solid #e6edf3;padding:32px 0;margin-top:48px;
`
const Inner = styled.div`
  max-width:960px;margin:0 auto;padding:0 24px;text-align:center;color:#6b7280;font-size:14px;
`
export default function Footer(){
  return (
    <Wrap>
      <Inner>© {new Date().getFullYear()} Jamie — Built with Next.js</Inner>
    </Wrap>
  )
}
