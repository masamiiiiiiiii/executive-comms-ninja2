"use client";

import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    ReferenceDot
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TimelineEvent {
    timestamp: string;
    event: string;
    confidence_score: number;
    engagement_score: number;
    emotion_label?: string;
    insight: string;
}

interface TimelineChartProps {
    data: TimelineEvent[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-lg max-w-[250px]">
                <p className="text-xs font-mono text-slate-500 mb-1">{data.timestamp}</p>
                <p className="font-bold text-sm text-slate-800 mb-1">{data.event}</p>
                <p className="text-xs text-slate-600 mb-2 leading-tight">{data.insight}</p>
                <div className="flex gap-2">
                    <Badge variant="outline" className="text-[10px] text-emerald-600 bg-emerald-50 border-emerald-100">
                        Conf: {data.confidence_score}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] text-blue-600 bg-blue-50 border-blue-100">
                        Eng: {data.engagement_score}
                    </Badge>
                </div>
            </div>
        );
    }
    return null;
};

export function TimelineChart({ data }: TimelineChartProps) {
    if (!data || data.length === 0) return <div className="text-center text-slate-400 py-10">No timeline data available.</div>;

    // Convert timestamps (MM:SS) to roughly linear index or seconds for X-axis if needed, 
    // but for simplicity we can just use the index or treat timestamp as categorical if evenly spaced.
    // For a real chart, parsing "MM:SS" to seconds is better.
    const chartData = data.map(d => {
        const [m, s] = d.timestamp.split(':').map(Number);
        const seconds = m * 60 + s;
        return { ...d, seconds };
    });

    return (
        <Card className="w-full shadow-sm border-border">
            <CardHeader>
                <CardTitle>Emotional Arc & Engagement Flow</CardTitle>
                <CardDescription>Tracking confidence (Emerald) and engagement (Blue) throughout the presentation.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" opacity={0.4} />
                            <XAxis
                                dataKey="timestamp"
                                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                domain={[0, 100]}
                                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                                axisLine={false}
                                tickLine={false}
                                width={30}
                            />
                            <Tooltip content={<CustomTooltip />} />

                            <Line
                                type="monotone"
                                dataKey="confidence_score"
                                stroke="#10b981"
                                strokeWidth={2}
                                dot={{ r: 4, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }}
                                activeDot={{ r: 6 }}
                                animationDuration={1500}
                            />
                            <Line
                                type="monotone"
                                dataKey="engagement_score"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }}
                                activeDot={{ r: 6 }}
                                animationDuration={1500}
                                strokeDasharray="5 5"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
