// @ts-nocheck
"use client";

import dynamic from "next/dynamic";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RefreshCw } from "lucide-react";

// Using lazy loading for client-side only component
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

interface VideoPlayerProps {
    url: string;
    timeline?: any[];
    initialTimestamp?: string | null;
}

export function VideoPlayer({ url, timeline, initialTimestamp }: VideoPlayerProps) {
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const playerRef = useRef<any>(null);

    const hasSeeked = useRef(false);

    const parseTime = (timeStr: string) => {
        if (!timeStr) return 0;
        const parts = timeStr.toString().split(":");
        if (parts.length < 2) return 0;
        return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    };

    const handleReady = () => {
        if (initialTimestamp && playerRef.current && !hasSeeked.current) {
            const seconds = parseTime(initialTimestamp);
            if (seconds > 0) {
                setPlaying(true);
                setTimeout(() => {
                    if (playerRef.current) {
                        playerRef.current.seekTo(seconds, "seconds");
                        hasSeeked.current = true;
                    }
                }, 500);
            }
        }
    };

    const handleSeek = (timeStr: any) => {
        const seconds = parseTime(timeStr);
        if (playerRef.current && seconds > 0) {
            playerRef.current.seekTo(seconds, "seconds");
            setPlaying(true);
        }
    };

    return (
        <div className="space-y-4">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-lg border border-border/50">
                <ReactPlayer
                    ref={playerRef}
                    url={url}
                    width="100%"
                    height="100%"
                    playing={playing}
                    controls={true}
                    onReady={handleReady}
                    onProgress={(state: any) => setProgress(state.playedSeconds)}
                />
            </div>

            {timeline && timeline.length > 0 && (
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Key Moments</h3>
                    <div className="flex flex-wrap gap-2">
                        {timeline.map((item: any, index: number) => (
                            <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() => handleSeek(item.timestamp || item.time)}
                                className="text-xs border-dashed border-border hover:border-primary/50"
                            >
                                {item.timestamp || item.time} - {item.event}
                            </Button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
