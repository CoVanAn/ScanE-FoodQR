'use client'
import dynamic from 'next/dynamic'
import { cn } from '@/lib/utils'
// import Link from 'next/link'
import { usePathname, Link } from '@/i18n/navigation'
import { ListOrdered, Soup } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

// Tránh lỗi hydration khi CartButton sử dụng localStorage
const CartButton = dynamic(() => import('./cart/cart-button'), {
  ssr: false
})

export default function GuestLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [guestName, setGuestName] = useState<string>("")

  // Chỉ truy cập localStorage khi ở phía client
  useEffect(() => {
    // Đảm bảo code này chỉ chạy ở client
    const name = localStorage.getItem('guestName') || 'Khách'
    setGuestName(name)
  }, [])

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
    <div className="flex flex-col">
      <header className="border-b sticky top-0 pt-2 bg-[#693F1F] z-10 px-6 pb-2">
        <div className="flex items-center justify-between">
          <Link href="/guest/menu" className="font-semibold flex items-center">
            {/* <span className=" bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center mr-2">
              {guestName ? guestName.charAt(0).toUpperCase() : "K"}
            </span> */}
            <span className="text-white text-lg font-semibold">
              {guestName
                ? guestName.length > 15
                  ? guestName.slice(0, 10) + '...'
                  : guestName
                : "Khách"}
            </span>
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
      <main className="flex-1 flex justify-center items-center ">
        {/* <ThemeBackground/> */}
        <div className="fixed inset-0 -z-10">
          <div className=" inset-0  h-full bg-[#EBE3D8] dark:bg-[#1c1717]" />
        </div>
        <div className="container py-4">{children}</div>
      </main>
    </div>
  )
}
