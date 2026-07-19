import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Jamie Next Blog 개인정보처리방침. 방문 기록, 쿠키, Google AdSense와 외부 서비스의 데이터 처리에 대해 안내합니다.',
  alternates: {
    canonical: '/privacy-policy',
  },
  openGraph: {
    title: 'Privacy Policy | Jamie Next Blog',
    description: 'Jamie Next Blog 개인정보처리방침 안내 페이지입니다.',
    url: 'https://jamie-next-blog.vercel.app/privacy-policy',
    type: 'website',
  },
}

export default function PrivacyPolicyPage() {
  return (
    <main style={{ maxWidth: 800, margin: '80px auto 120px', padding: '0 24px', lineHeight: 1.47, color: 'var(--color-ink, #1d1d1f)' }}>
      <h1 style={{ fontSize: 40, fontWeight: 600, marginBottom: 24, letterSpacing: '-0.022em', color: 'var(--color-ink, #1d1d1f)' }}>Privacy Policy</h1>

      <p>
        Jamie Next Blog는 AI, 기술, 맛집, 여행 등 다양한 주제의 콘텐츠를 제공하는 개인 블로그입니다.
        본 페이지는 방문자 정보 처리, 쿠키 사용, 광고 및 외부 서비스 연동에 대해 안내하기 위해 작성되었습니다.
      </p>

      <h2 style={{ marginTop: 48, fontSize: 28, fontWeight: 600, letterSpacing: '-0.01em' }}>1. 수집할 수 있는 정보</h2>
      <p>이 블로그는 일반적인 웹사이트 운영 과정에서 다음과 같은 정보가 자동으로 수집될 수 있습니다.</p>
      <ul>
        <li>접속 시간 및 방문 기록</li>
        <li>브라우저 종류 및 운영체제 정보</li>
        <li>접속한 페이지, 유입 경로, 클릭 기록</li>
        <li>IP 주소 등 기본적인 접속 로그</li>
      </ul>

      <h2 style={{ marginTop: 48, fontSize: 28, fontWeight: 600, letterSpacing: '-0.01em' }}>2. 정보 이용 목적</h2>
      <p>수집된 정보는 다음 목적을 위해 사용될 수 있습니다.</p>
      <ul>
        <li>사이트 운영 및 오류 확인</li>
        <li>콘텐츠 품질 개선</li>
        <li>방문 통계 확인 및 사용자 경험 개선</li>
        <li>광고 서비스 또는 분석 도구 연동 시 성과 측정</li>
      </ul>

      <h2 style={{ marginTop: 48, fontSize: 28, fontWeight: 600, letterSpacing: '-0.01em' }}>3. 쿠키(Cookies) 사용</h2>
      <p>
        이 블로그는 서비스 품질 향상 및 방문 통계 확인을 위해 쿠키를 사용할 수 있습니다.
        Google AdSense 등 제3자 광고 서비스는 광고 제공, 빈도 제한, 성과 측정 및 관련성 향상을 위해 쿠키 또는 유사 기술을 사용할 수 있습니다.
      </p>
      <p>
        방문자는 브라우저 설정을 통해 쿠키 저장을 거부하거나 삭제할 수 있습니다.
        다만 일부 기능은 제한될 수 있습니다.
      </p>

      <h2 style={{ marginTop: 48, fontSize: 28, fontWeight: 600, letterSpacing: '-0.01em' }}>4. 제3자 서비스</h2>
      <p>이 블로그는 운영 과정에서 다음과 같은 외부 서비스를 사용할 수 있습니다.</p>
      <ul>
        <li>Vercel (호스팅 및 배포)</li>
        <li>Google Search Console (검색 성능 확인)</li>
        <li>Google AdSense (광고 제공 및 성과 측정)</li>
        <li>기타 웹 분석 또는 검색 최적화 도구</li>
      </ul>
      <p>
        각 외부 서비스는 자체 개인정보처리방침을 따르며, 해당 서비스 이용 과정에서 별도의 데이터 처리가 발생할 수 있습니다.
      </p>

      <h2 style={{ marginTop: 48, fontSize: 28, fontWeight: 600, letterSpacing: '-0.01em' }}>5. 개인정보 보호</h2>
      <p>
        운영자는 방문자의 개인정보 보호를 중요하게 생각하며, 직접적으로 수집한 개인정보를 판매하거나 임의로 제3자에게 제공하지 않습니다.
        단, 법령에 따른 요청이 있는 경우에는 관련 법규에 따라 제공될 수 있습니다.
      </p>

      <h2 style={{ marginTop: 48, fontSize: 28, fontWeight: 600, letterSpacing: '-0.01em' }}>6. 정책 변경</h2>
      <p>
        본 개인정보처리방침은 사이트 운영 방식, 법령 변경, 광고/분석 도구 도입 등에 따라 수정될 수 있습니다.
        변경 시 본 페이지를 통해 업데이트됩니다.
      </p>

      <h2 style={{ marginTop: 48, fontSize: 28, fontWeight: 600, letterSpacing: '-0.01em' }}>7. 문의</h2>
      <p>
        블로그 운영 또는 본 정책 관련 문의는 hericobacter1@gmail.com으로 연락할 수 있습니다.
      </p>

      <p style={{ marginTop: 48, color: 'var(--muted, #707070)', fontSize: 14 }}>최종 업데이트: 2026-07-19</p>
    </main>
  )
}
