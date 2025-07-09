'use client'

import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import DOMPurify from 'dompurify'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { createContext, useContext, useEffect, useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import {
  formatCurrency,
  getVietnameseDishStatus,
  handleErrorApi
} from '@/lib/utils'
import { useSearchParams } from 'next/navigation'
import AutoPagination from '@/components/auto-pagination'
import { DishListResType } from '@/schemaValidations/dish.schema'
import EditDish from './edit-dish'
import AddDish from './add-dish'
import { useDeleteDishMutation, useDishListQuery } from '@/queries/useDish'
import { useCategoryListQuery } from '@/queries/useCategory'
import { toast } from 'sonner'

type DishItem = DishListResType['data'][0]

const DishTableContext = createContext<{
  setDishIdEdit: (value: number) => void
  dishIdEdit: number | undefined
  dishDelete: DishItem | null
  setDishDelete: (value: DishItem | null) => void
}>({
  setDishIdEdit: (value: number | undefined) => { },
  dishIdEdit: undefined,
  dishDelete: null,
  setDishDelete: (value: DishItem | null) => { }
})

export const columns: ColumnDef<DishItem>[] = [
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'image',
    header: 'Ảnh',
    cell: ({ row }) => (
      <div>
        <Avatar className='aspect-square w-[100px] h-[100px] rounded-md object-cover'>
          <AvatarImage src={row.getValue('image')} />
          <AvatarFallback className='rounded-none'>
            {row.original.name}
          </AvatarFallback>
        </Avatar>
      </div>
    )
  },
  {
    accessorKey: 'name',
    header: 'Tên',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('name')}</div>
  },
  {
    accessorKey: 'price',
    header: 'Giá cả',
    cell: ({ row }) => (
      <div className='capitalize'>{formatCurrency(row.getValue('price'))}</div>
    )
  },
  {
    accessorKey: 'category',
    header: 'Danh mục',
    cell: ({ row }) => {
      const category = row.original.category
      return <div>{category ? category.name : 'Không có danh mục'}</div>
    }
  },
  {
    accessorKey: 'description',
    header: 'Mô tả',
    cell: ({ row }) => {
      const description = row.getValue('description') as string
      const truncatedDescription = description && description.length > 25 
        ? description.substring(0, 25) + '......' 
        : description
      
      return (
        <div
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(truncatedDescription || '')
          }}
          className='whitespace-pre-line'
          title={description} // Hiển thị mô tả đầy đủ khi hover
        />
      )
    }
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ row }) => (
      <div>{getVietnameseDishStatus(row.getValue('status'))}</div>
    )
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setDishIdEdit, setDishDelete } = useContext(DishTableContext)
      const openEditDish = () => {
        requestAnimationFrame(() => {
          setDishIdEdit(row.original.id)

        })
      }

      const openDeleteDish = () => {
        requestAnimationFrame(() => {
          setDishDelete(row.original)
        })
      }
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <DotsHorizontalIcon className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={openEditDish}>Sửa</DropdownMenuItem>
            <DropdownMenuItem onClick={openDeleteDish}>Xóa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]

