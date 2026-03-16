import { allPosts } from 'contentlayer/generated'

export function getAllPosts(){
  return allPosts.sort((a,b)=> new Date(b.date).valueOf() - new Date(a.date).valueOf())
}

export function getPostBySlug(slug:string){
  return allPosts.find(p=>p.slug===slug)
}
