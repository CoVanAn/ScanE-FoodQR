import { Role } from '@/constants/type'
// import { decodeToken } from '@/lib/utils'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import { TokenPayload } from './types/jwt.types'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'


const managePaths = ['/manage']
const guestPaths = ['/guest']
const onlyOwnerPaths = ['/manage/accounts']
const privatePaths = [...managePaths, ...guestPaths]
const unAuthPaths = ['/login']

// Create i18n middleware
const intlMiddleware = createMiddleware(routing)

export const decodeToken = (token: string) => {
  return jwt.decode(token) as TokenPayload
}

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Extract locale from pathname
  const pathnameIsMissingLocale = routing.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )
  
  // Get locale-free pathname for auth checks
  const localeFreePath = pathnameIsMissingLocale 
    ? pathname 
    : pathname.split('/').slice(2).join('/') || '/'
  
  // pathname: /manage/dashboard or /en/manage/dashboard
  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value
  
  // 1. Chưa đăng nhập thì không cho vào private paths
  if (privatePaths.some((path) => localeFreePath.startsWith(path)) && !refreshToken) {
    const url = new URL('/login', request.url)
    url.searchParams.set('clearTokens', 'true')
    return NextResponse.redirect(url)
  }

  // 2. Trường hợp đã đăng nhập
  if (refreshToken) {
    // 2.1 Nếu cố tình vào trang login sẽ redirect về trang chủ
    if (unAuthPaths.some((path) => localeFreePath.startsWith(path))) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // 2.2 Nhưng access token lại hết hạn
    if (
      privatePaths.some((path) => localeFreePath.startsWith(path)) &&
      !accessToken
    ) {
      const url = new URL('/refresh-token', request.url)
      url.searchParams.set('refreshToken', refreshToken)
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }    // 2.3 Vào không đúng role, redirect về trang chủ
    const role = decodeToken(refreshToken).role
    // Guest nhưng cố vào route owner
    const isGuestGoToManagePath =
      role === Role.Guest &&
      managePaths.some((path) => localeFreePath.startsWith(path))
    // Không phải Guest nhưng cố vào route guest
    const isNotGuestGoToGuestPath =
      role !== Role.Guest &&
      guestPaths.some((path) => localeFreePath.startsWith(path))
    if (isGuestGoToManagePath || isNotGuestGoToGuestPath) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    //Không phải Owner nhưng cố tình truy cập vào các route của owner
    const isNotOwnerGoToOwnerPath =
      role !== Role.Owner &&
      onlyOwnerPaths.some((path) => localeFreePath.startsWith(path))

      if(
      isNotOwnerGoToOwnerPath ||
      isNotGuestGoToGuestPath ||
      isGuestGoToManagePath 
      ) {
        return NextResponse.redirect(new URL('/', request.url))
      }
  }
  
  // Handle i18n routing
  return intlMiddleware(request)
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',
    
    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    '/(vi|en)/:path*',
    
    // Enable redirects that add missing locales
    // (e.g. `/pathnames` -> `/en/pathnames`)
    '/((?!_next|_vercel|.*\\..*).*)'
  ]
}
