'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function GuestGreeting() {
  const [guestName, setGuestName] = useState("Quý khách")
  
  useEffect(() => {
    try {
      const storedName = localStorage.getItem("guest-name")
      if (storedName) {
        setGuestName(storedName)
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error)
    }

    // Thêm event listener để cập nhật tên khi localStorage thay đổi
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "guest-name" && e.newValue) {
        setGuestName(e.newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [])
  
  return (
    <Link href="/guest/profile" className="font-semibold hover:underline">
      Xin chào {guestName}
    </Link>
  )
}
