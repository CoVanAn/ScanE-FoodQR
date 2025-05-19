'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { handleErrorApi } from '@/lib/utils'
import { useGetCategoryQuery, useUpdateCategoryMutation } from '@/queries/useCategory'
import { UpdateCategoryBody, UpdateCategoryBodyType } from '@/schemaValidations/category.schema'
import { toast } from 'sonner'
import { useEffect } from 'react'

export default function EditCategory({
  id,
  onCancel
}: {
  id: number
  onCancel: () => void
}) {
  const { data, isLoading } = useGetCategoryQuery({ id, enabled: true })
  const category = data?.payload.data
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid }
  } = useForm<UpdateCategoryBodyType>({
    resolver: zodResolver(UpdateCategoryBody),
    defaultValues: {
      name: category?.name || ''
    }
  })
  
  useEffect(() => {
    if (category) {
      reset({
        name: category.name
      })
    }
  }, [category, reset])
  
  const { mutateAsync, isPending } = useUpdateCategoryMutation()
  
  const onSubmit = async (data: UpdateCategoryBodyType) => {
    try {
      const result = await mutateAsync({ ...data, id })
      toast('', { description: result.payload.message })
      onCancel()
    } catch (error) {
      handleErrorApi({ error })
    }
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa danh mục</DialogTitle>
          <DialogDescription>
            Chỉnh sửa thông tin danh mục
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="text-center py-4">Đang tải dữ liệu...</div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='grid gap-4 py-4'>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='name' className='text-right'>
                  Tên danh mục
                </Label>
                <div className='col-span-3 space-y-1'>
                  <Input
                    id='name'
                    placeholder='Nhập tên danh mục'
                    {...register('name')}
                  />
                  {errors.name && (
                    <div className='text-sm text-red-500'>
                      {errors.name.message}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={onCancel}>
                Hủy
              </Button>
              <Button type='submit' disabled={!isDirty || !isValid || isPending}>
                {isPending ? 'Đang lưu...' : 'Lưu'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
