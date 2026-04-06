import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDir = path.join(process.cwd(),'posts')

export function getPostSlugs(){
  return fs.readdirSync(postsDir).filter(f => f.endsWith('.mdx') || f.endsWith('.md'))
}

export function getAllPosts(){
  const slugs = getPostSlugs()
  return slugs.map(s => {
    const full = path.join(postsDir,s)
    const raw = fs.readFileSync(full,'utf8')
    const { data } = matter(raw)
    return { slug: s.replace(/\.mdx?$/,''), ...data }
  }).filter((p:any) => p.published !== false)
  .sort((a:any,b:any)=> new Date(b.date).valueOf() - new Date(a.date).valueOf())
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
