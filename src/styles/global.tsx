import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html,
  body {
    margin: 0;
    padding: 0;
  }

  body {
    background: var(--background);
    color: var(--foreground);
    font-family: var(--font-cosmica, 'Plus Jakarta Sans', system-ui, sans-serif);
    font-size: 17px;
    line-height: 1.47;
    letter-spacing: -0.006em;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  a {
    color: var(--color-cobalt-link, #0066cc);
    text-decoration: none;
    transition: color 0.15s ease;
  }

  a:hover {
    color: var(--color-azure, #0071e3);
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }
`

export default GlobalStyle
