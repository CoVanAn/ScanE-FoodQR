import dishApiRequest from '@/apiRequests/dish'
import React from 'react'
import { wrapServerApi } from '@/lib/utils'
import DishDetail from './dish-detail'

const page = async ({ params }: {
  params: Promise<{
    id: string
  }>
}) => {
  const {id} = await params
  const data = await wrapServerApi(() => dishApiRequest.getDish(Number(id)))
  const dish = data?.payload?.data
  if (!dish) {
    return <div className='text-center text-black font-medium'>Món ăn không tồn tại</div>
  }
  return (
   <DishDetail dish={dish} />
  )
}

export default page
