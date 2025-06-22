'use client'

import { useTheme } from "next-themes"
import Image from "next/image"
import { useEffect, useState } from "react"

export function ThemeBackground() {
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Xác định theme hiện tại:
  // - Nếu đã mounted: kiểm tra theme người dùng chọn, nếu là system thì dùng systemTheme
  // - Nếu chưa mounted: dùng light theme để tránh hydration mismatch
  const currentTheme = mounted ? (theme === 'system' ? systemTheme : theme) : 'light'

  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0" />
      <Image
        src={currentTheme === 'dark' ? '/muoi_tieu_dark.jpg' : '/muoi_tieu_light.jpg'}
        alt="Background"
        fill
        className="object-cover opacity-40"
        sizes="100vw"
        priority
      />
    </div>
  )
}
