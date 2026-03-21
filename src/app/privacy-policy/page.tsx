import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Jamie Next Blog 개인정보처리방침. 방문자 정보, 쿠키, 분석 도구, 광고 서비스 사용 가능성에 대한 안내입니다.',
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
    <main style={{ maxWidth: 900, margin: '0 auto', padding: 24, lineHeight: 1.8 }}>
      <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 20 }}>Privacy Policy</h1>

      <p>
        Jamie Next Blog는 AI, 기술, 맛집, 여행 등 다양한 주제의 콘텐츠를 제공하는 개인 블로그입니다.
        본 페이지는 방문자 정보 처리와 쿠키 사용, 향후 광고 서비스 연동 가능성에 대해 안내하기 위해 작성되었습니다.
      </p>

      <h2 style={{ marginTop: 36, fontSize: 28 }}>1. 수집할 수 있는 정보</h2>
      <p>이 블로그는 일반적인 웹사이트 운영 과정에서 다음과 같은 정보가 자동으로 수집될 수 있습니다.</p>
      <ul>
        <li>접속 시간 및 방문 기록</li>
        <li>브라우저 종류 및 운영체제 정보</li>
        <li>접속한 페이지, 유입 경로, 클릭 기록</li>
        <li>IP 주소 등 기본적인 접속 로그</li>
      </ul>

      <h2 style={{ marginTop: 36, fontSize: 28 }}>2. 정보 이용 목적</h2>
      <p>수집된 정보는 다음 목적을 위해 사용될 수 있습니다.</p>
      <ul>
        <li>사이트 운영 및 오류 확인</li>
        <li>콘텐츠 품질 개선</li>
        <li>방문 통계 확인 및 사용자 경험 개선</li>
        <li>광고 서비스 또는 분석 도구 연동 시 성과 측정</li>
      </ul>

      <h2 style={{ marginTop: 36, fontSize: 28 }}>3. 쿠키(Cookies) 사용</h2>
      <p>
        이 블로그는 서비스 품질 향상 및 방문 통계 확인을 위해 쿠키를 사용할 수 있습니다.
        또한 향후 Google AdSense 등 제3자 광고 서비스를 사용할 경우, 해당 서비스가 맞춤형 광고 제공 및 성과 측정을 위해 쿠키를 사용할 수 있습니다.
      </p>
      <p>
        방문자는 브라우저 설정을 통해 쿠키 저장을 거부하거나 삭제할 수 있습니다.
        다만 일부 기능은 제한될 수 있습니다.
      </p>

      <h2 style={{ marginTop: 36, fontSize: 28 }}>4. 제3자 서비스</h2>
      <p>이 블로그는 운영 과정에서 다음과 같은 외부 서비스를 사용할 수 있습니다.</p>
      <ul>
        <li>Vercel (호스팅 및 배포)</li>
        <li>Google Search Console (검색 성능 확인)</li>
        <li>Google AdSense (광고 서비스, 향후 적용 가능)</li>
        <li>기타 웹 분석 또는 검색 최적화 도구</li>
      </ul>
      <p>
        각 외부 서비스는 자체 개인정보처리방침을 따르며, 해당 서비스 이용 과정에서 별도의 데이터 처리가 발생할 수 있습니다.
      </p>

      <h2 style={{ marginTop: 36, fontSize: 28 }}>5. 개인정보 보호</h2>
      <p>
        운영자는 방문자의 개인정보 보호를 중요하게 생각하며, 직접적으로 수집한 개인정보를 판매하거나 임의로 제3자에게 제공하지 않습니다.
        단, 법령에 따른 요청이 있는 경우에는 관련 법규에 따라 제공될 수 있습니다.
      </p>

      <h2 style={{ marginTop: 36, fontSize: 28 }}>6. 정책 변경</h2>
      <p>
        본 개인정보처리방침은 사이트 운영 방식, 법령 변경, 광고/분석 도구 도입 등에 따라 수정될 수 있습니다.
        변경 시 본 페이지를 통해 업데이트됩니다.
      </p>

      <h2 style={{ marginTop: 36, fontSize: 28 }}>7. 문의</h2>
      <p>
        블로그 운영 또는 본 정책 관련 문의는 현재 블로그 소개 페이지를 통해 확인할 수 있으며,
        별도의 연락 수단이 추가될 경우 본 페이지에도 반영될 예정입니다.
      </p>

      <p style={{ marginTop: 40, color: '#6b7280' }}>최종 업데이트: 2026-03-21</p>
    </main>
  )
}
