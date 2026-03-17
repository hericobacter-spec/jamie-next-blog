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
  return <MDXRemote {...mdxSource} components={components} />
}
