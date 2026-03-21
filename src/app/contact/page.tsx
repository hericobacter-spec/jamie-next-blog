import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Jamie Next Blog 연락처 안내 페이지입니다. 블로그 운영, 협업, 문의를 위한 이메일 정보를 제공합니다.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact | Jamie Next Blog',
    description: 'Jamie Next Blog 연락처 안내 페이지입니다.',
    url: 'https://jamie-next-blog.vercel.app/contact',
    type: 'website',
  },
}

export default function ContactPage() {
  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: 24, lineHeight: 1.8 }}>
      <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 20 }}>Contact</h1>

      <p>
        Jamie Next Blog는 AI, 블로그 개발, 맛집, 여행 기록을 다루는 개인 블로그입니다.
        블로그 관련 문의, 협업 제안, 기타 연락이 필요하시면 아래 이메일로 연락해 주세요.
      </p>

      <div style={{ marginTop: 28, padding: 20, border: '1px solid #e5e7eb', borderRadius: 12, background: '#fafafa' }}>
        <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 8 }}>이메일</div>
        <a href="mailto:hericobacter1@gmail.com" style={{ fontSize: 20, fontWeight: 600 }}>
          hericobacter1@gmail.com
        </a>
      </div>

      <h2 style={{ marginTop: 36, fontSize: 28 }}>문의 가능한 내용</h2>
      <ul>
        <li>블로그 운영 및 콘텐츠 관련 문의</li>
        <li>OpenClaw, Next.js, AI 자동화 관련 이야기</li>
        <li>협업 및 제안</li>
      </ul>

      <p style={{ marginTop: 32, color: '#6b7280' }}>
        스팸성 메일이나 광고성 제안에는 답변하지 않을 수 있습니다.
      </p>
    </main>
  )
}
