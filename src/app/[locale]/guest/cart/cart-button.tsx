'use client'
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/hooks/useCartContext"
import { ShoppingCart } from "lucide-react"
// import { useRouter } from "next/navigation"
import { useRouter} from '@/i18n/navigation'
import { useEffect } from "react"


export default function CartButton() {
  const { cartCount } = useCart()
  const router = useRouter()
  
  useEffect(() => {
    console.log('🛒 CartButton re-rendered, cartCount:', cartCount)
  }, [cartCount])

  return (
    <Button 
      variant="outline" 
      size="icon" 
      className="relative"
      onClick={() => router.push('/guest/cart')}
    >
      <ShoppingCart className="h-4 w-4" />
      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {cartCount}
        </span>
      )}
    </Button>
  )
}
