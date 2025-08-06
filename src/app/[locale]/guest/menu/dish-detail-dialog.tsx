'use client'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatCurrency } from '@/lib/utils'
import Image from 'next/image'
import { DishListResType } from '@/schemaValidations/dish.schema'
import { DishStatus } from '@/constants/type'
import { Badge } from '@/components/ui/badge'
import dynamic from 'next/dynamic'

// Lazy load Quantity component
const Quantity = dynamic(() => import('./quantity'), {
  loading: () => <div className="w-16 h-6 bg-muted animate-pulse rounded"></div>
})

type DishItem = DishListResType['data'][0]

interface DishDetailDialogProps {
  dish: DishItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  quantity: number
  onQuantityChange: (dishId: number, quantity: number) => void
}

export default function DishDetailDialog({
  dish,
  open,
  onOpenChange,
  quantity,
  onQuantityChange
}: DishDetailDialogProps) {
  if (!dish) return null

  const getStatusBadge = (status: string) => {
    switch (status) {
      case DishStatus.Available:
        return <Badge variant="default" className="bg-green-500">Còn hàng</Badge>
      case DishStatus.Unavailable:
        return <Badge variant="destructive">Hết hàng</Badge>
      case DishStatus.Hidden:
        return <Badge variant="secondary">Đã ẩn</Badge>
      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-3 pt-4 pb-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold line-clamp-2">
            {dish.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Image */}
          <div className="relative">
            <Image
              src={dish.image}
              alt={dish.name}
              width={400}
              height={300}
              className="rounded-lg object-cover w-full h-64"
              priority={false}
              loading="lazy"
            />
            {dish.status === DishStatus.Unavailable && (
              <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold">Hết hàng</span>
              </div>
            )}
          </div>

          {/* Price and Status */}
          <div className="flex items-center justify-between mb-2">
            <div className="text-mobile-2xl font-bold">
              {formatCurrency(dish.price)}
            </div>
            {getStatusBadge(dish.status)}
          </div>

          {/* Category */}
          {dish.category && (
            <div className="text-sm text-muted-foreground mb-2">
              <span className="font-medium">Danh mục:</span> {dish.category.name}
            </div>
          )}

          {/* Description */}
          {dish.description && (
            <div>
              <h4 className="font-medium ">Mô tả:</h4>
              <p className="text-sm text-muted-foreground">
                {dish.description}
              </p>
            </div>
          )}

          {/* Quantity Control */}
          
          {dish.status === DishStatus.Available && (
            <div className="flex items-center justify-between">
              <span className="font-medium">Số lượng:</span>
              <Quantity
                value={quantity}
                onChange={(value) => onQuantityChange(dish.id, value)}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
