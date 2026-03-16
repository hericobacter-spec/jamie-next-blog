import { defineDocumentType, makeSource } from 'contentlayer/source-files'

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `posts/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    excerpt: { type: 'string', required: false },
    slug: { type: 'string', required: false }
  },
  computedFields: {
    slug: { type: 'string', resolve: doc => doc._raw.sourceFileName.replace(/\.mdx?$/, '') }
  }
}))

export default makeSource({
  contentDirPath: 'posts',
  documentTypes: [Post],
})
