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
                    onPlayTimestamp={handlePlayEvidence} // This will trigger the modal
                />
            </div>

            {/* 3. Evidence Verification (Modal) */}
            {evidenceTimestamp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setEvidenceTimestamp(null)}>
                    <div className="bg-white rounded-xl overflow-hidden w-full max-w-4xl shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
                        <div className="absolute top-0 right-0 p-4 z-20">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-white/20 rounded-full h-10 w-10 bg-black/20 backdrop-blur-sm"
                                onClick={() => setEvidenceTimestamp(null)}
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        <div className="bg-slate-950 p-4 flex items-center gap-3 border-b border-emerald-900/30">
                            <PlayCircle className="h-5 w-5 text-emerald-500" />
                            <span className="text-slate-100 font-mono text-sm tracking-wide">
                                Evidence Verification <span className="text-emerald-500">@ {evidenceTimestamp}</span>
                            </span>
                        </div>

                        <div className="aspect-video bg-black relative">
                            {/* The VideoPlayer component will handle auto-seeking on load via initialTimestamp */}
                            <VideoPlayer
                                url={analysis.youtube_url}
                                timeline={results.timeline_analysis || []}
                                initialTimestamp={evidenceTimestamp}
                            />
                        </div>

                        <div className="p-4 bg-slate-50 text-center border-t border-slate-100">
                            <p className="text-xs text-slate-500 font-medium">
                                Jump to <span className="font-mono bg-slate-200 px-1 rounded mx-1 text-slate-700">{evidenceTimestamp}</span> using the timeline controls below the video.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