function AlertDialogDeleteDish({
  dishDelete,
  setDishDelete
}: {
  dishDelete: DishItem | null
  setDishDelete: (value: DishItem | null) => void
}) {
  const { mutateAsync } = useDeleteDishMutation()
  const deleteDish = async () => {
    if (dishDelete) {
      try {
        const result = await mutateAsync(dishDelete.id)
        setDishDelete(null)
        toast("", {
          description: result.payload.message
        })
      } catch (error) {
        handleErrorApi({
          error
        })
      }
    }
  }
  return (
    <AlertDialog
      open={Boolean(dishDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setDishDelete(null)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa món ăn?</AlertDialogTitle>
          <AlertDialogDescription>
            Món{' '}
            <span className='bg-foreground text-primary-foreground rounded px-1'>
              {dishDelete?.name}
            </span>{' '}
            sẽ bị xóa vĩnh viễn
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteDish}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
// Số lượng item trên 1 trang
const PAGE_SIZE = 5
export default function DishTable() {
  const searchParam = useSearchParams()
  const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1
  const pageIndex = page - 1
  const [dishIdEdit, setDishIdEdit] = useState<number | undefined>()
  const [dishDelete, setDishDelete] = useState<DishItem | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Fetch categories for filtering
  const categoryListQuery = useCategoryListQuery()

  const categories = categoryListQuery.data?.payload.data ?? []

  // Fetch dishes with optional category filter
  const dishListQuery = useDishListQuery(selectedCategory ? Number(selectedCategory) : null)
  const data = dishListQuery.data?.payload.data ?? []
  const isLoading = dishListQuery.isLoading
  
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [pagination, setPagination] = useState({
    pageIndex, // Gía trị mặc định ban đầu, không có ý nghĩa khi data được fetch bất đồng bộ
    pageSize: PAGE_SIZE //default page size
  })

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination
    }
  })

  useEffect(() => {
    table.setPagination({
      pageIndex,
      pageSize: PAGE_SIZE
    })
  }, [table, pageIndex])

  // Reset về trang đầu khi thay đổi category filter
  useEffect(() => {
    if (selectedCategory !== null) {
      table.setPageIndex(0)
      // Reset URL parameter
      const url = new URL(window.location.href)
      url.searchParams.delete('page')
      window.history.replaceState({}, '', url)
    }
  }, [selectedCategory, table])

  // Reset về trang đầu khi filter name thay đổi
  useEffect(() => {
    const nameFilter = table.getColumn('name')?.getFilterValue() as string
    if (nameFilter) {
      table.setPageIndex(0)
      // Reset URL parameter
      const url = new URL(window.location.href)
      url.searchParams.delete('page')
      window.history.replaceState({}, '', url)
    }
  }, [table.getColumn('name')?.getFilterValue(), table])

  return (
    <DishTableContext.Provider
      value={{ dishIdEdit, setDishIdEdit, dishDelete, setDishDelete }} >
      <div className='w-full'>
        <EditDish id={dishIdEdit} setId={setDishIdEdit} />
        <AlertDialogDeleteDish
          dishDelete={dishDelete}
          setDishDelete={setDishDelete}
        />
        <div className='flex flex-wrap items-center gap-4 py-4'>
          <div>
            <label className="text-sm font-medium mb-1 block">Tên món ăn</label>
            <Input
              placeholder='Lọc tên'
              value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
              onChange={(event) =>
                table.getColumn('name')?.setFilterValue(event.target.value)
              }
              className='max-w-sm'
              aria-label="Lọc theo tên món ăn"
            />
          </div>

          <div className='w-[200px]'>
            <label className="text-sm font-medium mb-1 block">Danh mục</label>
            <Select
              value={selectedCategory || ''}
              onValueChange={(value) => {
                setSelectedCategory(value === '' ? null : value);
              }}
              disabled={categoryListQuery.isLoading}    >
              <SelectTrigger>
                <SelectValue placeholder="Lọc theo danh mục" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={String(category.id)}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>

            </Select>
            {categoryListQuery.isLoading && (
              <p className="text-xs text-muted-foreground mt-1">Đang tải danh mục...</p>
            )}

          </div>
          <div>
            <br/>
            {/* <Select
              value={table.getColumn('status')?.getFilterValue() as string || ''}
              onValueChange={(value) => {
                table.getColumn('status')?.setFilterValue(value)
              }}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder='Lọc theo trạng thái' />
              </SelectTrigger>
              <SelectContent>
                {data.map((dish) => (
                  <SelectItem key={dish.id} value={String(dish.status)}>
                    {getVietnameseDishStatus(dish.status)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select> */}
            <Button
              variant="outline"
              onClick={() => {
                // Reset name filter
                table.getColumn('name')?.setFilterValue('');
                // Reset category filter
                setSelectedCategory(null);
                // Reset pagination
                table.setPageIndex(0);
                // Reset URL parameter
                const url = new URL(window.location.href)
                url.searchParams.delete('page')
                window.history.replaceState({}, '', url)
              }}
              disabled={
                !selectedCategory &&
                !((table.getColumn('name')?.getFilterValue() as string) ?? '')
              }
            >
              Bỏ lọc
            </Button>
          </div>

          <div className='ml-auto flex items-center gap-2'>
            <AddDish />
          </div>
        </div>
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className='h-24 text-center'
                  >
                    Đang tải...
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className='h-24 text-center'
                  >
                    {selectedCategory ? 'Không tìm thấy món ăn trong danh mục này.' : 'Không có kết quả nào.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className='flex items-center justify-end space-x-2 py-4'>
          <div className='text-xs text-muted-foreground py-4 flex-1 '>
            Hiển thị{' '}
            <strong>{table.getPaginationRowModel().rows.length}</strong> trong{' '}
            <strong>{data.length}</strong> kết quả
          </div>
          <div>
            <AutoPagination
              page={table.getState().pagination.pageIndex + 1}
              pageSize={table.getPageCount()}
              pathname='/manage/dishes'
              isLink={false}
              onClick={(pageNumber) => {
                table.setPageIndex(pageNumber - 1)
              }}
            />
          </div>
        </div>
      </div>
    </DishTableContext.Provider>
  )
}
