import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDir = path.join(process.cwd(),'posts')

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

export function getAllPosts(){
  const slugs = getPostSlugs()
  return slugs.map(s => {
    const full = path.join(postsDir,s)
    const raw = fs.readFileSync(full,'utf8')
    const { data } = matter(raw)
    const slug = s.replace(/\.mdx?$/,'')
    return { slug, ...data, date: data.date ?? dateFromSlug(slug) }
  }).filter((p:any) => p.published !== false)
  .sort((a:any,b:any)=> sortableDate(b) - sortableDate(a))
}

import readingTime from 'reading-time'

export function getPostBySlug(slug:string){
  const full = path.join(postsDir, `${slug}.mdx`)
  if(!fs.existsSync(full)) return null
  const raw = fs.readFileSync(full,'utf8')
  const { data, content } = matter(raw)
  const rt = readingTime(content)
  return { slug, meta: data, content, readingTime: rt.text }
}
