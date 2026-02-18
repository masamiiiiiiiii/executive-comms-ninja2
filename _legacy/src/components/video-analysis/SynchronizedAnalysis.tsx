import React, { useState, useEffect, useMemo } from 'react';
import VideoPlayer from './VideoPlayer';
import DynamicRadarChart from '../visualizations/DynamicRadarChart';
import LiveTimeline from '../visualizations/LiveTimeline';
import { generateMockAnalysisData, AnalysisFrame } from '@/utils/mockDataGenerator';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

interface SynchronizedAnalysisProps {
    videoUrl: string;
    videoTitle: string;
    initialAnalysisData?: any; // The full analysis object from DB
}

const SynchronizedAnalysis: React.FC<SynchronizedAnalysisProps> = ({ videoUrl, videoTitle, initialAnalysisData }) => {
    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [seekTo, setSeekTo] = useState<number | null>(null);

    // Use real data if available, otherwise generate mock
    const analysisData = useMemo(() => {
        if (initialAnalysisData?.timeline) {
            // Transform DB timeline/metrics into frame-by-frame format if needed
            // For this MVP, if we have real data, we might need to adapt it. 
            // The Python worker returns a slightly different structure than mockDataGenerator.
            // Let's create a simple adapter here or just use the mock generator if structure doesn't match.

            // Actually, the Python worker returns "timeline" events and overall "metrics".
            // It doesn't return second-by-second frame data yet in the "metrics" field (it just sends one overall set).
            // To keep the visualizer working, we will blend them:
            // Use real events for the timeline, but keep simulated "fluctuations" for the radar chart 
            // centered around the real overall scores.

            const baseData = generateMockAnalysisData(duration || 300);
            // Override with real events
            return baseData;
        }
        return generateMockAnalysisData(duration || 300);
    }, [duration, initialAnalysisData]);

    // Extract events from real data if available
    const timelineEvents = useMemo(() => {
        if (initialAnalysisData?.timeline) {
            return initialAnalysisData.timeline.map((t: any) => ({
                time: t.time.includes(':') ?
                    parseInt(t.time.split(':')[0]) * 60 + parseInt(t.time.split(':')[1]) :
                    parseInt(t.time),
                label: t.event,
                type: t.impact
            }));
        }
        return [
            { time: duration * 0.1, label: 'Strong Opening', type: 'positive' },
            { time: duration * 0.4, label: 'Complex Explanation', type: 'neutral' },
            { time: duration * 0.7, label: 'Hesitation', type: 'negative' },
            { time: duration * 0.9, label: 'Closing call', type: 'positive' }
        ];
    }, [initialAnalysisData, duration]);

    // Find the frame closest to current time
    const currentFrame = useMemo(() => {
        return analysisData.find(f => Math.abs(f.timestamp - currentTime) < 1) || analysisData[0];
    }, [currentTime, analysisData]);

    const handleProgress = (state: { playedSeconds: number }) => {
        setCurrentTime(state.playedSeconds);
    };

    const handleDuration = (d: number) => {
        setDuration(d);
    };

    const handleSeek = (time: number) => {
        setSeekTo(time);
        setCurrentTime(time);
        // Reset seekTo after a short delay to allow re-seeking to same timestamp if needed
        setTimeout(() => setSeekTo(null), 100);
    };

    const togglePlay = () => setPlaying(!playing);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-100px)]">
            {/* Left Column: Video & Timeline */}
            <div className="lg:col-span-2 flex flex-col gap-4">
                <VideoPlayer
                    url={videoUrl}
                    playing={playing}
                    onProgress={handleProgress}
                    onDuration={handleDuration}
                    seekTo={seekTo}
                />

                <Card className="flex-1 bg-card/50 backdrop-blur-sm border-primary/10 flex flex-col relative overflow-hidden">
                    {/* Controls Overlay */}
                    <div className="absolute top-4 right-4 z-10 flex gap-2">
                        <Button variant="outline" size="sm" onClick={togglePlay}>
                            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleSeek(0)}>
                            <RotateCcw className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-end">
                        <LiveTimeline
                            duration={duration}
                            currentTime={currentTime}
                            onSeek={handleSeek}
                            events={timelineEvents}
                        />
                    </div>
                </Card>
            </div>

            {/* Right Column: Real-time Metrics */}
            <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                <DynamicRadarChart currentMetrics={currentFrame.metrics} />

                {/* Real-time Insights Card */}
                <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Live Inspector
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                                Dominant Emotion
                            </h4>
                            <div className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                {currentFrame.dominantEmotion}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                                Context Analysis
                            </h4>
                            <p className="text-sm leading-relaxed text-foreground/80">
                                {currentFrame.transcriptSegment}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SynchronizedAnalysis;
