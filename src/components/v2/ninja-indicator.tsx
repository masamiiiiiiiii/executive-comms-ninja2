"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface NinjaIndicatorProps {
    isObserving: boolean;
    intensity?: number; // 0 to 1
}

export const NinjaIntelligenceIndicator: React.FC<NinjaIndicatorProps> = ({
    isObserving,
    intensity = 0.5
}) => {
    return (
        <div className="relative w-64 h-64 flex items-center justify-center bg-transparent overflow-hidden">
            {/* Background Hex Grid (Static-ish) */}
            <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100">
                <pattern id="hexagons" width="10" height="17.32" patternUnits="userSpaceOnUse" patternTransform="scale(0.5)">
                    <path d="M5 0 L10 2.88 L10 8.66 L5 11.54 L0 8.66 L0 2.88 Z" fill="none" stroke="currentColor" strokeWidth="0.1" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#hexagons)" />
            </svg>

            {/* Rotating Outer Rings */}
            <motion.div
                className="absolute w-56 h-56 border border-emerald-500/30 rounded-full border-dashed"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />

            <motion.div
                className="absolute w-48 h-48 border-2 border-emerald-400/20 rounded-full"
                style={{ borderTopColor: 'transparent', borderBottomColor: 'transparent' }}
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />

            {/* Scanning Bar */}
            {isObserving && (
                <motion.div
                    className="absolute w-full h-[2px] bg-emerald-400/50 shadow-[0_0_10px_rgba(52,211,153,0.5)] z-10"
                    initial={{ top: '0%' }}
                    animate={{ top: ['10%', '90%', '10%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
            )}

            {/* Core Intelligence Hub */}
            <div className="relative z-20 flex items-center justify-center">
                {/* Pulsing Core */}
                <motion.div
                    className="w-16 h-16 rounded-full bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/50 flex items-center justify-center"
                    animate={{
                        scale: isObserving ? [1, 1.1, 1] : 1,
                        boxShadow: isObserving
                            ? ["0 0 10px rgba(16,185,129,0.2)", "0 0 30px rgba(16,185,129,0.6)", "0 0 10px rgba(16,185,129,0.2)"]
                            : "0 0 10px rgba(16,185,129,0.1)"
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    {/* Central AI Icon/Glyph */}
                    <div className="w-8 h-8 flex flex-col gap-1 items-center justify-center">
                        <motion.div
                            className="w-full h-1 bg-emerald-400 rounded-full"
                            animate={{ width: isObserving ? ["40%", "80%", "40%"] : "40%" }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                        />
                        <motion.div
                            className="w-full h-1 bg-emerald-400 rounded-full"
                            animate={{ width: isObserving ? ["70%", "30%", "70%"] : "70%" }}
                            transition={{ duration: 0.7, repeat: Infinity }}
                        />
                        <motion.div
                            className="w-full h-1 bg-emerald-400 rounded-full"
                            animate={{ width: isObserving ? ["20%", "60%", "20%"] : "20%" }}
                            transition={{ duration: 0.4, repeat: Infinity }}
                        />
                    </div>
                </motion.div>

                {/* Orbiting Particles */}
                {isObserving && [0, 72, 144, 216, 288].map((angle, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1.5 h-1.5 bg-emerald-300 rounded-full shadow-[0_0_5px_#6ee7b7]"
                        animate={{
                            rotate: [angle, angle + 360],
                            x: [Math.cos(angle) * 40, Math.cos(angle + 360) * 40],
                            y: [Math.sin(angle) * 40, Math.sin(angle + 360) * 40],
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    />
                ))}
            </div>

            {/* Digital Text Overlay (Cyberpunk feel) */}
            <div className="absolute bottom-4 left-0 w-full text-center">
                <motion.span
                    className="text-[10px] font-mono text-emerald-400 tracking-tighter uppercase"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1, repeat: Infinity }}
                >
                    {isObserving ? ":: ANALYZING_STREAM_DATA ::" : ":: SYSTEM_IDLE ::"}
                </motion.span>
            </div>

            {/* Rotating Data Rings (SVG) */}
            <svg className="absolute w-64 h-64 pointer-events-none" viewBox="0 0 100 100">
                <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    className="text-emerald-500/10"
                    strokeWidth="0.5"
                    strokeDasharray="1, 4"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                />
                <motion.circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="currentColor"
                    className="text-emerald-400/20"
                    strokeWidth="1"
                    strokeDasharray="10, 20"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                />
            </svg>
        </div>
    );
};
