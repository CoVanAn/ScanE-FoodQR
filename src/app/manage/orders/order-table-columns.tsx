'use client'

import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { GetOrdersResType } from '@/schemaValidations/order.schema'
import { useContext } from 'react'
import {
  formatCurrency,
  formatDateTimeToLocaleString,
  getVietnameseOrderStatus,
  getVietnamesePaymentStatus,
  simpleMatchText
} from '@/lib/utils'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { OrderStatus, OrderStatusValues, PaymentStatus, PaymentStatusValues } from '@/constants/type'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { OrderTableContext } from '@/app/manage/orders/order-table'
import OrderGuestDetail from '@/app/manage/orders/order-guest-detail'

type OrderItem = GetOrdersResType['data'][0]
const orderTableColumns: ColumnDef<OrderItem>[] = [
  {
    accessorKey: 'tableNumber',
    header: 'Bàn',
    cell: ({ row }) => <div>{row.getValue('tableNumber')}</div>,
    filterFn: (row, columnId, filterValue: string) => {
      if (filterValue === undefined) return true
      return simpleMatchText(
        String(row.getValue(columnId)),
        String(filterValue)
      )
    }
  },
  {
    id: 'guestName',
    header: 'Khách hàng',
    cell: function Cell({ row }) {
      const { orderObjectByGuestId } = useContext(OrderTableContext)
      const guest = row.original.guest
      return (
        <div>
          {!guest && (
            <div>
              <span>Đã bị xóa</span>
            </div>
          )}
          {guest && (
            <Popover>
              <PopoverTrigger>
                <div>
                  <span>{guest.name}</span>
                  <span className='font-semibold'>(#{guest.id})</span>
                </div>
              </PopoverTrigger>
              <PopoverContent className='w-[320px] sm:w-[440px]'>
                <OrderGuestDetail
                  guest={guest}
                  orders={orderObjectByGuestId[guest.id]}
                />
              </PopoverContent>
            </Popover>
          )}
        </div>
      )
    },
    filterFn: (row, columnId, filterValue: string) => {
      if (filterValue === undefined) return true
      return simpleMatchText(
        row.original.guest?.name ?? 'Đã bị xóa',
        String(filterValue)
      )
    }
  },
  {
    id: 'dishName',
    header: 'Món ăn',
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        <Popover>
          <PopoverTrigger asChild>
            <Image
              src={row.original.dishSnapshot.image}
              alt={row.original.dishSnapshot.name}
              width={50}
              height={50}
              className='rounded-md object-cover w-[50px] h-[50px] cursor-pointer'
            />
          </PopoverTrigger>
          <PopoverContent>
            <div className='flex flex-wrap gap-2'>
              <Image
                src={row.original.dishSnapshot.image}
                alt={row.original.dishSnapshot.name}
                width={100}
                height={100}
                className='rounded-md object-cover w-[100px] h-[100px]'
              />
              <div className='space-y-1 text-sm'>
                <h3 className='font-semibold'>
                  {row.original.dishSnapshot.name}
                </h3>
                <div className='italic'>
                  {formatCurrency(row.original.dishSnapshot.price)}
                </div>
                <div>{row.original.dishSnapshot.description}</div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <div className='space-y-2'>
          <div className='flex items-center gap-2'>
            <span>{row.original.dishSnapshot.name}</span>
            <Badge className='px-1' variant={'secondary'}>
              x{row.original.quantity}
            </Badge>
          </div>
          <span className='italic'>
            {formatCurrency(
              row.original.dishSnapshot.price * row.original.quantity
            )}
          </span>
        </div>
      </div>
    )
  }, {
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: function Cell({ row }) {
      const { changeStatus } = useContext(OrderTableContext)
      // const isPaid = row.original.payment === PaymentStatus.Paid;

      const changeOrderStatus = async (
        status: (typeof OrderStatusValues)[number]
      ) => {
        // if (isPaid) return; // Prevent changes if paid

        changeStatus({
          orderId: row.original.id,
          dishId: row.original.dishSnapshot.dishId!,
          status: status,
          quantity: row.original.quantity
        })
      }
      return (
        <Select
          onValueChange={(value: (typeof OrderStatusValues)[number]) => {
            changeOrderStatus(value)
          }}
          defaultValue={OrderStatus.Pending}
          value={row.getValue('status')}
        // disabled={isPaid}
        >
          <SelectTrigger className='w-[140px]'>
            <SelectValue placeholder='Theme' />
          </SelectTrigger>
          <SelectContent>
            {OrderStatusValues.map((status) => (
              <SelectItem key={status} value={status}>
                {getVietnameseOrderStatus(status)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    }
  }, {
    accessorKey: 'payment',
    header: 'Thanh toán',
    cell: function Cell({ row }) {
      const { changePaymentStatus } = useContext(OrderTableContext)
      const isPaid = row.original.payment === PaymentStatus.Paid;

      const changePayment = async (
        payment: (typeof PaymentStatusValues)[number]
      ) => {
        // Allow changing from paid to unpaid, but once paid, no other fields can be edited
        changePaymentStatus({
          orderId: row.original.id,
          dishId: row.original.dishSnapshot.dishId!,
          payment: payment,
          quantity: row.original.quantity
        })
      }
      return (
        <div
        className={`${isPaid ?
         'cursor-not-allowed border-2 border-green-500 w-[160px] rounded-lg' : ''}`}>
          <Select
            onValueChange={(value: (typeof PaymentStatusValues)[number]) => {
              changePayment(value)
            }}
            defaultValue={PaymentStatus.Unpaid}
            value={row.getValue('payment')}
            disabled={isPaid}
          >
            <SelectTrigger className='w-[160px]'>
              <SelectValue placeholder='Thanh toán'/>
            </SelectTrigger>
            <SelectContent >
              {PaymentStatusValues.map((status) => (
                <SelectItem
                  key={status}
                  value={status}
                >
                  {getVietnamesePaymentStatus(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )
    }
  },
  {
    id: 'orderHandlerName',
    header: 'Người xử lý',
    cell: ({ row }) => <div>{row.original.orderHandler?.name ?? ''}</div>
  },
  {
    accessorKey: 'createdAt',
    header: () => <div>Tạo/Cập nhật</div>,
    cell: ({ row }) => (
      <div className='space-y-2 text-sm'>
        <div className='flex items-center space-x-4'>
          {formatDateTimeToLocaleString(row.getValue('createdAt'))}
        </div>
        <div className='flex items-center space-x-4'>
          {formatDateTimeToLocaleString(
            row.original.updatedAt as unknown as string
          )}
        </div>
      </div>
    )
  }, {
    id: 'actions',
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setOrderIdEdit } = useContext(OrderTableContext)
      const isPaid = row.original.payment === PaymentStatus.Paid;

      const openEditOrder = () => {
        if (isPaid) return; // Prevent editing if paid
        requestAnimationFrame(() => {
          setOrderIdEdit(row.original.id)
        })
      }

      return (
        // <DropdownMenu>
        //   <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 p-0' disabled={isPaid}
          onClick={openEditOrder} title='Sửa đơn hàng'>
          <DotsHorizontalIcon className={`h-4 w-4 `} />
        </Button>
        //   </DropdownMenuTrigger>
        //   <DropdownMenuContent align='end'>
        //     {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
        //     {/* <DropdownMenuSeparator /> */}
        //     {isPaid ? (
        //       <DropdownMenuItem disabled className="opacity-60 cursor-not-allowed">
        //         Đã thanh toán không thể sửa
        //       </DropdownMenuItem>
        //     ) : (
        //       <DropdownMenuItem onClick={openEditOrder}>Sửa</DropdownMenuItem>
        //     )}
        //   </DropdownMenuContent>
        // </DropdownMenu>
      )
    }
  }
]

export default orderTableColumns
