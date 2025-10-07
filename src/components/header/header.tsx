import { AuthHeader } from '@/components/header/auth-header'
import { ThemeToggle } from '@/components/header/theme-toggle'
import Link from 'next/link'
import styles from './header.module.css'

export function Header() {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.logo}>
            Home/Logo
          </Link>
          <div className={styles.headerActions}>
            <ThemeToggle />
            <AuthHeader />
          </div>
        </div>
      </header>
      <hr className={styles.divider} />
    </>
  )
}
