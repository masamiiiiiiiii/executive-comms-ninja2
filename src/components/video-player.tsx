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
        if (!timeStr) return;
        const parts = timeStr.split(":");
        if (parts.length < 2) return;
        const seconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
        if (playerRef.current) {
            playerRef.current.seekTo(seconds, "seconds");
        }
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
                <div className="p-4 bg-muted/20 border-t border-border overflow-x-auto">
                    <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-3 tracking-wider">Jump to Key Moment</h3>
                    <div className="flex gap-2 pb-2">
                        {timeline.map((item: any, idx) => (
                            <Button
                                key={idx}
                                variant="outline"
                                size="sm"
                                className={`text-xs h-auto py-2 px-3 flex flex-col items-start gap-1 min-w-[140px] whitespace-normal bg-background/50 backdrop-blur-sm hover:bg-background hover:border-emerald-300 transition-all`}
                                onClick={() => handleSeek(item.timestamp || item.time)}
                            >
                                <div className="flex items-center gap-2 w-full border-b border-border/50 pb-1 mb-1">
                                    <span className="font-mono text-[10px] bg-muted px-1 rounded text-muted-foreground">{item.timestamp || item.time}</span>
                                    {item.emotion_label && <span className="text-[10px] font-bold text-emerald-600 uppercase ml-auto">{item.emotion_label}</span>}
                                </div>
                                <span className="text-[10px] leading-tight text-left text-muted-foreground line-clamp-2 w-full" title={item.event}>{item.event}</span>
                            </Button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
