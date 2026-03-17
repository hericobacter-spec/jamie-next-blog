import React from 'react'
import styled from 'styled-components'

const Wrap = styled.figure`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 28px 0;
`
const Img = styled.img`
  max-width: 100%;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
`
const Caption = styled.figcaption`
  text-align: center;
  font-size: 14px;
  color: #6b7280;
  margin-top: 6px;
`

export default function Figure({ src, alt, caption }: { src: string; alt?: string; caption?: string }){
  return (
    <Wrap>
      <Img src={src} alt={alt||caption||''} />
      {caption ? <Caption>{caption}</Caption> : null}
    </Wrap>
  )
}
