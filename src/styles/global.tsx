import { createGlobalStyle } from 'styled-components'
import theme from './theme'

const GlobalStyle = createGlobalStyle`
  :root{
    --color-primary: ${theme.colors.primary};
    --color-accent: ${theme.colors.accent};
    --color-muted: ${theme.colors.muted};
    --font-sans: ${theme.fonts.sans};
    --font-serif: ${theme.fonts.serif};
  }
  html,body,#root{height:100%;}
  body{
    margin:0;
    font-family: var(--font-sans);
    background: ${theme.colors.surface};
    color: ${theme.colors.primary};
    -webkit-font-smoothing:antialiased;
    -moz-osx-font-smoothing:grayscale;
  }
  a{color:var(--color-accent);}
  .container{max-width:960px;margin:0 auto;padding:0 24px}
  .prose{line-height:1.75;font-size:18px}
`

export default GlobalStyle
