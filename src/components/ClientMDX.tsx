"use client"
import React from 'react'
import { MDXRemote } from 'next-mdx-remote'
import CodeBlock from '@/components/CodeBlock'

const components = {
  pre: (props: any) => <div {...props} />,
  code: ({ className, children }: any) => (
    <CodeBlock className={className}>{children}</CodeBlock>
  ),
}

export default function ClientMDX({ mdxSource }: { mdxSource: any }) {
  // Diagnostic: ensure mdxSource is passed through correctly
  try{
    if(!mdxSource) throw new Error('DEBUG_MDXSOURCE_MISSING')
    if(typeof mdxSource !== 'object') throw new Error(`DEBUG_MDXSOURCE_TYPE:${typeof mdxSource}`)
    if('compiledSource' in mdxSource && !mdxSource.compiledSource) throw new Error('DEBUG_MDXSOURCE_EMPTY_COMPILED')
  }catch(e){
    throw e
  }
  return <MDXRemote {...mdxSource} components={components} />
}
