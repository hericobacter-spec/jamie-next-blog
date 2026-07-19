import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDir = path.join(process.cwd(),'posts')

const NEWS_SLUG_PATTERN = /(ai-news-(brief|weekly-brief)|usd-liquidity-report|weekly-market-briefing)/i

function dateFromSlug(slug: string){
  const match = slug.match(/^(\d{4}-\d{2}-\d{2})/)
  return match?.[1]
}

function sortableDate(post: any){
  const rawDate = post.date ?? dateFromSlug(post.slug)
  const value = rawDate ? new Date(rawDate).valueOf() : NaN
  return Number.isFinite(value) ? value : 0
}

export function getPostSlugs(){
  return fs.readdirSync(postsDir).filter(f => f.endsWith('.mdx') || f.endsWith('.md'))
}

export function getAllPosts({ includeUnpublished = false }: { includeUnpublished?: boolean } = {}): any[] {
  const slugs = getPostSlugs()
  return slugs.map(s => {
    const full = path.join(postsDir,s)
    const raw = fs.readFileSync(full,'utf8')
    const { data } = matter(raw)
    const slug = s.replace(/\.mdx?$/,'')
    return {
      slug,
      ...data,
      description: data.description ?? data.summary ?? '',
      date: data.date ?? dateFromSlug(slug),
    }
  }).filter((p:any) => includeUnpublished || p.published !== false)
  .sort((a:any,b:any)=> sortableDate(b) - sortableDate(a))
}

export function isNewsPost(post: any) {
  const category = String(post?.category ?? post?.meta?.category ?? '').trim().toLowerCase()
  const title = String(post?.title ?? post?.meta?.title ?? '')
  const slug = String(post?.slug ?? '')

  return category === 'news' || /^\[(news|report)\]/i.test(title) || NEWS_SLUG_PATTERN.test(slug)
}

export function isIndexablePost(post: any) {
  return post?.noindex !== true && post?.meta?.noindex !== true && !isNewsPost(post)
}

export function getPublicPosts(): any[] {
  return getAllPosts().filter(isIndexablePost)
}

export function getPostImage(post: any) {
  const image = post?.image ?? post?.thumbnail ?? post?.meta?.image ?? post?.meta?.thumbnail
  if (!image) return null
  return String(image).replace(/^\/public\//, '/')
}

export function getRelatedPosts(post: any, limit = 3) {
  const category = String(post?.meta?.category ?? post?.category ?? '')
  const tags = new Set<string>(post?.meta?.tags ?? post?.tags ?? [])

  return getPublicPosts()
    .filter((candidate: any) => candidate.slug !== post.slug)
    .map((candidate: any) => {
      const candidateTags = candidate.tags ?? []
      const sharedTags = candidateTags.filter((tag: string) => tags.has(tag)).length
      const sameCategory = candidate.category === category ? 2 : 0
      return { candidate, score: sharedTags + sameCategory }
    })
    .sort((a, b) => b.score - a.score || sortableDate(b.candidate) - sortableDate(a.candidate))
    .slice(0, limit)
    .map(({ candidate }) => candidate)
}

import readingTime from 'reading-time'

export function getPostBySlug(slug:string): any {
  const full = path.join(postsDir, `${slug}.mdx`)
  if(!fs.existsSync(full)) return null
  const raw = fs.readFileSync(full,'utf8')
  const { data, content } = matter(raw)
  const rt = readingTime(content)
  return {
    slug,
    meta: {
      ...data,
      description: data.description ?? data.summary ?? '',
      date: data.date ?? dateFromSlug(slug),
    },
    content,
    readingTime: rt.text,
  }
}
