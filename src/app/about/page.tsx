export const metadata = {
  title: "About | Jamie Blog",
  description:
    "OpenClaw와 Next.js로 직접 만든 개인 블로그. AI 개발, 여행, 음식, 기술 실험 기록을 공유합니다.",
  openGraph: {
    title: "About | Jamie Blog",
    description:
      "OpenClaw와 Next.js로 직접 만든 개인 블로그. AI 개발과 블로그 제작 과정을 기록합니다.",
    type: "website",
  },
}

export default function AboutPage() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24, lineHeight: 1.7 }}>
      <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 20 }}>
        About This Blog
      </h1>

      <p>
        이 블로그는 <strong>Next.js</strong>와 <strong>OpenClaw AI</strong>를 활용해 직접 구축한 개인 기술 블로그입니다.
      </p>

      <p>
        일반 블로그 플랫폼을 사용하는 대신, Git 기반으로 콘텐츠를 관리하고
        자동 배포 시스템을 통해 운영되는 개발 중심 블로그입니다.
      </p>

      <h2 style={{ marginTop: 40, fontSize: 28 }}>Author</h2>

      <p>
        이 블로그는 AI 개발 도구와 최신 웹 기술을 활용해 개인이 직접 플랫폼을 구축할 수 있는지를
        실험하기 위해 시작되었습니다.
      </p>

      <p>
        블로그 운영 과정에서 다음과 같은 분야를 기록하고 있습니다.
      </p>

      <ul>
        <li>AI 개발 도구 활용 경험</li>
        <li>Next.js 블로그 개발 과정</li>
        <li>Git 기반 콘텐츠 관리</li>
        <li>여행 기록</li>
        <li>맛집 탐방</li>
      </ul>

      <h2 style={{ marginTop: 40, fontSize: 28 }}>Technology Stack</h2>

      <p>이 블로그는 다음 기술을 기반으로 구축되었습니다.</p>

      <ul>
        <li>Next.js (App Router)</li>
        <li>MDX 콘텐츠 시스템</li>
        <li>GitHub 저장소 관리</li>
        <li>Vercel 자동 배포</li>
        <li>OpenClaw AI 개발 도구</li>
      </ul>

      <h2 style={{ marginTop: 40, fontSize: 28 }}>Blog Categories</h2>

      <ul>
        <li>
          <strong>A.I</strong> – OpenClaw와 AI 개발 도구 활용 경험
        </li>
        <li>
          <strong>Foodie</strong> – 맛집 탐방과 음식 이야기
        </li>
        <li>
          <strong>Life</strong> – 여행과 일상 기록
        </li>
        <li>
          <strong>Blog</strong> – 블로그 제작 과정과 운영 노하우
        </li>
      </ul>

      <h2 style={{ marginTop: 40, fontSize: 28 }}>Why This Blog Exists</h2>

      <p>
        대부분의 블로그 플랫폼은 사용하기 편리하지만,
        사이트 구조나 기능을 완전히 제어하기는 어렵습니다.
      </p>

      <p>
        그래서 직접 블로그를 만들기로 했습니다.
      </p>

      <p>
        이 프로젝트는 다음을 실험하기 위한 개인 프로젝트입니다.
      </p>

      <ul>
        <li>AI 기반 개발 방식</li>
        <li>Git 기반 콘텐츠 운영</li>
        <li>자동 배포 블로그 시스템</li>
        <li>Next.js 기반 개인 미디어 구축</li>
      </ul>

      <h2 style={{ marginTop: 40, fontSize: 28 }}>Future Plans</h2>

      <p>이 블로그는 앞으로 다음 방향으로 발전할 예정입니다.</p>

      <ul>
        <li>AI 콘텐츠 자동 생성</li>
        <li>블로그 검색 기능</li>
        <li>RSS 구독 시스템</li>
        <li>AI 기반 블로그 자동화</li>
      </ul>

      <h2 style={{ marginTop: 40, fontSize: 28 }}>Contact</h2>

      <p>
        블로그 관련 문의나 협업 제안은 언제든지 환영합니다.
      </p>

      <p>
        연락은 <a href="mailto:hericobacter1@gmail.com">hericobacter1@gmail.com</a> 으로 가능합니다.
      </p>

      <p>
        이 블로그는 계속 발전 중이며 새로운 기능과 콘텐츠가
        지속적으로 추가될 예정입니다.
      </p>
    </main>
  )
}
