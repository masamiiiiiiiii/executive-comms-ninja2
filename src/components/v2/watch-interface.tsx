"use client";

import React, { useState, useEffect, useRef } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';
import { motion, AnimatePresence } from 'framer-motion';
import { NinjaIntelligenceIndicator } from './ninja-indicator';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, CheckCircle, Info, Zap } from 'lucide-react';

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

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Requirement: 
    // - If < 5m (300s): Watch 90% (to handle end-slop)
    // - If >= 5m: Watch 180s (3m) total unique seconds
    const isShort = duration > 0 && duration < 300;
    const threshold = isShort ? Math.floor(duration * 0.9) : 180;

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
        <Card className="p-6 bg-slate-950 border-emerald-500/20 shadow-2xl shadow-emerald-500/10 overflow-hidden relative">
            <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Left: Video Player */}
                <div className="flex-1 w-full space-y-4">
                    <div className="relative rounded-xl overflow-hidden border border-slate-800 shadow-inner">
                        <YouTube videoId={videoId} opts={opts} onReady={onPlayerReady} onStateChange={onStateChange} />
                        {!isObserving && (
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] pointer-events-none flex items-center justify-center">
                                <div className="bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-full flex items-center gap-2">
                                    <Info className="w-4 h-4 text-emerald-400" />
                                    <span className="text-xs font-mono text-emerald-400">WAITING FOR OBSERVATION START</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between items-center px-1">
                        <h3 className="text-sm font-mono text-slate-300 truncate max-w-[70%]">{title}</h3>
                        <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 font-mono text-[10px]">
                            {isShort ? "SHORT_CLIP_MODE" : "EXTENDED_OBSERVATION"}
                        </Badge>
                    </div>
                </div>

                {/* Right: Ninja Monitoring Panel */}
                <div className="w-full md:w-80 flex flex-col items-center space-y-6">
                    <NinjaIntelligenceIndicator isObserving={isObserving} />

                    <div className="w-full space-y-3">
                        <div className="flex justify-between text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                            <span>Observation Progress</span>
                            <span className={isRequirementMet ? "text-emerald-400" : ""}>
                                {Math.round(progress)}%
                            </span>
                        </div>
                        <Progress value={progress} className="h-1 bg-slate-800" indicatorClassName="bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />

                        <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg text-[10px] leading-tight text-slate-400 font-mono">
                            {isRequirementMet ? (
                                <p className="text-emerald-400 flex items-center gap-1.5">
                                    <CheckCircle className="w-3 h-3" /> SUFFICIENT DATA COLLECTED. READY FOR ANALYSIS.
                                </p>
                            ) : (
                                <p>
                                    {isShort
                                        ? "WATCH THE FULL CLIP TO ENABLE DEEP ANALYSIS."
                                        : `PLEASE OBSERVE AT LEAST 3 MINUTES OF CONTENT. (${watchedSeconds.size}/${threshold} SECS)`}
                                </p>
                            )}
                        </div>
                    </div>

                    <Button
                        disabled={!isRequirementMet}
                        onClick={onReadyToAnalyze}
                        className={`w-full h-12 relative overflow-hidden group transition-all duration-500 ${isRequirementMet
                                ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold tracking-tighter"
                                : "bg-slate-800 text-slate-500 grayscale"
                            }`}
                    >
                        <AnimatePresence>
                            {isRequirementMet && (
                                <motion.div
                                    initial={{ x: '-100%' }}
                                    animate={{ x: '100%' }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                                />
                            )}
                        </AnimatePresence>
                        <Zap className={`w-4 h-4 mr-2 ${isRequirementMet ? "animate-pulse" : ""}`} />
                        INITIATE DEEP ANALYSIS
                    </Button>
                </div>
            </div>

            {/* Background Decorative Lines */}
            <div className="absolute top-0 right-0 w-32 h-32 border-t border-r border-emerald-500/10 rounded-tr-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 border-b border-l border-emerald-500/10 rounded-bl-3xl pointer-events-none" />
        </Card>
    );
};
