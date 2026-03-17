import { css } from 'styled-components'

const typography = css`
  h1 { font-size: 42px; font-weight: 800; line-height: 1.2; }
  h2 { font-size: 30px; font-weight: 700; margin-top: 1.2em; }
  h3 { font-size: 22px; font-weight: 600; }

  p { font-size: 17px; line-height: 1.8; color: #374151; }

  blockquote {
    border-left: 4px solid #e5e7eb;
    padding-left: 16px;
    color: #6b7280;
    font-style: italic;
  }

  code.inline { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }

  table { width: 100%; border-collapse: collapse; overflow-x: auto; }
  thead { background: #f9fafb; }
  tbody tr:nth-child(odd) { background: rgba(0,0,0,0.02); }
  th, td { padding: 10px; border: 1px solid #eee; text-align: left; }
`

export default typography
