import { getAllPosts } from '@/lib/posts'

const siteUrl = 'https://jamie-next-blog.vercel.app'
const siteTitle = 'Jamie Next Blog'
const siteDescription = 'OpenClaw와 Next.js로 운영하는 개인 블로그. AI, 맛집, 여행, 블로그 제작 기록을 다룹니다.'

function escapeXml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const posts = getAllPosts()

  const items = posts
    .map((post: any) => {
      const title = escapeXml(String(post.title ?? ''))
      const description = escapeXml(String(post.description ?? ''))
      const link = `${siteUrl}/posts/${post.slug}`
      const pubDate = post?.date
        ? new Date(post.date).toUTCString()
        : new Date().toUTCString()

      return `
        <item>
          <title>${title}</title>
          <link>${link}</link>
          <guid>${link}</guid>
          <description>${description}</description>
          <pubDate>${pubDate}</pubDate>
        </item>`
    })
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(siteTitle)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(siteDescription)}</description>
    <language>ko-KR</language>
    ${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
