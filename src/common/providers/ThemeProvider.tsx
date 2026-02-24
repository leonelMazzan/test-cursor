import { useEffect, type ReactNode } from 'react'
import { useThemeStore } from '@/common/stores/useThemeStore'

interface ThemeProviderProps {
  children: ReactNode
}

/**
 * ThemeProvider component that applies the theme class to the document root
 * @component
 */
const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const theme = useThemeStore((state) => state.theme)

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme])

  return <>{children}</>
}

export default ThemeProvider
