import { Providers } from './providers'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import GlobalStyle from '@/styles/global'
import React from 'react'
import { Inter, Merriweather } from 'next/font/google'
import type { Metadata } from 'next'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', weight: ['300','400','600','700'] })
const merri = Merriweather({ subsets: ['latin'], variable: '--font-merri', weight: ['400','700'] })

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
    <html lang="ko" className={`${inter.variable} ${merri.variable}`}>
      <head>
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
