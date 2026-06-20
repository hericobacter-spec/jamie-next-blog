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
    <main style={{ maxWidth: 800, margin: '80px auto 120px', padding: '0 24px', lineHeight: 1.47, color: 'var(--color-ink, #1d1d1f)' }}>
      <h1 style={{ fontSize: 40, fontWeight: 600, marginBottom: 24, letterSpacing: '-0.022em', color: 'var(--color-ink, #1d1d1f)' }}>Contact</h1>

      <p>
        Jamie Next Blog는 AI, 블로그 개발, 맛집, 여행 기록을 다루는 개인 블로그입니다.
        블로그 관련 문의, 협업 제안, 기타 연락이 필요하시면 아래 이메일로 연락해 주세요.
      </p>

      <div style={{ marginTop: 32, padding: 28, borderRadius: 'var(--radius-card, 28px)', background: 'var(--card-bg, #ffffff)' }}>
        <div style={{ fontSize: 14, color: 'var(--muted, #707070)', marginBottom: 8 }}>이메일</div>
        <a href="mailto:hericobacter1@gmail.com" style={{ fontSize: 20, fontWeight: 400, color: 'var(--color-cobalt-link, #0066cc)' }}>
          hericobacter1@gmail.com
        </a>
      </div>

      <h2 style={{ marginTop: 48, fontSize: 28, fontWeight: 600, letterSpacing: '-0.01em' }}>문의 가능한 내용</h2>
      <ul>
        <li>블로그 운영 및 콘텐츠 관련 문의</li>
        <li>OpenClaw, Next.js, AI 자동화 관련 이야기</li>
        <li>협업 및 제안</li>
      </ul>

      <p style={{ marginTop: 32, color: 'var(--muted, #707070)' }}>
        스팸성 메일이나 광고성 제안에는 답변하지 않을 수 있습니다.
      </p>
    </main>
  )
}
