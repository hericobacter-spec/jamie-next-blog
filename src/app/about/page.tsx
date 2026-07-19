import Link from 'next/link'
import styled from 'styled-components'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '소개와 작성 원칙',
  description: 'Jamie Next Blog를 운영하는 이유와 직접 경험, 출처 확인, AI 활용에 관한 콘텐츠 작성 원칙을 소개합니다.',
  alternates: { canonical: '/about' },
}

const Shell = styled.main`
  width: min(100% - 40px, 1060px);
  margin: 0 auto;
  padding: clamp(64px, 10vw, 126px) 0 80px;

  @media (max-width: 640px) {
    width: min(100% - 28px, 1060px);
  }
`

const Hero = styled.header`
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(280px, 0.65fr);
  gap: 60px;
  align-items: end;
  padding-bottom: 58px;
  border-bottom: 1px solid var(--border);

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    gap: 22px;
  }
`

const Title = styled.h1`
  margin: 0;
  font-family: var(--font-serif), serif;
  font-size: clamp(3rem, 7vw, 6.2rem);
  font-weight: 600;
  line-height: 1.12;
  letter-spacing: -0.07em;
`

const Lead = styled.p`
  margin: 0;
  color: var(--muted);
  font-size: 17px;
  line-height: 1.85;
`

const Body = styled.div`
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: 72px;
  padding-top: 64px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    gap: 34px;
  }
`

const Aside = styled.aside`
  color: var(--muted);
  font-size: 14px;
  line-height: 1.75;

  strong {
    display: block;
    margin-bottom: 8px;
    color: var(--color-ink);
    font-family: var(--font-serif), serif;
    font-size: 24px;
  }
`

const Article = styled.article`
  color: var(--color-ink);
  font-size: 17px;
  line-height: 1.85;

  h2 {
    margin: 58px 0 16px;
    font-family: var(--font-serif), serif;
    font-size: clamp(1.7rem, 4vw, 2.6rem);
    font-weight: 600;
    letter-spacing: -0.045em;
  }

  h2:first-child {
    margin-top: 0;
  }

  p {
    margin: 0 0 20px;
  }

  ul {
    margin: 20px 0;
    padding: 0;
    list-style: none;
  }

  li {
    padding: 14px 0;
    border-bottom: 1px solid var(--border);
  }
`

const Contact = styled(Link)`
  display: inline-flex;
  margin-top: 18px;
  padding: 11px 18px;
  color: var(--primary-foreground);
  background: var(--forest);
  border-radius: 999px;
  font-size: 14px;
  font-weight: 700;
`

export default function AboutPage() {
  return (
    <Shell>
      <Hero>
        <Title>경험을 먼저 두는 개인 기록.</Title>
        <Lead>Jamie Next는 AI 도구를 직접 써본 과정, 가족과 함께 지나온 장소, 다시 찾고 싶은 동네의 맛을 한 사람의 시선으로 기록하는 블로그입니다.</Lead>
      </Hero>
      <Body>
        <Aside>
          <strong>Jamie</strong>
          개발자가 아닌 사용자의 눈으로 새로운 도구를 시험하고, 가족과 여행하며, 먹고 느낀 것을 솔직하게 적습니다.
        </Aside>
        <Article>
          <h2>이 블로그를 운영하는 이유</h2>
          <p>짧은 검색 결과만으로는 실제 사용 과정의 맥락과 시행착오가 잘 남지 않습니다. 그래서 성공한 결과뿐 아니라 막혔던 지점, 다시 시도한 방법, 방문 당시의 분위기까지 가능한 한 구체적으로 기록합니다.</p>
          <p>콘텐츠는 Next.js와 MDX로 직접 관리하며 GitHub와 Vercel을 통해 배포합니다. 플랫폼의 형식에 맞추기보다 글과 사진에 어울리는 읽기 경험을 스스로 만들기 위해서입니다.</p>

          <h2>작성 원칙</h2>
          <ul>
            <li><strong>직접 경험을 구분합니다.</strong> 실제 사용·방문한 내용과 외부 자료를 통해 확인한 정보를 섞어 쓰지 않습니다.</li>
            <li><strong>출처를 밝힙니다.</strong> 기술 사양이나 발표 내용을 인용할 때 확인 가능한 원문 링크를 남깁니다.</li>
            <li><strong>장점과 한계를 함께 씁니다.</strong> 협찬 여부와 관계없이 불편했던 점이나 재현되지 않은 결과를 숨기지 않습니다.</li>
            <li><strong>AI는 보조 도구로 사용합니다.</strong> 자료 정리와 문장 교정에 도움을 받을 수 있지만, 게시 전 사실관계와 최종 표현은 운영자가 검토합니다.</li>
            <li><strong>오류를 고칩니다.</strong> 사실 오류나 잘못된 링크를 발견하면 수정하고, 중요한 변경은 글 안에 표시합니다.</li>
          </ul>

          <h2>주로 다루는 이야기</h2>
          <p>OpenClaw와 로컬 AI 같은 도구를 직접 설정한 기록, 가족 여행과 자전거 나들이, 세종·공주·군산 주변의 맛집 방문기, 그리고 이 블로그를 만들고 운영하며 배운 내용을 다룹니다.</p>

          <h2>연락</h2>
          <p>글의 오류 제보, 블로그 운영과 관련된 질문, 협업 제안은 연락 페이지를 통해 보내주세요. 광고성 제안이나 직접 사용하지 않은 제품의 홍보 요청에는 답하지 않을 수 있습니다.</p>
          <Contact href="/contact">연락하기 ↗</Contact>
        </Article>
      </Body>
    </Shell>
  )
}
