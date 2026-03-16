export function siteMeta(){
  return {
    title: 'Jamie Next Blog',
    description: 'A refined starter blog — MDX-driven, fast, and minimal. I write about engineering, food, AI experiments, and daily life.',
    siteUrl: 'https://jamie-next-blog.vercel.app'
  }
}

export function postMetaFrom(post:any){
  const meta = post.meta || {}
  return {
    title: meta.title || post.title || 'Post',
    description: meta.description || post.description || '',
    image: meta.thumbnail || '/images/avatar.png',
    url: `${siteMeta().siteUrl}/posts/${post.slug}`
  }
}
