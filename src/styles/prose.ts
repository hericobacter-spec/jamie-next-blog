import { css } from 'styled-components'

const prose = css`
  .prose {
    color: #0f172a;
  }
  .prose h1{font-size:34px;margin:0 0 18px;font-weight:700}
  .prose h2{font-size:26px;margin:24px 0 12px;font-weight:700}
  .prose h3{font-size:20px;margin:20px 0 10px;font-weight:600}
  .prose p{margin:14px 0;color:#374151}
  @media (max-width:640px){
    .prose{font-size:16px}
    .prose h1{font-size:28px}
    .prose h2{font-size:22px}
  }
  .prose ul,.prose ol{margin:12px 0 12px 20px}
  .prose blockquote{border-left:4px solid #e6edf3;padding:12px 16px;color:#374151;background:#fbfcfd;border-radius:4px}
  .prose hr{border:none;border-top:1px solid #e6edf3;margin:28px 0}
  .prose a{color:#2563eb}
  .prose strong{font-weight:700}
  .prose em{font-style:italic}
  .prose img{max-width:100%;display:block;margin:12px 0;border-radius:6px}
  .prose figure{margin:0}
  .prose figcaption{font-size:13px;color:#6b7280;text-align:center;margin-top:6px}
  .prose table{width:100%;border-collapse:collapse;margin:12px 0;font-size:14px}
  .prose th,.prose td{border:1px solid #e6edf3;padding:8px 12px;text-align:left}
  .prose th{background:#f8fafc;font-weight:600}
  .prose tr:nth-child(even){background:#f9fafb}
  @media(max-width:640px){
    .prose table{display:block;overflow-x:auto;-webkit-overflow-scrolling:touch}
    .prose th,.prose td{padding:6px 8px;font-size:13px;white-space:nowrap}
  }
  .prose th,.prose td{border:1px solid #e6edf3;padding:8px;text-align:left}
  .prose code{background:#f3f4f6;padding:2px 6px;border-radius:4px;font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Courier New', monospace}
  pre[class*="language-"]{background:#0f172a;color:#f8fafc;padding:16px;border-radius:8px;overflow:auto}
`

export default prose
