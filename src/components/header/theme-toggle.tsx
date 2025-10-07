'use client'

import { useEffect, useState } from 'react'
import styles from './theme-toggle.module.css'

// Sun Icon Component
function SunIcon() {
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  )
}

// Moon Icon Component
function MoonIcon() {
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check localStorage or system preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.setAttribute('data-theme', savedTheme)
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const initialTheme = prefersDark ? 'dark' : 'light'
      setTheme(initialTheme)
      document.documentElement.setAttribute('data-theme', initialTheme)
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <button className={styles.themeToggle}>
        Theme
      </button>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className={styles.themeToggle}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <>
          <MoonIcon />
        </>
      ) : (
        <>
          <SunIcon />
        </>
      )}
    </button>
  )
}

