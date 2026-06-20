import { Providers } from './providers'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import GlobalStyle from '@/styles/global'
import React from 'react'
import { Plus_Jakarta_Sans } from 'next/font/google'
import type { Metadata } from 'next'
import Script from 'next/script'

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-cosmica', weight: ['300','400','500','600','700','800'] })

const siteUrl = 'https://jamie-next-blog.vercel.app'
const siteName = 'Jamie Next Blog'
const siteDescription = 'OpenClaw와 Next.js로 운영하는 개인 블로그. AI, 맛집, 여행, 블로그 제작 기록을 다룹니다.'

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
        url: '/images/hero-main.jpg',
        width: 1200,
        height: 630,
        alt: 'Jamie Next Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description: siteDescription,
    images: ['/images/hero-main.jpg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }){
  return (
    <html lang="ko" className={`${jakarta.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.setAttribute('data-theme','dark');}}catch(e){}})();`,
          }}
        />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4030752098152003"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body>
        <Providers>
          <GlobalStyle />
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
