// import Link from 'next/link'
import { Link } from '@/i18n/navigation'
import { Menu, Package2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog'
import { getTranslations } from 'next-intl/server'
import dynamic from 'next/dynamic'

// Lazy load các components không cần thiết ngay lập tức
const NavItems = dynamic(() => import('@/app/[locale]/(public)/nav-items'), {
  loading: () => <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
})

const DarkModeToggle = dynamic(() => import('@/components/custom/strickmode').then(mod => ({ default: mod.DarkModeToggle })), {
  loading: () => <div className="h-9 w-9 bg-muted animate-pulse rounded-md"></div>
})

const LanguageSwitcher = dynamic(() => import('@/components/language-switcher'), {
  loading: () => <div className="h-9 w-[120px] bg-muted animate-pulse rounded-md"></div>
})

export default async function Layout({
  children,
  modal
}: Readonly<{
  children: React.ReactNode
  modal?: React.ReactNode
}>) {
  const t = await getTranslations('SwitchLanguage')

  return (
    <div className='flex min-h-screen w-full flex-col relative'>
      <header className='sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-20 shadow-sm md:gap-6 lg:px-8'>
        <nav className='hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6'>
          <Link href='#' className='flex items-center gap-2 text-lg font-semibold md:text-base'>
            <Package2 className='h-6 w-6' />
            <span className='sr-only'>An Cồ</span>
          </Link>
          <NavItems className='text-muted-foreground transition-colors hover:text-foreground flex-shrink-0' />
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant='outline' size='icon' className='shrink-0 md:hidden'>
              <Menu className='h-5 w-5' />
              <span className='sr-only'>Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" >
            <DialogTitle className="sr-only">Menu điều hướng</DialogTitle>
            <DialogDescription className="sr-only">Danh sách các mục trong menu</DialogDescription>
            <nav className="grid gap-6 text-lg font-medium left-0 top-0 p-4">
              <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
                <Package2 className="h-6 w-6" />
                <span className="sr-only">An Cồ</span>
              </Link>
              <NavItems className="text-muted-foreground transition-colors hover:text-foreground" />
              <div className="flex flex-col gap-4 mt-6 pt-6 border-t">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{t('label')}</span>
                  <LanguageSwitcher />
                </div>
                <DarkModeToggle />
              </div>
            </nav>
          </SheetContent>
        </Sheet>
        <div className='ml-auto flex items-center gap-3'>
          <LanguageSwitcher />
          <DarkModeToggle />
        </div>
      </header>
      <main className='flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8'>
        {children}
        {modal}
      </main>
    </div>
  )
}
