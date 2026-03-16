import React from 'react'
import styled from 'styled-components'

const Pre = styled.pre`
  background: #0f172a; color: #f8fafc; padding:16px; border-radius:8px; overflow:auto; font-size:14px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", "Courier New", monospace;
`
const Inline = styled.code`
  background:#f3f4f6;padding:2px 6px;border-radius:4px;font-family:ui-monospace,monospace;font-size:90%;
`
export default function CodeBlock({className, children}:{className?:string; children:any}){
  // simple fallback code block styling for now; can be upgraded to prism/shiki later
  return (
    <Pre>
      <code>{String(children).trim()}</code>
    </Pre>
  )
}

export const InlineCode = ({children}:{children:any}) => <Inline>{children}</Inline>
