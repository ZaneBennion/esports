import { AuthHeader } from '@/components/header/auth-header'
import { ThemeToggle } from '@/components/header/theme-toggle'
import Link from 'next/link'

// Sub-component: Logo
function Logo() {
  return (
    <Link href="/" className="text-xl font-bold">
      Home/Logo
    </Link>
  )
}

// Sub-component: Header Actions Wrapper
function HeaderActions() {
  return (
    <div className="flex items-center gap-3">
      <ThemeToggle />
      <AuthHeader />
    </div>
  )
}

export function Header() {
  return (
    <>
      <header className="bg-[var(--background)] text-[var(--foreground)] py-2 px-4 md:py-3">
        <div className="max-w-[80rem] mx-auto flex justify-between items-center">
          <Logo />
          <HeaderActions />
        </div>
      </header>
      <hr className="h-0.5 bg-gradient-to-b from-[var(--highlight)] from-0% via-[var(--highlight)] via-50% to-[var(--shadow)] to-50% border-0" />
    </>
  )
}
