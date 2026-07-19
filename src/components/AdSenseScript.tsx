'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'

export default function AdSenseScript({ excludedSlugs }: { excludedSlugs: string[] }) {
  const pathname = usePathname()
  const slug = pathname.startsWith('/posts/') ? decodeURIComponent(pathname.slice('/posts/'.length)) : null

  if (slug && excludedSlugs.includes(slug)) return null

  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4030752098152003"
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  )
}
