const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const postsDir = path.join(process.cwd(),'posts');
const outDir = path.join(process.cwd(),'public');

function getAllPosts(){
  const files = fs.readdirSync(postsDir).filter(f=> f.endsWith('.mdx')||f.endsWith('.md'))
  return files.map(f=>{
    const raw = fs.readFileSync(path.join(postsDir,f),'utf8')
    const { data, content } = matter(raw)
    return { slug: f.replace(/\.mdx?$/,''), meta: data, content }
  })
}

function generateSitemap(){
  const siteUrl = 'https://example.com'
  const posts = getAllPosts()
  const pages = [ '/', '/posts']
  const tags = new Set()
  posts.forEach(p=> (p.meta.tags||[]).forEach(t=> tags.add(t)))
  const urls = pages.concat(posts.map(p=> `/posts/${p.slug}`)).concat(Array.from(tags).map(t=> `/tags/${encodeURIComponent(t)}`))
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u=>`  <url><loc>${siteUrl}${u}</loc></url>`).join('\n')}\n</urlset>`
  fs.writeFileSync(path.join(outDir,'sitemap.xml'),xml,'utf8')
  console.log('sitemap.xml written')
}

function generateRSS(){
  const siteUrl = 'https://example.com'
  const posts = getAllPosts().sort((a,b)=> new Date(b.meta.date)-new Date(a.meta.date))
  const items = posts.map(p=>`<item>
<title><![CDATA[${p.meta.title}]]></title>
<link>${siteUrl}/posts/${p.slug}</link>
<description><![CDATA[${p.meta.description||''}]]></description>
<pubDate>${new Date(p.meta.date).toUTCString()}</pubDate>
</item>`).join('\n')
  const rss = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>Jamie Next Blog</title><link>${siteUrl}</link><description>Latest posts</description>${items}</channel></rss>`
  fs.writeFileSync(path.join(outDir,'rss.xml'),rss,'utf8')
  console.log('rss.xml written')
}

generateSitemap();
generateRSS();
