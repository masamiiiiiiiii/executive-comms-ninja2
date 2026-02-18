"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

interface SentimentData {
    timestamp: string;
    sentiment: number;
    label: string;
}

interface SentimentChartProps {
    data: SentimentData[];
}

const chartConfig = {
    sentiment: {
        label: "Sentiment Score",
        color: "hsl(var(--primary))",
    },
} satisfies ChartConfig;

export function SentimentChart({ data }: SentimentChartProps) {
    if (!data || data.length === 0) {
        return <div className="text-sm text-muted-foreground">No sentiment data available.</div>;
    }

    return (
        <ChartContainer config={chartConfig}>
            <AreaChart
                accessibilityLayer
                data={data}
                margin={{
                    left: 12,
                    right: 12,
                    top: 12,
                }}
                height={250}
            >
                <CartesianGrid vertical={false} strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis
                    dataKey="timestamp"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 5)}
                    className="text-muted-foreground text-xs"
                />
                <YAxis
                    hide domain={[0, 100]}
                />
                <ChartTooltip
                    cursor={false}
                    content={
                        <ChartTooltipContent
                            indicator="line"
                            formatter={(value, name, item) => (
                                <>
                                    <div className="flex w-full items-center gap-2">
                                        <div className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-sentiment]" />
                                        <span className="font-medium text-foreground">{item.payload.label}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground ml-4">
                                        Score: <span className="font-mono font-medium text-foreground">{value}</span>
                                    </div>
                                </>
                            )}
                        />
                    }
                />
                <defs>
                    <linearGradient id="fillSentiment" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-sentiment)" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="var(--color-sentiment)" stopOpacity={0.1} />
                    </linearGradient>
                </defs>
                <Area
                    dataKey="sentiment"
                    type="monotone" // smooth curve
                    fill="url(#fillSentiment)"
                    fillOpacity={0.4}
                    stroke="var(--color-sentiment)"
                    strokeWidth={2}
                    dot={{
                        r: 4,
                        fillOpacity: 1,
                        strokeWidth: 2,
                        stroke: "var(--background)",
                    }}
                    activeDot={{
                        r: 6,
                        fill: "var(--color-sentiment)",
                        stroke: "var(--background)",
                        strokeWidth: 2
                    }}
                />
            </AreaChart>
        </ChartContainer>
    );
}
