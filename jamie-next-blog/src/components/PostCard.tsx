import Link from 'next/link'
import styled from 'styled-components'

const Card = styled.article`
  background:white;border:1px solid #e6edf3;border-radius:10px;padding:20px;transition:transform .12s,box-shadow .12s;display:flex;flex-direction:column;height:100%;
  &:hover{transform:translateY(-4px);box-shadow:0 10px 30px rgba(15,23,42,0.08)}
  @media (max-width:640px){padding:16px}
`
const Meta = styled.div`
  color:#6b7280;font-size:13px;margin-top:10px;display:flex;gap:8px;flex-wrap:wrap;
`
const Tag = styled.span`
  background:#f1f5f9;color:#0f172a;padding:4px 8px;border-radius:999px;font-size:12px;
`
const CategoryBadge = styled.span<{color?:string}>`
  padding:6px 10px;border-radius:999px;font-size:12px;color:#fff;background:${p=>p.color || '#2563eb'};
`
export default function PostCard({post}:{post:any}){
  const category = post.meta?.category || post.category
  return (
    <Card>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}>
        <h3 style={{margin:0,fontSize:18}}><Link href={`/posts/${post.slug}`}>{post.title}</Link></h3>
        {category ? <CategoryBadge color={category==='Foodie'? '#fb923c' : category==='A.I'? '#7c3aed' : category==='Life'? '#10b981' : '#2563eb'}>{category}</CategoryBadge> : null}
      </div>
      <Meta>
        <span>{post.date}</span>
        {post.meta?.tags?.map((t:string)=> <Tag key={t}>{t}</Tag>)}
      </Meta>
      <p style={{color:'#374151',marginTop:12,flex:1}}>{post.description}</p>
      <div style={{marginTop:12}}><Link href={`/posts/${post.slug}`}>Read →</Link></div>
    </Card>
  )
}
