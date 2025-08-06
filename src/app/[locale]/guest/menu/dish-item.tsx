'use client'
import Image from 'next/image'
import { cn, formatCurrency } from '@/lib/utils'
import { DishStatus } from '@/constants/type'
import { DishListResType } from '@/schemaValidations/dish.schema'
import { memo, useState } from 'react'
import dynamic from 'next/dynamic'

// Lazy load components
const Quantity = dynamic(() => import('./quantity'), {
  loading: () => <div className="w-16 h-6 bg-muted animate-pulse rounded"></div>
})

const DishDetailDialog = dynamic(() => import('./dish-detail-dialog'), {
  loading: () => null
})

type DishItem = DishListResType['data'][0]

interface DishItemProps {
  dish: DishItem
  quantity: number
  onQuantityChange: (dishId: number, quantity: number) => void
}

function DishItem({ dish, quantity, onQuantityChange }: DishItemProps) {
  const [showDialog, setShowDialog] = useState(false)

  const handleDishClick = () => {
    setShowDialog(true)
  }

  const handleQuantityClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent opening dialog when clicking quantity controls
  }

  return (
    <>
      <div
        className={cn('flex gap-3 px-6 sm:px-0 cursor-pointer hover:bg-muted/30 rounded-lg transition-colors', {
          'pointer-events-none opacity-60': dish.status === DishStatus.Unavailable
        })}
        onClick={handleDishClick}
      >
        <div className='flex-shrink-0 relative'>
          {dish.status === DishStatus.Unavailable && (
            <div className='absolute inset-0 rounded-md dark:bg-black/70 bg-white/70 z-10'>
              <span className='absolute inset-0 flex items-center justify-center text-sm font-medium'>
                Hết hàng
              </span>
            </div>
          )}
          <Image
            src={dish.image}
            alt={dish.name}
            height={100}
            width={100}
            quality={75}
            priority={false}
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyLDSyRtaNHggsAwjQepyGZNfpkbj5rz3Oz2lneDEhVvs+h/TJ33v6v/9k="
            className='object-cover w-[80px] h-[80px] rounded-md transition-opacity duration-200'
          />
        </div>
        <div className='space-y-1 flex-1'>
          <h3 className='text-sm font-medium line-clamp-2'>{dish.name}</h3>
          <p className='text-xs text-muted-foreground line-clamp-2'>{dish.description}</p>
          <p className='text-xs font-semibold text-primary'>
            {formatCurrency(dish.price)}
          </p>
        </div>
        <div 
          className='flex-shrink-0 ml-auto flex justify-center items-center'
          onClick={handleQuantityClick}
        >
          <Quantity
            hidden={dish.status === DishStatus.Unavailable}
            onChange={(value) => onQuantityChange(dish.id, value)}
            value={quantity}
          />
        </div>
      </div>

      {/* Dish Detail Dialog */}
      <DishDetailDialog
        dish={dish}
        open={showDialog}
        onOpenChange={setShowDialog}
        quantity={quantity}
        onQuantityChange={onQuantityChange}
      />
    </>
  )
}

// Memo để tránh re-render không cần thiết
export default memo(DishItem)
