'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PlusCircleIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { handleErrorApi } from '@/lib/utils'
import { useAddCategoryMutation } from '@/queries/useCategory'
import { CreateCategoryBody, CreateCategoryBodyType } from '@/schemaValidations/category.schema'
import { toast } from 'sonner'
import { useState } from 'react'

export default function AddCategory() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid }
  } = useForm<CreateCategoryBodyType>({
    resolver: zodResolver(CreateCategoryBody)
  })
  const { mutateAsync, isPending } = useAddCategoryMutation()
  
  const onSubmit = async (data: CreateCategoryBodyType) => {
    try {
      const result = await mutateAsync(data)
      toast('', { description: result.payload.message })
      reset()
      setIsDialogOpen(false)
    } catch (error) {
      handleErrorApi({ error })
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
      reset()
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size='sm'>
          <PlusCircleIcon className='mr-2 h-4 w-4' />
          Thêm danh mục
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px] bg-white dark:bg-background'>
        <DialogHeader>
          <DialogTitle>Thêm danh mục</DialogTitle>
          <DialogDescription>
            Thêm danh mục mới cho các món ăn
          </DialogDescription>
        </DialogHeader>
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
          <DialogFooter>
            <Button type='submit' disabled={!isDirty || !isValid || isPending}>
              {isPending ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
