import { Fragment, useState } from 'react'
import { Users } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { OrderStatusIcon, cn, getVietnameseOrderStatus, getVietnamesePaymentStatus } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { OrderStatus, OrderStatusValues, PaymentStatus, PaymentStatusValues } from '@/constants/type'
import { TableListResType } from '@/schemaValidations/table.schema'
import { Badge } from '@/components/ui/badge'
import {
  ServingGuestByTableNumber,
  Statics,
  StatusCountObject
} from '@/app/[locale]/manage/orders/order-table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import OrderGuestDetail from '@/app/[locale]/manage/orders/order-guest-detail'

export default function OrderStatics({
  statics,
  tableList,
  servingGuestByTableNumber
}: {
  statics: Statics
  tableList: TableListResType['data']
  servingGuestByTableNumber: ServingGuestByTableNumber
}) {
  const [selectedTableNumber, setSelectedTableNumber] = useState<number>(0)
  const selectedServingGuest = servingGuestByTableNumber[selectedTableNumber]
  return (
    <Fragment>
      <Dialog
        open={Boolean(selectedTableNumber)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTableNumber(0)
          }
        }}
      >
        <DialogContent className='max-h-8/10 overflow-auto'>
          {selectedServingGuest && (
            <DialogHeader>
              <DialogTitle>
                Khách đang ngồi tại bàn {selectedTableNumber}
              </DialogTitle>
            </DialogHeader>
          )}
          <div>
            {selectedServingGuest &&
              Object.keys(selectedServingGuest).map((guestId, index) => {
                const orders = selectedServingGuest[Number(guestId)]
                return (
                  <div key={guestId}>
                    <OrderGuestDetail
                      guest={orders[0].guest}
                      orders={orders}
                      onPaySuccess={() => {
                        setSelectedTableNumber(0)
                      }}
                    />
                    {index !== Object.keys(selectedServingGuest).length - 1 && (
                      <Separator className='my-5' />
                    )}
                  </div>
                )
              })}
          </div>
        </DialogContent>
      </Dialog>
      <div className='flex justify-start items-stretch gap-4 flex-wrap py-4'>
        {tableList.map((table) => {
          const tableNumber: number = table.number
          const tableStatics: Record<number, StatusCountObject> | undefined =
            statics.table[tableNumber]
          let isEmptyTable = true    
          let countObject: StatusCountObject = {
            Pending: 0,
            Processing: 0,
            Delivered: 0,
            Rejected: 0
          }
          const servingGuestCount = Object.values(
            servingGuestByTableNumber[tableNumber] ?? []
          ).length
          if (tableStatics) {
            for (const guestId in tableStatics) {
              const guestStatics = tableStatics[Number(guestId)]
              if (
                [
                  guestStatics.Pending,
                  guestStatics.Processing,
                  guestStatics.Delivered
                ].some((status) => status !== 0 && status !== undefined)
              ) {
                isEmptyTable = false
              }
              countObject = {
                Pending: countObject.Pending + (guestStatics.Pending ?? 0),
                Processing:
                  countObject.Processing + (guestStatics.Processing ?? 0),
                Delivered:
                  countObject.Delivered + (guestStatics.Delivered ?? 0),
                // Paid: countObject.Paid + (guestStatics.Paid ?? 0),
                Rejected: countObject.Rejected + (guestStatics.Rejected ?? 0)
              }
            }
          }
          return (
            <div
              key={tableNumber}
              className={cn(
                'text-sm flex items-stretch gap-2 border p-2 rounded-md',
                {
                  'bg-secondary': !isEmptyTable,
                  'border-transparent': !isEmptyTable
                }
              )}
              onClick={() => {
                if (!isEmptyTable) setSelectedTableNumber(tableNumber)
              }}
            >
              <div className='flex flex-col items-center justify-center gap-2'>
                <div className='font-semibold text-center text-lg'>
                  {tableNumber}
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className='flex items-center gap-2'>
                        <Users className='h-4 w-4' />
                        <span>{servingGuestCount}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      Đang phục vụ: {servingGuestCount} khách
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Separator
                orientation='vertical'
                className={cn('flex-shrink-0 flex-grow h-auto', {
                  'bg-muted-foreground': !isEmptyTable
                })}
              />
              {isEmptyTable && (
                <div className='flex justify-between items-center text-sm'>
                  Ready
                </div>
              )}
              {!isEmptyTable && (
                <div className='flex flex-col gap-2'>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className='flex gap-2 items-center'>
                          <OrderStatusIcon.Pending className='w-4 h-4' />
                          <span>{countObject[OrderStatus.Pending] ?? 0}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        {getVietnameseOrderStatus(OrderStatus.Pending)}:{' '}
                        {countObject[OrderStatus.Pending] ?? 0} đơn
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger>
                        <div className='flex gap-2 items-center'>
                          <OrderStatusIcon.Processing className='w-4 h-4' />
                          <span>
                            {countObject[OrderStatus.Processing] ?? 0}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        {getVietnameseOrderStatus(OrderStatus.Processing)}:{' '}
                        {countObject[OrderStatus.Processing] ?? 0} đơn
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className='flex gap-2 items-center'>
                          <OrderStatusIcon.Delivered className='w-4 h-4' />
                          <span>{countObject[OrderStatus.Delivered] ?? 0}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        {getVietnameseOrderStatus(OrderStatus.Delivered)}:{' '}
                        {countObject[OrderStatus.Delivered] ?? 0} đơn
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </div>
          )
        })}
      </div>    
      <div className='flex flex-col gap-4 py-4'>
        <div className='flex flex-col gap-1'>
          <div className='text-sm font-medium'>Trạng thái đơn:</div>
          <div className='flex flex-wrap gap-2'>
            {OrderStatusValues.map((status) => (
              <Badge variant='secondary' key={status}>
                {getVietnameseOrderStatus(status)}: {statics.status[status] ?? 0}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className='flex flex-col gap-1'>
          <div className='text-sm font-medium'>Trạng thái thanh toán:</div>
          <div className='flex flex-wrap gap-2'>
            {PaymentStatusValues.map((status) => (
              <Badge 
                variant={status === PaymentStatus.Paid ? 'default' : 'outline'} 
                key={status}
                className={status === PaymentStatus.Paid ? 'bg-green-500 hover:bg-green-600' : ''}
              >
                {getVietnamesePaymentStatus(status)}: {statics.payment?.[status] ?? 0}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Fragment>
  )
}
