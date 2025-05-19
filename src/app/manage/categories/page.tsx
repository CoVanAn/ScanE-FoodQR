import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import CategoryTable from '@/app/manage/categories/category-table'
import { Suspense } from 'react'

export default function CategoriesPage() {
  return (
    <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
      <div className='space-y-2'>
        <Card>
          <CardHeader>
            <CardTitle>Danh mục món ăn</CardTitle>
            <CardDescription>Quản lý danh mục món ăn</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense>
              <CategoryTable />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
