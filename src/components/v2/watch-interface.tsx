"use client";

import React, { useState, useEffect, useRef } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';
import { motion, AnimatePresence } from 'framer-motion';
import { NinjaIntelligenceIndicator } from './ninja-indicator';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Zap, Loader2, Maximize } from 'lucide-react';

interface WatchInterfaceProps {
    videoId: string;
    onReadyToAnalyze: () => void;
    title?: string;
}

export const WatchInterface: React.FC<WatchInterfaceProps> = ({
    videoId,
    onReadyToAnalyze,
    title = "Analyzing Executive Presence..."
}) => {
    const [player, setPlayer] = useState<any>(null);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isObserving, setIsObserving] = useState(false);
    const [watchedSeconds, setWatchedSeconds] = useState<Set<number>>(new Set());
    const [progress, setProgress] = useState(0);
    const [isRequirementMet, setIsRequirementMet] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Requirement:
    // - If < 5m (300s): Watch 90% (to handle end-slop)
    // - If >= 5m: Watch 180s (3m) total unique seconds
    const isShort = duration > 0 && duration < 300;
    const threshold = isShort ? Math.floor(duration * 0.9) : 180;

    const handleFinalInitiate = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            onReadyToAnalyze();
        }, 2000); // Aesthetic delay for the 'Ultra' transition
    };

    useEffect(() => {
        if (isObserving && player) {
            timerRef.current = setInterval(() => {
                const time = Math.floor(player.getCurrentTime());
                setCurrentTime(time);

                setWatchedSeconds(prev => {
                    const next = new Set(prev);
                    next.add(time);
                    return next;
                });
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isObserving, player]);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    useEffect(() => {
        const uniqueWatchedCount = watchedSeconds.size;
        const newProgress = Math.min((uniqueWatchedCount / threshold) * 100, 100);
        setProgress(newProgress);

        if (newProgress >= 100 && !isRequirementMet) {
            setIsRequirementMet(true);
        }
    }, [watchedSeconds, threshold, isRequirementMet]);

    const onPlayerReady: YouTubeProps['onReady'] = (event) => {
        setPlayer(event.target);
        setDuration(event.target.getDuration());
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    const onStateChange: YouTubeProps['onStateChange'] = (event) => {
        // 1 = Playing, 2 = Paused, 3 = Buffering
        if (event.data === 1) setIsObserving(true);
        else setIsObserving(false);
    };

    const opts: YouTubeProps['opts'] = {
        height: '390',
        width: '100%',
        playerVars: {
            autoplay: 0,
            modestbranding: 1,
            rel: 0,
        },
    };

    return (
        <Card ref={containerRef} className={`p-6 lg:p-8 border-white/5 shadow-2xl relative overflow-hidden group max-w-7xl mx-auto transition-all duration-300 ${isFullscreen ? 'bg-slate-950/95 w-screen h-screen flex flex-col justify-center max-w-none rounded-none' : 'bg-slate-950'}`}>

            {/* Expand Button (Top Right of entire Card) */}
            <div className="absolute top-4 right-4 z-50">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleFullscreen}
                    className="w-10 h-10 rounded-full bg-slate-900/60 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 backdrop-blur-md border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all duration-300 group/fs"
                    title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                >
                    <Maximize className="w-4 h-4 group-hover/fs:scale-110 transition-transform" />
                </Button>
            </div>

            <div className={`flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch relative z-10 ${isFullscreen ? 'h-[80vh] max-w-7xl mx-auto w-full' : ''}`}>
                {/* Left: Video Player */}
                <div className="flex-1 min-w-0 space-y-4 flex flex-col justify-center">
                    <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black aspect-video group/video">
                        <YouTube videoId={videoId} opts={{ ...opts, height: '100%', width: '100%' }} onReady={onPlayerReady} onStateChange={onStateChange} className="absolute inset-0 w-full h-full [&>iframe]:w-full [&>iframe]:h-full" />

                        {!isObserving && !isFullscreen && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] pointer-events-none flex items-center justify-center transition-all duration-700 z-10">
                                <div className="bg-emerald-500/5 border border-emerald-500/20 px-8 py-6 rounded-3xl flex flex-col items-center gap-4 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                                    <div className="flex items-center gap-3">
                                        <Zap className="w-6 h-6 text-emerald-500/60 animate-pulse" />
                                        <span className="text-xs font-mono font-bold text-emerald-500/60 tracking-[0.3em] uppercase">Link Established</span>
                                    </div>
                                    <span className="text-sm font-bold text-white tracking-widest uppercase animate-pulse">Press Play on Video to Begin</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between items-center px-2">
                        <div className="flex flex-col min-w-0">
                            <span className="text-[9px] font-mono text-emerald-500/50 uppercase tracking-widest mb-1 leading-none truncate">V_SOURCE_ID: {videoId}</span>
                            <h3 className="text-sm font-mono text-emerald-50 truncate">{title}</h3>
                        </div>
                        <div className="flex items-center gap-4">
                            {!isShort && (
                                <div className="flex items-center gap-2 bg-slate-900/50 border border-white/5 rounded-full px-3 py-1">
                                    <span className="text-[9px] uppercase tracking-widest text-slate-400 font-mono">Jump to Start (s):</span>
                                    <input
                                        type="number"
                                        min="0"
                                        max={duration}
                                        className="w-16 bg-transparent text-[10px] text-emerald-400 font-mono focus:outline-none placeholder:text-slate-600"
                                        placeholder="0"
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value);
                                            if (!isNaN(val) && player) player.seekTo(val);
                                        }}
                                    />
                                </div>
                            )}
                            <Badge variant="outline" className="bg-slate-900/50 border-white/10 text-slate-500 font-mono text-[9px] px-3 py-1 uppercase tracking-tighter flex-shrink-0">
                                {isShort ? "CLIP_MODE_90P" : "DEEP_OBS_180S"}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Right: Ninja Monitoring Panel */}
                <div className="w-full lg:w-80 flex-shrink-0 flex flex-col items-center justify-between p-6 lg:p-8 rounded-3xl bg-slate-900/30 backdrop-blur-xl border border-white/10 relative overflow-hidden shadow-2xl">


                    <div className="relative z-10 w-full flex flex-col items-center flex-1 space-y-6">
                        <div className="relative h-48 flex items-center justify-center">
                            <NinjaIntelligenceIndicator isObserving={isObserving} />
                        </div>

                        <div className="w-full space-y-5">
                            <div className="flex justify-between text-[10px] font-mono text-slate-400 uppercase tracking-[0.3em]">
                                <span>Neural Sync</span>
                                <span className={isRequirementMet ? "text-emerald-400" : "text-emerald-500/60"}>
                                    {Math.round(progress)}%
                                </span>
                            </div>
                            <Progress
                                value={progress}
                                className="h-1 bg-white/5 border border-white/5"
                                indicatorClassName="bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)] transition-all duration-1000"
                            />

                            <div className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl text-[9px] leading-relaxed text-slate-500 font-mono shadow-inner relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/20" />
                                {isRequirementMet ? (
                                    <p className="text-emerald-400/80 flex items-center gap-2">
                                        <CheckCircle className="w-3 h-3" /> VERIFIED. PROCEED TO SYNTHESIS.
                                    </p>
                                ) : (
                                    <div className="flex flex-col gap-1">
                                        <span className="text-emerald-600/40 text-[7px] uppercase tracking-widest">Pending Requirements</span>
                                        <p className="opacity-80">
                                            {isShort
                                                ? "OBSERVE REMAINING SEQUENCE DATA."
                                                : `MIN 180S OBSERVATION. (${watchedSeconds.size}/${threshold}s)`}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <Button
                        disabled={!isRequirementMet || isTransitioning}
                        onClick={handleFinalInitiate}
                        className={`w-full h-14 relative overflow-hidden group transition-all duration-700 rounded-2xl mt-8 z-10 font-mono ${isRequirementMet
                            ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black tracking-widest text-[10px]"
                            : "bg-slate-800/40 text-slate-500 border border-white/5"
                            }`}
                    >
                        <AnimatePresence>
                            {(isRequirementMet || isTransitioning) && (
                                <motion.div
                                    initial={{ x: '-100%' }}
                                    animate={{ x: '100%' }}
                                    transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 opacity-30"
                                />
                            )}
                        </AnimatePresence>

                        {isTransitioning ? (
                            <div className="flex items-center gap-3">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Generating Report...
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Zap className={`w-4 h-4 ${isRequirementMet ? "animate-pulse" : ""}`} />
                                Generate Report
                            </div>
                        )}
                    </Button>
                </div>
            </div>
        </Card>
    );
};
