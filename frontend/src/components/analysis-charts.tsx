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
    benchmarkData?: Record<string, number>;
}

export function AnalysisCharts({ data, benchmarkData }: AnalysisChartsProps) {
    if (!data) return <div className="text-sm text-muted-foreground">No metrics available.</div>;

    // Transform data for Recharts
    // e.g., { confidence: 80, clarity: 90 } -> [{ subject: 'Confidence', A: 80, B: 90, fullMark: 100 }, ...]
    const subjects = Object.keys(data);
    const chartData = subjects.map((key) => ({
        subject: key.charAt(0).toUpperCase() + key.slice(1),
        A: data[key],
        B: benchmarkData ? (benchmarkData[key] || 0) : undefined,
        fullMark: 100,
    }));

    const chartConfig = {
        score: {
            label: "Your Score",
            color: "hsl(var(--primary))",
        },
        benchmark: {
            label: "Industry Standard",
            color: "hsl(var(--muted-foreground))",
        }
    }

    return (
        <div className="h-[300px] w-full">
            <ChartContainer config={chartConfig} className="h-full w-full">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
                    <PolarGrid className="text-muted/20" stroke="currentColor" />
                    <PolarAngleAxis
                        dataKey="subject"
                        className="text-[10px] font-bold fill-muted-foreground uppercase tracking-widest"
                        tick={{ dy: 4 }}
                    />

                    {/* Benchmark Radar (Background) */}
                    {benchmarkData && (
                        <Radar
                            name="Industry Standard"
                            dataKey="B"
                            stroke="hsl(var(--muted-foreground))"
                            fill="hsl(var(--muted-foreground))"
                            fillOpacity={0.1}
                            strokeDasharray="4 4"
                        />
                    )}

                    {/* User Radar (Foreground) */}
                    <Radar
                        name="Your Score"
                        dataKey="A"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.3}
                        className="drop-shadow-sm"
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                </RadarChart>
            </ChartContainer>
        </div>
    );
}
