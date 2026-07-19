import Link from 'next/link'
import styled from 'styled-components'

const Wrap = styled.footer`
  margin-top: 112px;
  color: #f4f1e9;
  background: #183b2d;
`

const Inner = styled.div`
  width: min(100% - 40px, 1280px);
  margin: 0 auto;
  padding: 72px 0 38px;

  @media (max-width: 640px) {
    width: min(100% - 28px, 1280px);
    padding-top: 52px;
  }
`

const Top = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(280px, 0.7fr);
  gap: 56px;
  padding-bottom: 56px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
    gap: 36px;
  }
`

const Title = styled.p`
  max-width: 680px;
  margin: 0;
  font-family: var(--font-serif), serif;
  font-size: clamp(2rem, 5vw, 4.4rem);
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.055em;
`

const Note = styled.div`
  align-self: end;
  color: rgba(255, 255, 255, 0.72);
  font-size: 15px;
`

const Email = styled.a`
  display: inline-flex;
  margin-top: 14px;
  padding-bottom: 3px;
  color: #fff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.55);
  font-weight: 600;

  &:hover {
    color: #d6e4d8;
  }
`

const Bottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding-top: 28px;
  color: rgba(255, 255, 255, 0.62);
  font-size: 13px;

  @media (max-width: 640px) {
    align-items: flex-start;
    flex-direction: column-reverse;
  }
`

const Links = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 18px;

  a {
    color: rgba(255, 255, 255, 0.78);
  }

  a:hover {
    color: #fff;
  }
`

export default function Footer() {
  return (
    <Wrap>
      <Inner>
        <Top>
          <Title>직접 겪은 이야기는 오래 남습니다.</Title>
          <Note>
            AI 실험부터 가족 여행, 동네의 맛까지. Jamie가 경험하고 확인한 것을 기록합니다.
            <br />
            <Email href="mailto:hericobacter1@gmail.com">이야기 나누기 ↗</Email>
          </Note>
        </Top>
        <Bottom>
          <span>© {new Date().getFullYear()} Jamie Next</span>
          <Links aria-label="하단 메뉴">
            <Link href="/posts">글</Link>
            <Link href="/about">소개</Link>
            <Link href="/contact">연락</Link>
            <Link href="/privacy-policy">개인정보처리방침</Link>
            <Link href="/rss.xml" target="_blank">RSS</Link>
          </Links>
        </Bottom>
      </Inner>
    </Wrap>
  )
}
