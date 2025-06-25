'use client'

import {
  checkAndRefreshToken,
  getRefreshTokenFromLocalStorage
} from '@/lib/utils'
import { useSearchParams } from 'next/navigation'
import { useRouter} from '@/i18n/navigation'
import { Suspense, useEffect } from 'react'

function RefreshToken() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const refreshTokenFromUrl = searchParams.get('refreshToken')
  const redirectPathname = searchParams.get('redirect')
  useEffect(() => {
    if (
      refreshTokenFromUrl &&
      refreshTokenFromUrl === getRefreshTokenFromLocalStorage()
    ) {
      checkAndRefreshToken({
        onSuccess: () => {
          router.push(redirectPathname || '/')
        }
      })
    } else {
      router.push('/')
    }
  }, [router, refreshTokenFromUrl, redirectPathname])
  return <div>Refresh token....</div>
}

export default function RefreshTokenPage() {
  return (
    //Suppense is used to show a fallback UI while the component is loading
    //This is useful when the component is loading data or performing some async operation
    //In this case, we are using it to show a loading message while the RefreshToken component is loading
    //You can replace the fallback with a loading spinner or any other UI you want
    //to show while the component is loading
    <Suspense fallback={<div>Loading...</div>}>
      <RefreshToken />
    </Suspense>
  )
}
