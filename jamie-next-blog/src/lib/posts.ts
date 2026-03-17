import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDir = path.join(process.cwd(),'posts')

export function getPostSlugs(){
  if(!fs.existsSync(postsDir)) return []
  return fs.readdirSync(postsDir).filter(f => f.endsWith('.mdx') || f.endsWith('.md'))
}

export function getAllPosts(){
  const slugs = getPostSlugs()
  return slugs.map(s => {
    const full = path.join(postsDir,s)
    const raw = fs.readFileSync(full,'utf8')
    const { data } = matter(raw)
    return { slug: s.replace(/\.mdx?$/,''), meta: data }
  }).sort((a:any,b:any)=> new Date(b.meta.date).valueOf() - new Date(a.meta.date).valueOf())
}

import readingTime from 'reading-time'

export function getPostBySlug(slug:string){
  // Resolve by scanning postsDir filenames to tolerate .mdx or .md and case
  const slugs = getPostSlugs()
  const match = slugs.find(f => f.replace(/\.mdx?$/,'') === slug)
  if(!match) return null
  const full = path.join(postsDir, match)
  const raw = fs.readFileSync(full,'utf8')
  const { data, content } = matter(raw)
  const rt = readingTime(content)
  return { slug, meta: data, content, readingTime: rt.text }
}
