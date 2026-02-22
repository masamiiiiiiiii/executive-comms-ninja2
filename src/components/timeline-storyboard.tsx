"use client";

import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Pause, ChevronRight, ChevronLeft, Quote, Sparkles } from "lucide-react";
import { EmotionIllustration } from "@/components/v2/emotion-illustrations";

interface TimelineEvent {
    timestamp: string;
    event: string;
    confidence_score: number;
    engagement_score: number;
    emotion_label?: string;
    insight: string;
}

interface TimelineStoryboardProps {
    events: TimelineEvent[];
    onPlayTimestamp: (timestamp: string) => void;
}

export function TimelineStoryboard({ events, onPlayTimestamp }: TimelineStoryboardProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 300;
            if (direction === "left") {
                current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: "smooth" });
            }
        }
    };

    if (!events || events.length === 0) return null;

    return (
        <div className="relative group">
            <div className="absolute top-1/2 left-0 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="outline" size="icon" className="rounded-full shadow-md bg-white/80 backdrop-blur-sm" onClick={() => scroll("left")}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
            </div>
            <div className="absolute top-1/2 right-0 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="outline" size="icon" className="rounded-full shadow-md bg-white/80 backdrop-blur-sm" onClick={() => scroll("right")}>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto pb-6 pt-2 px-1 snap-x snap-mandatory custom-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {events.map((event, index) => (
                    <Card key={index} className="min-w-[280px] max-w-[280px] snap-center flex flex-col border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-emerald-200">
                        <CardHeader className="pb-2 pt-4 px-4 bg-slate-50/50 border-b border-slate-100">
                            <div className="flex justify-between items-center mb-1">
                                <Badge variant="outline" className="font-mono text-[10px] bg-white text-slate-500">
                                    {event.timestamp}
                                </Badge>
                                {event.emotion_label && (
                                    <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">
                                        {event.emotion_label}
                                    </span>
                                )}
                            </div>
                            <CardTitle className="text-sm font-bold text-slate-800 leading-tight line-clamp-1" title={event.event}>
                                {event.event}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 flex-grow flex flex-col gap-3">
                            <div className="w-full flex justify-center mb-1">
                                <div className="w-24 h-24 bg-slate-950 rounded-xl overflow-hidden shadow-inner border border-emerald-900/30 p-2 relative">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1)_0%,transparent_70%)]" />
                                    <EmotionIllustration emotion={event.emotion_label || "Neutral"} />
                                </div>
                            </div>

                            <div className="relative">
                                <Quote className="h-4 w-4 text-slate-200 absolute -top-1 -left-1 transform -scale-x-100" />
                                <p className="text-xs text-slate-600 leading-relaxed pl-3 italic relative z-10">
                                    {event.insight}
                                </p>
                            </div>

                            <div className="mt-auto grid grid-cols-2 gap-2">
                                <div className="bg-slate-50 rounded p-2 text-center">
                                    <p className="text-[9px] text-slate-400 uppercase font-bold">Confidence</p>
                                    <p className="text-sm font-bold text-emerald-600">{event.confidence_score}%</p>
                                </div>
                                <div className="bg-slate-50 rounded p-2 text-center">
                                    <p className="text-[9px] text-slate-400 uppercase font-bold">Engagement</p>
                                    <p className="text-sm font-bold text-blue-500">{event.engagement_score}%</p>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="p-3 pt-0">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full text-xs gap-2 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50"
                                onClick={() => onPlayTimestamp(event.timestamp)}
                            >
                                <Play className="h-3 w-3" /> Verify Evidence
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
