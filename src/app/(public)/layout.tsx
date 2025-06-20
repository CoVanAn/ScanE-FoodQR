import Link from 'next/link'
import { Menu, Package2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import NavItems from '@/app/(public)/nav-items'
import { DarkModeToggle } from '@/components/custom/strickmode'
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog'

export default function Layout({
  children,
  modal
}: Readonly<{
  children: React.ReactNode
  modal?: React.ReactNode
}>) {
  return (
    <div className='flex min-h-screen w-full flex-col relative'>
      <header className='sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-20'>
        <nav className='hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6'>
          <Link href='#' className='flex items-center gap-2 text-lg font-semibold md:text-base'>
            <Package2 className='h-6 w-6' />
            <span className='sr-only'>Big boy</span>
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
                <span className="sr-only">Big boy</span>
              </Link>
              <NavItems className="text-muted-foreground transition-colors hover:text-foreground" />
            </nav>
          </SheetContent>
        </Sheet>
        <div className='ml-auto'>
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
