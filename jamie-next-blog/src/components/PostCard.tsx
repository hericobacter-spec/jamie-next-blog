import Link from 'next/link'
import styled from 'styled-components'

const Card = styled.article`
  border: 1px solid #e5e7eb;
  padding: 16px;
  border-radius: 8px;
`

export default function PostCard({post}:{post:any}){
  return (
    <Card>
      <h2><Link href={`/posts/${post.slug}`}>{post.title}</Link></h2>
      <p>{post.excerpt}</p>
    </Card>
  )
}
