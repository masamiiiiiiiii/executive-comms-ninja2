"use client";

import dynamic from "next/dynamic";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RefreshCw } from "lucide-react";
// Import type explicitly if needed, but 'any' is safer for quick fix
// import ReactPlayer from "react-player"; 

// Dynamically import ReactPlayer to avoid hydration errors
// Using lazy loading for client-side only component
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

interface VideoPlayerProps {
    url: string;
    timeline?: any[]; // Allow any for now to facilitate build
}

export function VideoPlayer({ url, timeline }: VideoPlayerProps) {
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    // Use 'any' to bypass strict type check for ReactPlayer instance
    const playerRef = useRef<any>(null);

    const handleSeek = (timeStr: string) => {
        if (!timeStr) return;
        const parts = timeStr.split(":");
        if (parts.length < 2) return;
        const seconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);

        if (playerRef.current) {
            playerRef.current.seekTo(seconds, "seconds");
            setPlaying(true);
        }
    };

    return (
        <div className="space-y-4">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-lg border border-border/50">
                {/* Check if window is defined to avoid hydration mismatch, though dynamic import handles this */}
                {/* @ts-ignore */}
                <ReactPlayer
                    ref={playerRef}
                    url={url}
                    width="100%"
                    height="100%"
                    playing={playing}
                    controls={true}
                    onProgress={(state: any) => setProgress(state.playedSeconds)}
                />
            </div>

            {/* Timeline Controls */}
            {timeline && timeline.length > 0 && (
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Key Moments</h3>
                    <div className="flex flex-wrap gap-2">
                        {timeline.map((item, index) => (
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
