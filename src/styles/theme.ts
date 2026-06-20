/**
 * Apple Design System — theme constants
 * Mirrors CSS custom properties from globals.css / design2.md
 */
const theme = {
  colors: {
    ink: '#1d1d1f',
    graphite: '#707070',
    slate: '#474747',
    ash: '#333333',
    fog: '#f5f5f7',
    snow: '#ffffff',
    obsidian: '#000000',
    silverMist: '#e8e8ed',
    azure: '#0071e3',
    cobaltLink: '#0066cc',
    caution: '#b64400',
  },
  fonts: {
    display: `'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,
    text: `'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,
    sans: `'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,
  },
  typeScale: {
    caption: '12px',
    bodySm: '14px',
    body: '17px',
    subheading: '20px',
    headingSm: '24px',
    heading: '40px',
    headingLg: '56px',
    display: '96px',
  },
  radii: {
    card: '28px',
    cardCompact: '20px',
    badge: '10px',
    input: '10px',
    button: '999px',
    pill: '999px',
  },
  spacing: {
    page: '1200px',
    container: '24px',
    sectionGap: '80px',
    cardPadding: '28px',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
} as const

export default theme
