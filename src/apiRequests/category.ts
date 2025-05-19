import http from '@/lib/http'
import {
    CreateCategoryBodyType,
    CategoryListResType,
    CategoryResType,
    UpdateCategoryBodyType
} from '@/schemaValidations/category.schema'

const categoryApiRequest = {
  // Note: Next.js 15 thì mặc định fetch sẽ là { cache: 'no-store' } (dynamic rendering page)
  // Hiện tại next.js 14 mặc định fetch sẽ là { cache: 'force-cache' } nghĩa là cache (static rendering page)
  list: () =>
    http.get<CategoryListResType>('categories', { next: { tags: ['categories'] } }),
  add: (body: CreateCategoryBodyType) => http.post<CategoryResType>('categories', body),
  getCategory: (id: number) => http.get<CategoryResType>(`categories/${id}`),
  updateCategory: (id: number, body: UpdateCategoryBodyType) =>
    http.put<CategoryResType>(`categories/${id}`, body),
  deleteCategory: (id: number) => http.delete<CategoryResType>(`categories/${id}`)
}

export default categoryApiRequest
