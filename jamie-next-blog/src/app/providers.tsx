import ThemeProviderClient from '@/components/ThemeProviderClient'

export function Providers({ children }: { children: React.ReactNode }){
  return (
    <ThemeProviderClient>
      {children}
    </ThemeProviderClient>
  )
}
export default Providers
