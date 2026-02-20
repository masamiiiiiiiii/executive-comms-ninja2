"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface VideoPlayerProps {
    url: string;
    timeline?: any[];
}

export function VideoPlayer({ url, timeline }: VideoPlayerProps) {
    // Extract video ID from URL
    const getVideoId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = getVideoId(url);
    const [iframeUrl, setIframeUrl] = useState<string>("");

    useEffect(() => {
        if (videoId) {
            setIframeUrl(`https://www.youtube.com/embed/${videoId}?enablejsapi=1`);
        }
    }, [videoId]);

    const handleSeek = (timeStr: string) => {
        if (!timeStr || !videoId) return;
        const parts = timeStr.split(":");
        if (parts.length < 2) return;
        const seconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);

        // Update iframe src to auto-play at timestamp
        setIframeUrl(`https://www.youtube.com/embed/${videoId}?start=${seconds}&autoplay=1&enablejsapi=1`);
    };

    if (!videoId) {
        return <div className="aspect-video bg-slate-100 flex items-center justify-center text-slate-400">Invalid Video URL</div>;
    }

    return (
        <div className="space-y-4">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-lg border border-border/50">
                <iframe
                    width="100%"
                    height="100%"
                    src={iframeUrl}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full"
                ></iframe>
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
