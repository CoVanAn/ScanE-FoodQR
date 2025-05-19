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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import { createContext, useContext, useState } from 'react'
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
import { handleErrorApi } from '@/lib/utils'
import { useSearchParams } from 'next/navigation'
import AutoPagination from '@/components/auto-pagination'
import { CategoryListResType } from '@/schemaValidations/category.schema'
import { useDeleteCategoryMutation, useCategoryListQuery } from '@/queries/useCategory'
import { toast } from 'sonner'
import AddCategory from '@/app/manage/categories/add-category'
import EditCategory from '@/app/manage/categories/edit-category'

type CategoryItem = CategoryListResType['data'][0]

const CategoryTableContext = createContext<{
    setCategoryIdEdit: (value: number) => void
    categoryIdEdit: number | undefined
    categoryDelete: CategoryItem | null
    setCategoryDelete: (value: CategoryItem | null) => void
}>({
    setCategoryIdEdit: (value: number | undefined) => { },
    categoryIdEdit: undefined,
    categoryDelete: null,
    setCategoryDelete: (value: CategoryItem | null) => { }
})

export const columns: ColumnDef<CategoryItem>[] = [
    {
        accessorKey: 'id',
        header: 'ID'
    },
    {
        accessorKey: 'name',
        header: 'Tên danh mục',
        cell: ({ row }) => <div className='font-medium'>{row.getValue('name')}</div>
    },
    {
        accessorKey: '_count.dishes',
        header: 'Số lượng món',
        cell: ({ row }) => {
            const count = row.original._count?.dishes || 0
            return <div>{count}</div>
        }
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: function Actions({ row }) {
            const { setCategoryIdEdit, setCategoryDelete } = useContext(CategoryTableContext)

            const openEditCategory = () => {
                requestAnimationFrame(() => {
                    setCategoryIdEdit(row.original.id)
                })
            }

            const openDeleteCategory = () => {
                requestAnimationFrame(() => {
                    setCategoryDelete(row.original)
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
                        <DropdownMenuItem onClick={openEditCategory}>Sửa</DropdownMenuItem>
                        <DropdownMenuItem onClick={openDeleteCategory}>Xóa</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }
]

function AlertDialogDeleteCategory({
    categoryDelete,
    setCategoryDelete
}: {
    categoryDelete: CategoryItem | null
    setCategoryDelete: (value: CategoryItem | null) => void
}) {
    const { mutateAsync } = useDeleteCategoryMutation()

    const deleteCategory = async () => {
        if (categoryDelete) {
            try {
                const result = await mutateAsync(categoryDelete.id)
                setCategoryDelete(null)
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
            open={Boolean(categoryDelete)}
            onOpenChange={(value) => {
                if (!value) {
                    setCategoryDelete(null)
                }
            }}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Xóa danh mục?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Danh mục{' '}
                        <span className='bg-foreground text-primary-foreground rounded px-1'>
                            {categoryDelete?.name}
                        </span>{' '}
                        sẽ bị xóa vĩnh viễn.
                        {(categoryDelete?._count?.dishes || 0) > 0 && (
                            <div className="mt-2 text-red-500">
                                Lưu ý: Danh mục này đang có {categoryDelete?._count?.dishes} món ăn.
                                Khi xóa danh mục, các món ăn thuộc danh mục này sẽ không còn thuộc danh mục nào.
                            </div>
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault()
                            deleteCategory()
                        }}
                        className='bg-destructive text-destructive-foreground'
                    >
                        Xác nhận
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default function CategoryTable() {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const searchParams = useSearchParams()

    // State cho thao tác với category
    const [categoryIdEdit, setCategoryIdEdit] = useState<number>()
    const [categoryDelete, setCategoryDelete] = useState<CategoryItem | null>(null)

    const { data } = useCategoryListQuery()
    const categories = data?.payload.data || []

    const table = useReactTable({
        data: categories,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection
        }
    })

    return (
        <CategoryTableContext.Provider
            value={{
                categoryIdEdit,
                setCategoryIdEdit,
                categoryDelete,
                setCategoryDelete
            }}
        >
            <div className='w-full'>
                <div className='flex items-center justify-between py-4'>
                    <Input
                        placeholder='Tìm kiếm danh mục...'
                        value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
                        onChange={(event) =>
                            table.getColumn('name')?.setFilterValue(event.target.value)
                        }
                        className='max-w-sm'
                    />
                    <div className='flex gap-2'>
                        <AddCategory />
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
                            {table.getRowModel().rows?.length ? (
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
                                        Không có dữ liệu
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className='flex items-center justify-end py-4'>
                    <AutoPagination
                        page={table.getState().pagination.pageIndex + 1}
                        pageSize={table.getPageCount()}
                        pathname='/manage/categories'
                    />
                </div>
            </div>
            {categoryIdEdit !== undefined && (
                <EditCategory
                    id={categoryIdEdit}
                    onCancel={() => setCategoryIdEdit(undefined)}
                />
            )}
            {categoryDelete && (
                <AlertDialogDeleteCategory
                    categoryDelete={categoryDelete}
                    setCategoryDelete={setCategoryDelete}
                />
            )}
        </CategoryTableContext.Provider>
    )
}
