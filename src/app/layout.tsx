import { Providers } from './providers'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import GlobalStyle from '@/styles/global'
import React from 'react'
import type { Metadata } from 'next'
import AdSenseScript from '@/components/AdSenseScript'
import { getAllPosts, isIndexablePost } from '@/lib/posts'

const siteUrl = 'https://jamie-next-blog.vercel.app'
const siteName = 'Jamie Next Blog'
const siteDescription = 'AI를 직접 써보고, 가족과 여행하고, 동네의 맛을 기록하는 Jamie의 개인 저널입니다.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/images/avatar.png', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', type: 'image/png' },
      { url: '/apple-touch-icon.svg', type: 'image/svg+xml' },
    ],
  },
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': `${siteUrl}/rss.xml`,
    },
  },
  keywords: ['Jamie Next Blog', 'OpenClaw', 'Next.js', 'AI', '맛집', '군산맛집', '블로그'],
  category: 'technology',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || 'google687ba423e81c5ef1',
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: siteUrl,
    siteName,
    title: siteName,
    description: siteDescription,
    images: [
      {
        url: '/og-journal.png',
        width: 1200,
        height: 630,
        alt: 'Jamie Next — 직접 경험한 AI, 여행, 맛의 기록',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description: siteDescription,
    images: ['/og-journal.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }){
  const excludedAdSlugs = getAllPosts({ includeUnpublished: true })
    .filter((post) => post.published === false || !isIndexablePost(post))
    .map((post) => post.slug)

  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.setAttribute('data-theme','dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <Providers>
          <GlobalStyle />
          <AdSenseScript excludedSlugs={excludedAdSlugs} />
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
