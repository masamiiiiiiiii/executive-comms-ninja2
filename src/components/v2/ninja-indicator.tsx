"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NinjaIndicatorProps {
    isObserving: boolean;
    intensity?: number;
}

export const NinjaIntelligenceIndicator: React.FC<NinjaIndicatorProps> = ({
    isObserving,
}) => {
    const [glitchText, setGlitchText] = useState('SYSTEM_IDLE');

    // High-frequency telemetry updates
    useEffect(() => {
        if (!isObserving) {
            setGlitchText('SYSTEM_IDLE');
            return;
        }
        const interval = setInterval(() => {
            const codes = ['NEURAL_SYNC', 'PKT_PROC', 'STREAM_DATA', 'VECTOR_ANALYSIS', 'SYNSEA_V4'];
            setGlitchText(codes[Math.floor(Math.random() * codes.length)]);
        }, 1200);
        return () => clearInterval(interval);
    }, [isObserving]);

    return (
        <div className="relative w-72 h-72 flex items-center justify-center bg-transparent overflow-hidden select-none">

            {/* MUD Interface: Base Telemetry Rings (Oblivion Style) */}
            <svg viewBox="0 0 200 200" className="absolute w-full h-full opacity-60">
                {/* Outer Static Trim */}
                <circle cx="100" cy="100" r="95" fill="none" stroke="#34d399" strokeWidth="0.5" strokeDasharray="1 4" className="opacity-20" />

                {/* Main Rotating Telemetry Core */}
                <motion.g
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                >
                    <circle cx="100" cy="100" r="85" fill="none" stroke="#34d399" strokeWidth="0.75" strokeDasharray="30 10 5 10" className="opacity-40" />
                    <circle cx="100" cy="100" r="80" fill="none" stroke="#34d399" strokeWidth="0.5" strokeDasharray="1 10" className="opacity-30" />
                </motion.g>

                {/* Counter-Rotating Secondary Ring */}
                <motion.g
                    animate={{ rotate: -360 }}
                    transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                >
                    <circle cx="100" cy="100" r="70" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="120 40" className="opacity-20" />
                    <path d="M 100 30 A 70 70 0 0 1 170 100" fill="none" stroke="#34d399" strokeWidth="1" className="opacity-40" />
                </motion.g>

                {/* Precision Crosshair */}
                <line x1="100" y1="90" x2="100" y2="110" stroke="#34d399" strokeWidth="0.5" className="opacity-40" />
                <line x1="90" y1="100" x2="110" y2="100" stroke="#34d399" strokeWidth="0.5" className="opacity-40" />
            </svg>

            {/* Dynamic Observation Elements (Ghost in the Shell Style) */}
            <AnimatePresence>
                {isObserving && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute inset-0"
                    >
                        {/* Rapid Scanning Arcs */}
                        <svg viewBox="0 0 200 200" className="absolute w-full h-full">
                            <motion.path
                                d="M 100 20 A 80 80 0 0 1 180 100"
                                fill="none"
                                stroke="#6ee7b7"
                                strokeWidth="1.5"
                                animate={{ opacity: [0.2, 0.8, 0.2], strokeDashoffset: [0, 100] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                style={{ strokeDasharray: 50 }}
                            />
                            <motion.path
                                d="M 100 180 A 80 80 0 0 1 20 100"
                                fill="none"
                                stroke="#6ee7b7"
                                strokeWidth="1.5"
                                animate={{ opacity: [0.2, 0.8, 0.2], strokeDashoffset: [0, -100] }}
                                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                                style={{ strokeDasharray: 40 }}
                            />
                        </svg>

                        {/* High-Frequency Neural Pulse (Minimal) */}
                        <motion.div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-emerald-400/20 rounded-full"
                            animate={{ scale: [1, 1.2], opacity: [0.3, 0] }}
                            transition={{ duration: 1, repeat: Infinity, ease: "easeOut" }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Central Core: Precision HUD */}
            <div className="relative z-10 flex flex-col items-center justify-center space-y-2">
                {/* Minimal Digital Glyph */}
                <div className="relative w-16 h-16 flex items-center justify-center mt-2">
                    <motion.div
                        className="absolute inset-0 border border-emerald-500/40 rounded-sm"
                        animate={isObserving ? { rotate: [0, 90], scale: [1, 0.9, 1] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                    <div className="flex flex-col gap-1 items-center">
                        <span className="text-[9px] font-mono text-emerald-500 tracking-tighter opacity-80">NEURAL</span>
                        <div className="h-0.5 w-8 bg-emerald-500/40" />
                        <motion.span
                            key={glitchText}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-[11px] font-mono font-bold text-emerald-400 tracking-widest shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                        >
                            {glitchText === 'SYSTEM_IDLE' ? 'IDLE' : 'SYNC'}
                        </motion.span>
                    </div>
                </div>

                {/* Telemetry Labels */}
                <div className="flex flex-col items-center opacity-60">
                    <span className="text-[7px] font-mono text-emerald-500 tracking-[0.4em] uppercase">V_SYNC_STREAM</span>
                    <div className="flex gap-4 mt-1">
                        <div className="flex flex-col items-center">
                            <span className="text-[6px] text-emerald-600">FRM</span>
                            <span className="text-[8px] font-mono text-emerald-400">60.0</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-[6px] text-emerald-600">LAT</span>
                            <span className="text-[8px] font-mono text-emerald-400">0.02ms</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Peripheral Data Blocks */}
            <div className="absolute top-8 left-8 flex flex-col items-start gap-1 opacity-40">
                <div className="w-4 h-[1px] bg-emerald-500/40" />
                <span className="text-[6px] font-mono text-emerald-400">X_COORD: 0.122</span>
                <span className="text-[6px] font-mono text-emerald-400">Y_COORD: 0.884</span>
            </div>

            <div className="absolute bottom-8 right-8 flex flex-col items-end gap-1 opacity-40">
                <span className="text-[6px] font-mono text-emerald-400">PROCESS_SIG: OK</span>
                <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="w-1 h-1 bg-emerald-500/40"
                            animate={isObserving ? { opacity: [0.2, 1, 0.2] } : {}}
                            transition={{ duration: 0.5, delay: i * 0.1, repeat: Infinity }}
                        />
                    ))}
                </div>
                <div className="w-4 h-[1px] bg-emerald-500/40" />
            </div>

        </div>
    );
};
