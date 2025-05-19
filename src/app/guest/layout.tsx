'use client'
import dynamic from 'next/dynamic'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ListOrdered, Soup } from "lucide-react"
import { Button } from "@/components/ui/button"


// Tránh lỗi hydration khi CartButton sử dụng localStorage
const CartButton = dynamic(() => import('@/app/guest/cart/cart-button'), {
  ssr: false
})

export default function GuestLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const navItems = [
    {
      href: '/guest/menu',
      label: 'Menu',
      icon: <Soup className="h-4 w-4" />
    },
    {
      href: '/guest/orders',
      label: 'Đơn hàng',
      icon: <ListOrdered className="h-4 w-4" />
    }
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="container flex items-center justify-between h-14">
          <Link href="/guest/menu" className="font-semibold">
            {localStorage.getItem('guestName')}
          </Link>
          <nav className="flex items-center">
            <ul className="flex items-center gap-4 mr-4">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn('text-sm', {
                      'font-semibold': pathname === item.href
                    })}
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      className="relative"
                    >
                      {item.icon}
                      {/* <span className="sr-only">{item.label}</span> */}
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
            <CartButton />
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-4">{children}</div>
      </main>
    </div>
  )
}
