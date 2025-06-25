'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RevenueLineChart } from './revenue-line-chart';
import { DishBarChart } from './dish-bar-chart';
import { DollarSign, CircleDollarSign, Users, Table, Sandwich } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { endOfDay, format, startOfDay } from 'date-fns'
import { useState } from 'react';
import { useDashboardIndicator } from '@/queries/useIndicator';

const initFromDate = startOfDay(new Date())
const initToDate = endOfDay(new Date())

export default function DashboardMain() {
    const [fromDate, setFromDate] = useState(initFromDate)
    const [toDate, setToDate] = useState(initToDate)
    const {data} = useDashboardIndicator({
            fromDate,
            toDate
        })
    const revenue = data?.payload.data.revenue ?? 0
    const guestCount = data?.payload.data.guestCount ?? 0
    const orderCount = data?.payload.data.orderCount ?? 0
    const servingTableCount = data?.payload.data.servingTableCount ?? 0
    const revenueByDate = data?.payload.data.revenueByDate ?? []
    const dishIndicator = data?.payload.data.dishIndicator ?? []

    const resetDateFilter = () => {
        setFromDate(initFromDate)
        setToDate(initToDate)
    }
    return (
        <div className='space-y-4'>
            <div className='flex flex-wrap gap-2'>
                <div className='flex items-center'>
                    <span className='mr-2'>Từ</span>
                    <Input
                        type='datetime-local'
                        placeholder='Từ ngày'
                        value={format(fromDate, 'yyyy-MM-dd HH:mm').replace(' ', 'T')}
                        onChange={(event) => setFromDate(new Date(event.target.value))}
                    />
                </div>
                <div className='flex items-center'>
                    <span className='mr-2'>Đến</span>
                    <Input
                        type='datetime-local'
                        placeholder='Đến ngày'
                        value={format(toDate, 'yyyy-MM-dd HH:mm').replace(' ', 'T')}
                        onChange={(event) => setToDate(new Date(event.target.value))}
                    />
                </div>
                <Button className='cursor-pointer' variant={'outline'} onClick={resetDateFilter}>Reset</Button>
            </div>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                <Card>
                    <CardHeader >
                        <CardTitle className='flex items-center justify-center space-x-2'>
                            <span>Tổng doanh thu</span>
                            <CircleDollarSign className='h-5 w-5' />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='text-center'>
                        <div className='text-2xl font-bold'>{formatCurrency(revenue)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className='flex items-center justify-center space-x-2'>
                            <p>Khách hàng</p>
                            <Users className='h-5 w-5' />
                        </CardTitle>

                    </CardHeader>
                    <CardContent className='text-center'>
                        <div className='text-2xl font-bold'>{guestCount}</div>
                        <p>Gọi món</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className='flex items-center justify-center space-x-2'>
                            <p>Đơn hàng</p>
                            <Sandwich />
                        </CardTitle>

                    </CardHeader>
                    <CardContent className='text-center'>
                        <div className='text-2xl font-bold'>{orderCount}</div>
                        <p className='text-xs text-muted-foreground'>Đã thanh toán</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className='flex items-center justify-center space-x-2'>
                            <p>Bàn phục vụ</p>
                            <Table />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='text-center'>
                        <div className='text-2xl font-bold'>{servingTableCount}</div>
                    </CardContent>
                </Card>
            </div>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
                <div className='lg:col-span-4'>
                    <RevenueLineChart chartData={revenueByDate}/>
                </div>
                <div className='lg:col-span-3'>
                    <DishBarChart chartData={dishIndicator}/>
                </div>
            </div>
        </div>
    )
}