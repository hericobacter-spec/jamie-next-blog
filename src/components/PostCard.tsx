import Link from 'next/link'
import styled from 'styled-components'

const Card = styled.article`
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 14px;
  padding: 20px;
  transition: all 0.25s ease;
  display:flex;
  flex-direction:column;
  height:100%;
  box-shadow: var(--card-shadow);
  &:hover{
    transform: translateY(-4px);
    box-shadow: 0 18px 40px rgba(0,0,0,0.45);
    border-color: rgba(255,255,255,0.16);
  }
  @media (max-width:640px){padding:16px}
`
const Meta = styled.div`
  color:var(--muted);
  font-size:13px;
  margin-top:10px;
  display:flex;
  gap:8px;
  flex-wrap:wrap;
`
const Tag = styled.span`
  background:var(--code-bg);color:var(--foreground);padding:4px 8px;border-radius:999px;font-size:12px;
`
const CategoryBadge = styled.span<{color?:string}>`
  padding:6px 10px;border-radius:999px;font-size:12px;color:#fff;background:${p=>p.color || '#2563eb'};
`
const Reading = styled.span`
  color:var(--muted);font-size:13px;margin-left:8px;
`
export default function PostCard({post}:{post:any}){
  const category = post.meta?.category || post.category
  const reading = post.readingTime || post.meta?.readingTime
  return (
    <Card>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}>
        <h3 style={{margin:0,fontSize:18,color:'var(--foreground)'}}><Link href={`/posts/${post.slug}`}>{post.title}</Link></h3>
        {category ? <CategoryBadge color={category==='Foodie'? '#fb923c' : category==='A.I'? '#7c3aed' : category==='Life'? '#10b981' : '#2563eb'}>{category}</CategoryBadge> : null}
      </div>
      <Meta>
        <span>{post.date}</span>
        {reading ? <Reading>{reading}</Reading> : null}
        {post.meta?.tags?.map((t:string)=> <Tag key={t}>{t}</Tag>)}
      </Meta>
      <p style={{color:'var(--foreground)',marginTop:12,flex:1,lineHeight:1.6,fontSize:15}}>{post.description}</p>
      <div style={{marginTop:12,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <Link href={`/posts/${post.slug}`}>Read →</Link>
        <div style={{color:'#9ca3af',fontSize:13}}>{/* placeholder for extra actions */}</div>
      </div>
    </Card>
  )
}
