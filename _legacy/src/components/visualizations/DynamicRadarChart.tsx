import React, { useMemo } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain } from "lucide-react";

interface DynamicRadarProps {
    currentMetrics: {
        confidence: number;
        enthusiasm: number;
        clarity: number;
        trust: number;
    };
}

const DynamicRadarChart: React.FC<DynamicRadarProps> = ({ currentMetrics }) => {
    const data = useMemo(() => [
        { subject: 'Confidence', A: currentMetrics.confidence, fullMark: 100 },
        { subject: 'Enthusiasm', A: currentMetrics.enthusiasm, fullMark: 100 },
        { subject: 'Clarity', A: currentMetrics.clarity, fullMark: 100 },
        { subject: 'Trust', A: currentMetrics.trust, fullMark: 100 },
    ], [currentMetrics]);

    return (
        <Card className="h-full bg-card/50 backdrop-blur-sm border-primary/10 shadow-lg">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Brain className="h-5 w-5 text-primary" />
                    Real-time Emotion Analysis
                </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                        <PolarGrid stroke="currentColor" strokeOpacity={0.1} />
                        <PolarAngleAxis
                            dataKey="subject"
                            tick={{ fill: 'currentColor', fontSize: 12, opacity: 0.7 }}
                        />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar
                            name="Current State"
                            dataKey="A"
                            stroke="#8884d8"
                            strokeWidth={3}
                            fill="#8884d8"
                            fillOpacity={0.4}
                            isAnimationActive={false} // Disable internal animation for smoother custom updates
                        />
                    </RadarChart>
                </ResponsiveContainer>

                {/* Metric Badges Overlay */}
                <div className="absolute bottom-2 left-2 right-2 flex justify-between gap-1 text-xs">
                    <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
                        Conf: {currentMetrics.confidence}%
                    </Badge>
                    <Badge variant="outline" className="border-accent/20 bg-accent/5 text-accent">
                        Enth: {currentMetrics.enthusiasm}%
                    </Badge>
                </div>
            </CardContent>
        </Card>
    );
};

export default DynamicRadarChart;
