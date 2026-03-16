import Link from 'next/link'

export default function Home(){
  return (
    <div style={{maxWidth:800,margin:'0 auto',padding:24}}>
      <h1>Jamie Next Blog</h1>
      <p>A starter blog using contentlayer and styled-components.</p>
      <Link href="/posts">Read posts</Link>
    </div>
  )
}
