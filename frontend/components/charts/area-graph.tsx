'use client';

import { TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

const chartData = [
  { day: 'Monday', spent: 15.99 },
  { day: 'Tuesday', spent: 22.49 },
  { day: 'Wednesday', spent: 18.79 },
  { day: 'Thursday', spent: 12.50 },
  { day: 'Friday', spent: 25.99 },
  { day: 'Saturday', spent: 30.00 },
  { day: 'Sunday', spent: 20.45 }
];

const chartConfig = {
  spent: {
    label: 'Money Spent',
    color: 'hsl(var(--chart-1))'
  }
} satisfies ChartConfig;

export function AreaGraph() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Money Spent Over the Days</CardTitle>
        <CardDescription>
          Showing total money spent for the last 7 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[310px] w-full"
        >
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `$${value.toFixed(2)}`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="spent"
              type="natural"
              fill="var(--color-spent)"
              fillOpacity={0.4}
              stroke="var(--color-spent)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 12% this week <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Last 7 days
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
