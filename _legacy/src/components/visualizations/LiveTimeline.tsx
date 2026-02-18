import React, { useRef, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";

interface TimelineProps {
    duration: number;
    currentTime: number;
    onSeek: (time: number) => void;
    events?: { time: number; label: string; type: 'positive' | 'negative' | 'neutral' }[];
}

const LiveTimeline: React.FC<TimelineProps> = ({ duration, currentTime, onSeek, events = [] }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to keep playhead in view
    useEffect(() => {
        if (scrollContainerRef.current) {
            const pixelsPerSecond = 10; // Zoom level
            const currentScroll = scrollContainerRef.current.scrollLeft;
            const targetScroll = currentTime * pixelsPerSecond - (scrollContainerRef.current.clientWidth / 2);

            // Only scroll if playhead is moving out of center significantly to avoid jitter
            if (Math.abs(currentScroll - targetScroll) > 50) {
                scrollContainerRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
            }
        }
    }, [currentTime]);

    const pixelsPerSecond = 10;
    const totalWidth = Math.max(duration * pixelsPerSecond, 100); // Ensure minimal width

    return (
        <Card className="p-4 bg-card/80 backdrop-blur border-t border-primary/10 rounded-none fixed bottom-0 left-0 right-0 z-50 md:relative md:rounded-xl md:mb-6 md:z-0 shadow-[0_-5px_20px_rgba(0,0,0,0.1)]">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-1">
                    Analysis Timeline
                    <Badge variant="custom" className="ml-2 text-[10px] h-5 bg-primary/10 text-primary border-0">
                        LIVE SYNC
                    </Badge>
                </h3>
                <span className="text-xs font-mono text-muted-foreground">
                    {formatTime(currentTime)} / {formatTime(duration)}
                </span>
            </div>

            <div
                className="relative h-24 overflow-x-auto overflow-y-hidden custom-scrollbar bg-secondary/10 rounded-lg border border-border"
                ref={scrollContainerRef}
            >
                <div
                    className="relative h-full"
                    style={{ width: `${totalWidth}px` }}
                    onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const clickX = e.clientX - rect.left + scrollContainerRef.current!.scrollLeft;
                        const newTime = clickX / pixelsPerSecond;
                        onSeek(Math.min(Math.max(0, newTime), duration));
                    }}
                >
                    {/* Time markers */}
                    {Array.from({ length: Math.ceil(duration / 10) }).map((_, i) => (
                        <div
                            key={i}
                            className="absolute top-0 bottom-0 border-l border-muted-foreground/10 text-[10px] text-muted-foreground pl-1 pt-1 pointer-events-none"
                            style={{ left: `${i * 10 * pixelsPerSecond}px` }}
                        >
                            {formatTime(i * 10)}
                        </div>
                    ))}

                    {/* Event Markers */}
                    {events.map((event, idx) => (
                        <div
                            key={idx}
                            className={`absolute top-6 w-1 rounded-full h-8 cursor-pointer transition-all hover:h-12 hover:-top-2 group z-10 ${event.type === 'positive' ? 'bg-green-500' : event.type === 'negative' ? 'bg-red-500' : 'bg-yellow-500'
                                }`}
                            style={{ left: `${event.time * pixelsPerSecond}px` }}
                            title={event.label}
                            onClick={(e) => {
                                e.stopPropagation();
                                onSeek(event.time);
                            }}
                        >
                            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-20 pointer-events-none">
                                {event.label}
                            </div>
                        </div>
                    ))}

                    {/* Playhead */}
                    <div
                        className="absolute top-0 bottom-0 w-[2px] bg-primary z-20 pointer-events-none transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                        style={{ left: `${currentTime * pixelsPerSecond}px` }}
                    >
                        <div className="absolute -top-1 -left-[5px] w-3 h-3 bg-primary rounded-full" />
                    </div>
                </div>
            </div>
        </Card>
    );
};

const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
};

export default LiveTimeline;
