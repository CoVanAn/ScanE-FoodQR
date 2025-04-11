'use client'

import { useAppContext } from '@/components/app-provider'
// import { useAppContext } from '@/components/app-provider'
import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage
} from '@/lib/utils'
import { useLogoutMutation } from '@/queries/useAuth'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef } from 'react'

function Logout() {
  const { mutateAsync } = useLogoutMutation()
  const router = useRouter()
  const {setIsAuth} = useAppContext()
  // const { setRole } = useAppContext()
  const searchParams = useSearchParams()
  const refreshTokenFromUrl = searchParams.get('refreshToken')
  const accessTokenFromUrl = searchParams.get('accessToken')
  const ref = useRef<any>(null)
  useEffect(() => {
    if (
      !ref.current &&
      ((refreshTokenFromUrl &&
        refreshTokenFromUrl === getRefreshTokenFromLocalStorage()) ||
        (accessTokenFromUrl &&
          accessTokenFromUrl === getAccessTokenFromLocalStorage()))
    ) {
//Khi điều kiện !ref.current đúng (tức là ref.current đang là null), giá trị của ref.current được gán bằng mutateAsync.
//Điều này đánh dấu rằng logic đăng xuất đang được thực thi, và ngăn chặn việc thực thi lại logic này trong cùng một lần render.
      ref.current = mutateAsync
      mutateAsync().then((res) => {
        setTimeout(() => {
          ref.current = null
        }, 1000)
        // setRole()
        setIsAuth(false)
        router.push('/login')
      })
    } else {
      router.push('/')
    }
  }, [mutateAsync, router, refreshTokenFromUrl, accessTokenFromUrl])
  return <div>Log out....</div>
}
export default function LogoutPage() {
  return (
    <Suspense>
      <Logout />
    </Suspense>
  )
}
