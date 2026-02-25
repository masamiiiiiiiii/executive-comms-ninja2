"use client";

import { useState } from "react";
import { TimelineChart } from "@/components/timeline-chart";
import { TimelineStoryboard } from "@/components/timeline-storyboard";
import { VideoPlayer } from "@/components/video-player";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, X, PlayCircle, BarChart2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TimelineSectionProps {
    analysis: any;
    results: any;
}

export function TimelineSection({ analysis, results }: TimelineSectionProps) {
    const [evidenceTimestamp, setEvidenceTimestamp] = useState<string | null>(null);

    const handlePlayEvidence = (timestamp: string) => {
        setEvidenceTimestamp(timestamp);
        // In a real implementation with a ref, we would seek automatically here.
        // For now, the user sees the video appear.
    };

    return (
        <div className="space-y-12">

            {/* 1. Emotional Arc Chart */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase text-slate-500 tracking-widest flex items-center gap-2">
                        <BarChart2 className="h-4 w-4" /> Emotional Seismograph
                    </h3>
                    <Badge variant="outline" className="text-slate-400 font-normal border-slate-200">Confidence vs. Engagement</Badge>
                </div>
                <TimelineChart data={results.timeline_analysis || []} />
            </div>

            {/* 2. Interactive Storyboard */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase text-slate-500 tracking-widest flex items-center gap-2">
                    <Activity className="h-4 w-4" /> Key Moments Storyboard
                </h3>
                <TimelineStoryboard
                    events={results.timeline_analysis || []}
                    onPlayTimestamp={handlePlayEvidence}
                />
            </div>
        </div>
    );
}
