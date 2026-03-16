import React from 'react'
import Highlight, {defaultProps, Language} from 'prism-react-renderer'
import theme from 'prism-react-renderer/themes/vsDark'
import styled from 'styled-components'

const Pre = styled.pre`
  background: #0f172a; color: #f8fafc; padding:16px; border-radius:8px; overflow:auto; font-size:14px;
`
const Line = styled.div`
  display:block; padding:0 8px;
`
export default function CodeBlock({className, children}:{className?:string; children:any}){
  const language = (className || '').replace('language-','') as Language || 'tsx'
  return (
    <Highlight {...defaultProps} theme={theme} code={String(children).trim()} language={language}>
      {({className, style, tokens, getLineProps, getTokenProps}) => (
        <Pre className={className} style={style}>
          {tokens.map((line, i) => (
            <Line key={i} {...getLineProps({line, key:i})}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({token, key})} />
              ))}
            </Line>
          ))}
        </Pre>
      )}
    </Highlight>
  )
}
