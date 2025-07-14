'use client'
import { formatCurrency, generateSlugUrl } from '@/lib/utils'
import { DishListResType } from '@/schemaValidations/dish.schema'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { memo } from 'react'

interface DishListProps {
  dishes: DishListResType['data']
}

// Component cho từng món ăn
const DishItem = memo(({ dish }: { dish: DishListResType['data'][0] }) => (
  <Link
    href={`/dishes/${generateSlugUrl({ name: dish.name, id: dish.id })}`}
    className='flex gap-4 w-full group'
  >
    <div className='flex-shrink-0'>
      <Image
        src={dish.image}
        width={150}
        height={150}
        quality={75}
        alt={dish.name}
        loading="lazy"
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyLDSyRtaNHggsAwjQepyGZNfpkbj5rz3Oz2lneDEhVvs+h/TJ33v6v/9k="
        className='object-cover w-[120px] h-[120px] rounded-md sm:w-[150px] sm:h-[150px] transition-transform duration-200 group-hover:scale-105'
      />
    </div>
    <div className='space-y-1 flex-1'>
      <h3 className='text-[16px] sm:text-2xl font-medium group-hover:text-primary transition-colors line-clamp-2'>
        {dish.name}
      </h3>
      <p className='text-sm sm:text-base font-semibold text-primary'>
        {formatCurrency(dish.price)}
      </p>
      <p className='text-xs sm:text-sm text-muted-foreground line-clamp-2'>
        {dish.description}
      </p>
    </div>
  </Link>
))

DishItem.displayName = 'DishItem'

function DishList({ dishes }: DishListProps) {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 gap-10'>
      {dishes.map((dish) => (
        <DishItem key={dish.id} dish={dish} />
      ))}
    </div>
  )
}

export default memo(DishList)
