import React from 'react'
import styled from 'styled-components'

const Tip = styled.div`
  background: #ecfeff;
  border-left: 4px solid #06b6d4;
  padding: 14px;
  border-radius: 6px;
  margin: 12px 0;
  color: #064e3b;
`
const Note = styled.div`
  background: #f8fafc;
  border-left: 4px solid #0ea5a3;
  padding: 14px;
  border-radius: 6px;
  margin: 12px 0;
  color: #075985;
`
const Warn = styled.div`
  background: #fef2f2;
  border-left: 4px solid #ef4444;
  padding: 14px;
  border-radius: 6px;
  margin: 12px 0;
  color: #7f1d1d;
`

export function TipBox({ children }:{children:any}){ return <Tip>{children}</Tip> }
export function NoteBox({ children }:{children:any}){ return <Note>{children}</Note> }
export function WarnBox({ children }:{children:any}){ return <Warn>{children}</Warn> }

export default function Admonition({ type='tip', children }:{ type?:string, children:any }){
  if(type==='warning') return <Warn>{children}</Warn>
  if(type==='note') return <Note>{children}</Note>
  return <Tip>{children}</Tip>
}
