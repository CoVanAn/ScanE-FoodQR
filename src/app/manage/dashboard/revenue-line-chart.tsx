"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { DashboardIndicatorResType } from "@/schemaValidations/indicator.schema"
import { format, parse } from "date-fns"
// const chartData = [
//   { month: "January", desktop: 186 },
//   { month: "February", desktop: 305 },
//   { month: "March", desktop: 237 },
//   { month: "April", desktop: 73 },
//   { month: "May", desktop: 209 },
//   { month: "June", desktop: 214 },
// ]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function RevenueLineChart({ chartData }: {
  chartData: DashboardIndicatorResType["data"]["revenueByDate"]
}) {
  const data = chartData.map((item) => ({
    ...item,
    date: format(new Date(item.date), "dd/MM/yyyy"),

  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Doanh thu</CardTitle>
        <CardDescription>
          {/* Showing total visitors for the last 6 months */}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                if (chartData.length < 8) {
                  return value
                }
                if (chartData.length < 33) {
                  const date = parse(value, "dd/MM/yyyy", new Date())
                  return format(date, 'dd')
                }
                return value
              }

              } />
            <ChartTooltip

              cursor={false}
              content={<ChartTooltipContent indicator="dot" hidden/>}
            />
            <Area
              dataKey="revenue"
              type="linear"
              name={"VND .."}
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              {/* Trending up by 5.2% this month <TrendingUp className="h-4 w-4" /> */}
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {/* January - June 2024 */}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
