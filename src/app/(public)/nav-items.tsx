'use client'

import { useAppContext } from '@/components/app-provider'
import { getAccessTokenFromLocalStorage } from '@/lib/utils'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { set } from 'zod'

const menuItems = [
  {
    title: 'Trang chủ',
    href: '/'
  },
  {
    title: 'Món ăn',
    href: '/menu'
  },
  {
    title: 'Đơn hàng',
    href: '/orders',
    authRequired: true //khi true nghĩa là đã đăng nhập thì sẽ hiển thị
  },
  {
    title: 'Đăng nhập',
    href: '/login',
    authRequired: false //khi false nghĩa là chưa đăng nhập thì sẽ hiển thị
  },
  {
    title: 'Quản lý',
    href: '/manage/dashboard',
    authRequired: true //khi true nghĩa là đã đăng nhập thì sẽ hiển thị
  }
]

export default function NavItems({ className }: { className?: string }) {
  const {isAuth} = useAppContext()
  // useEffect(() => {
  //   setIsAuth(Boolean(getAccessTokenFromLocalStorage()))
  // }, [])
  return menuItems.map((item) => {
    if(item.authRequired === false && isAuth || item.authRequired === true && !isAuth) {
      return null
    }
    return (
      <Link href={item.href} key={item.href} className={className}>
        {item.title}
      </Link>
    )
  })
}
