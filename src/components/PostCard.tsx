import Link from 'next/link'
import styled from 'styled-components'

const Card = styled.article`
  background:white;border:1px solid #e6edf3;border-radius:8px;padding:18px;transition:box-shadow .18s;display:flex;flex-direction:column;height:100%;
  &:hover{box-shadow:0 6px 18px rgba(15,23,42,0.06)}
`
const Meta = styled.div`
  color:#6b7280;font-size:13px;margin-top:8px;
`
export default function PostCard({post}:{post:any}){
  return (
    <Card>
      <h3 style={{margin:0,fontSize:18}}><Link href={`/posts/${post.slug}`}>{post.title}</Link></h3>
      <Meta>{post.date} • {post.description}</Meta>
      <div style={{marginTop:12}}><Link href={`/posts/${post.slug}`}>Read →</Link></div>
    </Card>
  )
}
