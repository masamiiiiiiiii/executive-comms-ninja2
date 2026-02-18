"use client";

import {
    PolarAngleAxis,
    PolarGrid,
    Radar,
    RadarChart,
    ResponsiveContainer,
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface AnalysisChartsProps {
    data: Record<string, number>;
}

export function AnalysisCharts({ data }: AnalysisChartsProps) {
    if (!data) return <div className="text-sm text-muted-foreground">No metrics available.</div>;

    // Transform data for Recharts
    // e.g., { confidence: 80, clarity: 90 } -> [{ subject: 'confidence', A: 80, fullMark: 100 }, ...]
    const chartData = Object.keys(data).map((key) => ({
        subject: key.charAt(0).toUpperCase() + key.slice(1),
        A: data[key],
        fullMark: 100,
    }));

    const chartConfig = {
        score: {
            label: "Score",
            color: "hsl(var(--primary))",
        }
    }

    return (
        <div className="h-[250px] w-full">
            <ChartContainer config={chartConfig} className="h-full w-full">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                    <PolarGrid className="text-muted/20" />
                    <PolarAngleAxis dataKey="subject" className="text-xs font-bold fill-muted-foreground" />
                    <Radar
                        name="Score"
                        dataKey="A"
                        stroke="var(--color-score)"
                        fill="var(--color-score)"
                        fillOpacity={0.3}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                </RadarChart>
            </ChartContainer>
        </div>
    );
}
