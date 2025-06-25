import dishApiRequest from '@/apiRequests/dish'
import React from 'react'
import {  getIdFromSlugUrl, wrapServerApi } from '@/lib/utils'
import Modal from './modal'
import DishDetail from '@/app/(public)/dishes/[slug]/dish-detail'

const page = async ({ params }: {
  params: Promise<{
    slug: string
  }>
}) => {
  const { slug } = await params
  const id = getIdFromSlugUrl(slug)
  const data = await wrapServerApi(() => dishApiRequest.getDish(Number(id)))
  const dish = data?.payload?.data
  if (!dish) {
    return <div className='text-center text-black font-medium'>Món ăn không tồn tại</div>
  }
  return (
    <Modal>
      <DishDetail dish={dish} />
    </Modal>
  )
}

export default page
