"use client";

import React, { useState, useRef } from "react";
import ReactPlayer from "react-player";
import { Button } from "@/components/ui/button";
import { Play, Pause, AlertCircle, CheckCircle2 } from "lucide-react";

interface TimelineEvent {
    time: string; // "MM:SS"
    event: string;
    impact: "positive" | "negative" | "neutral";
}

interface VideoPlayerProps {
    url: string;
    timeline: TimelineEvent[];
}

export function VideoPlayer({ url, timeline }: VideoPlayerProps) {
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const playerRef = useRef<ReactPlayer>(null);

    const handleSeek = (timeStr: string) => {
        const parts = timeStr.split(":");
        const seconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
        playerRef.current?.seekTo(seconds, "seconds");
        setPlaying(true);
    };

    return (
        <div className="flex flex-col h-full bg-black">
            <div className="relative flex-1 aspect-video">
                <ReactPlayer
                    ref={playerRef}
                    url={url}
                    width="100%"
                    height="100%"
                    playing={playing}
                    controls={true}
                    onProgress={(state) => setProgress(state.playedSeconds)}
                />
            </div>

            {/* Interactive Timeline Controls */}
            {timeline.length > 0 && (
                <div className="p-4 bg-card/90 border-t border-border overflow-x-auto">
                    <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-3">Key Moments</h3>
                    <div className="flex gap-2">
                        {timeline.map((item, idx) => (
                            <Button
                                key={idx}
                                variant="outline"
                                size="sm"
                                className={`text-xs h-auto py-2 flex flex-col items-start gap-1 min-w-[140px] ${item.impact === 'positive' ? 'border-green-500/30 hover:bg-green-500/10' :
                                    item.impact === 'negative' ? 'border-red-500/30 hover:bg-red-500/10' :
                                        'border-border'
                                    }`}
                                onClick={() => handleSeek(item.time)}
                            >
                                <div className="flex items-center gap-1.5 w-full">
                                    <span className="font-mono opacity-70">{item.time}</span>
                                    {item.impact === 'positive' ? <CheckCircle2 className="h-3 w-3 text-green-500" /> :
                                        item.impact === 'negative' ? <AlertCircle className="h-3 w-3 text-red-500" /> : null}
                                </div>
                                <span className="truncate w-full text-left" title={item.event}>{item.event}</span>
                            </Button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
