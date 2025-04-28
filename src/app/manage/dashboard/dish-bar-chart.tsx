"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

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
// const chartData = [
//   { month: "January", desktop: 186, mobile: 80 },
//   { month: "February", desktop: 305, mobile: 200 },
//   { month: "March", desktop: 237, mobile: 120 },
//   { month: "April", desktop: 73, mobile: 190 },
//   { month: "May", desktop: 209, mobile: 130 },
//   { month: "June", desktop: 214, mobile: 140 },
// ]

const chartConfig = {
  line1: {
    label: "Line1",
    color: "hsl(var(--chart-1))",
  },
  line2: {
    label: "Line2",
    color: "hsl(var(--chart-2))",
  },
  line3: {
    label: "Line3",
    color: "hsl(var(--chart-3))",
  },
  line4: {
    label: "Line4",
    color: "hsl(var(--chart-4))",
  },
  line5: {
    label: "Line5",
    color: "hsl(var(--chart-5))",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig

const colors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

export function DishBarChart({chartData} :{
  chartData: Pick<DashboardIndicatorResType["data"]["dishIndicator"][0], 'name' | 'successOrders'>[]
}) {
  const chartDataColors = chartData.map((data, index) => {
    return {
      ...data,
      fill: colors[index] ?? colors[colors.length - 1]
    }
  })
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - Custom Label</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartDataColors}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="successOrders" type="number"  />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="successOrders"
              layout="vertical"
              // fill=")"
              name={'Số lượng'}
              radius={4}
            >
              <LabelList
                dataKey="name"
                position="insideLeft"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
              <LabelList
                dataKey="successOrders"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
