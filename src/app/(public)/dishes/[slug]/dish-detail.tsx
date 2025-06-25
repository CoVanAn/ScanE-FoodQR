import React from 'react'
import { formatCurrency } from '@/lib/utils'
import Image from 'next/image'
import { DishResType } from '@/schemaValidations/dish.schema'

const DishDetail = async ({ dish }: {
    dish: DishResType['data'] | null
}) => {
    if (!dish) {
        return <div className='text-center text-black font-medium'>Món ăn không tồn tại</div>
    }
    return (
        <div>
            <div className='space-y-4'>
                <h1 className='text-2xl font-semibold'>
                    {dish.name}
                </h1>
                <div>

                    <Image
                        src={dish.image}
                        alt={dish.name}
                        width={300}
                        height={300}
                        className='rounded-md object-cover w-full sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px] 2xl:h-[700px] h-[300px] max-h-[500px] max-w-[1080px] mx-auto'
                    />
                </div>

                <div className='font-semibold text-lg'>
                    Giá: {formatCurrency(dish.price)}
                </div>
                <div className='text-gray-700'>
                    {dish.description}
                </div>
            </div>
        </div>
    )
}

export default DishDetail
