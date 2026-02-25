"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// -------------------------------------------------------------------------------- //
// PATTERN 1: BIOMETRIC OPTICAL SCANNER (Focus on face, micro-expressions, eyes)
// Inspiration: Drone optical sensors / Vika's surveillance cameras.
// -------------------------------------------------------------------------------- //
export function BiometricHUD() {
    const [data, setData] = useState({
        pupil: "4.2", tremor: "0.01", symm: "98.5", blink: "12"
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setData({
                pupil: (Math.random() * 2 + 3).toFixed(1),
                tremor: (Math.random() * 0.05).toFixed(3),
                symm: (Math.random() * 2 + 97).toFixed(1),
                blink: Math.floor(Math.random() * 25).toString()
            });
        }, 300);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-[600px] overflow-hidden bg-slate-950 flex items-center justify-center font-mono select-none">
            {/* Fine Grid */}
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `linear-gradient(to right, #06b6d4 1px, transparent 1px), linear-gradient(to bottom, #06b6d4 1px, transparent 1px)`, backgroundSize: '10px 10px' }} />

            {/* Central Optical Focus Area */}
            <div className="relative w-[400px] h-[400px] flex items-center justify-center">
                {/* Expanding Outer Framing Rings */}
                <motion.div className="absolute w-full h-full border border-cyan-500/10 rounded-full"
                    animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.2, 0.5] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} />

                {/* Thin Lens Rings */}
                <motion.svg viewBox="0 0 200 200" className="absolute w-[80%] h-[80%] text-cyan-400/30"
                    animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}>
                    <circle cx="100" cy="100" r="95" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 10 30 10" />
                    <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="0.2" strokeDasharray="1 1" />
                </motion.svg>

                {/* Inner Focus Reticle (Not a weapon, just a focal point) */}
                <motion.svg viewBox="0 0 100 100" className="absolute w-[40%] h-[40%] text-teal-300/40"
                    animate={{ rotate: -90, scale: [1, 0.95, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                    <path d="M50 10 L50 20 M50 90 L50 80 M10 50 L20 50 M90 50 L80 50" stroke="currentColor" strokeWidth="1" />
                    <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5 5" />
                    <circle cx="50" cy="50" r="2" fill="currentColor" />
                </motion.svg>
            </div>

            {/* Micro-Expression Tracking Nodes (Dynamic dots overlay) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {[...Array(8)].map((_, i) => (
                    <motion.div key={i} className="absolute w-[3px] h-[3px] bg-cyan-300/60"
                        style={{
                            top: `${40 + Math.random() * 20}%`, left: `${40 + Math.random() * 20}%`
                        }}
                        animate={{ opacity: [1, 0, 1], scale: [1, 1.5, 1] }}
                        transition={{ duration: 1 + Math.random(), repeat: Infinity }}
                    />
                ))}
            </div>

            {/* Corner Camera Brackets */}
            <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-cyan-500/40" />
            <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-cyan-500/40" />
            <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-cyan-500/40" />
            <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-cyan-500/40" />

            {/* Left Data Panel */}
            <div className="absolute top-12 left-14 text-[9px] text-cyan-400/80 tracking-widest leading-relaxed">
                <p className="font-bold text-cyan-300">OPTICAL_SENSOR_01</p>
                <div className="w-24 h-[1px] bg-cyan-500/30 my-2" />
                <p>SUBJECT: HUMAN_M</p>
                <p>STATE: ACTIVE</p>
                <p>SYNC_RATE: 120HZ</p>
            </div>

            {/* Right Data Panel (Biometrics) */}
            <div className="absolute top-12 right-14 text-[9px] text-cyan-400/80 tracking-widest text-right">
                <p className="font-bold text-cyan-300">BIOMETRIC_READOUT</p>
                <div className="w-full h-[1px] flex justify-end my-2">
                    <div className="w-24 h-[1px] bg-cyan-500/30" />
                </div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-right">
                    <span className="text-cyan-500/50">PPL_DIL:</span><span>{data.pupil} MM</span>
                    <span className="text-cyan-500/50">M_TRMR:</span><span>{data.tremor} G</span>
                    <span className="text-cyan-500/50">F_SYMM:</span><span>{data.symm} %</span>
                    <span className="text-cyan-500/50">BLINK:</span><span>{data.blink}/M</span>
                </div>
            </div>

            {/* Bottom Processing Status */}
            <div className="absolute bottom-12 text-[10px] text-cyan-300/60 font-medium tracking-[0.3em] uppercase flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-cyan-400 animate-pulse rounded-full" />
                Processing Facial Micro-Expressions
            </div>
        </div>
    );
}

// -------------------------------------------------------------------------------- //
// PATTERN 2: VOCAL/COGNITIVE FREQUENCY TRANSLATOR (Focus on voice, waveform, tone)
// Inspiration: Vika's desk screens, communication arrays, horizontal data flow.
// -------------------------------------------------------------------------------- //
export function VocalHUD() {
    return (
        <div className="relative w-full h-[600px] overflow-hidden bg-[#020617] flex items-center justify-center font-mono select-none">
            {/* Horizontal Scanlines */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(to bottom, #38bdf8 1px, transparent 1px)`, backgroundSize: '100% 4px' }} />

            {/* Central Horizontal Waveform Display */}
            <div className="relative w-[80%] h-[200px] border-y border-sky-500/20 flex flex-col justify-center">
                {/* Center Baseline */}
                <div className="absolute w-full h-[1px] bg-sky-400/40 top-1/2 -translate-y-1/2" />

                {/* Complex Oscilloscope Lines */}
                <div className="w-full h-full relative overflow-hidden flex items-center">
                    <motion.svg className="absolute w-[200%] h-full text-sky-400/30 -left-[100%]" viewBox="0 0 1000 100" preserveAspectRatio="none"
                        animate={{ x: "50%" }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
                        <path d="M0,50 Q100,0 200,50 T400,50 T600,50 T800,50 T1000,50" fill="none" stroke="currentColor" strokeWidth="1" />
                        <path d="M0,50 Q50,80 150,20 T250,90 T350,10 T450,70 T1000,50" fill="none" stroke="currentColor" strokeWidth="0.5" className="opacity-50" />
                    </motion.svg>
                </div>

                {/* Glitching Frequency Bars */}
                <div className="absolute bottom-0 w-full h-[30%] flex items-end gap-[2px] opacity-40">
                    {[...Array(80)].map((_, i) => (
                        <motion.div key={i} className="flex-1 bg-sky-300/40"
                            animate={{ height: [`${Math.random() * 20}%`, `${Math.random() * 100}%`, `${Math.random() * 30}%`] }}
                            transition={{ duration: 0.1 + Math.random() * 0.3, repeat: Infinity }}
                        />
                    ))}
                </div>
            </div>

            {/* Upper Left Data */}
            <div className="absolute top-10 left-10 text-[9px] text-sky-400/70 tracking-[0.2em]">
                <p className="text-sky-300 font-bold">AUDIO_INTERCEPT</p>
                <div className="flex gap-4 mt-2">
                    <div>
                        <p className="text-sky-500/50">FREQ.BAND</p>
                        <p>12.4 KHZ</p>
                    </div>
                    <div>
                        <p className="text-sky-500/50">NOISE_FLOOR</p>
                        <p>-84 DB</p>
                    </div>
                </div>
            </div>

            {/* Lower Right Analysis Blocks */}
            <div className="absolute bottom-10 right-10 flex gap-12 text-[9px] text-sky-400/80 tracking-[0.2em] text-right">
                <div className="flex flex-col items-end">
                    <p className="text-sky-500/50">TONAL_STABILITY</p>
                    <div className="flex gap-1 mt-1">
                        {[...Array(5)].map((_, i) => <div key={i} className={`h-2 w-4 ${i < 4 ? 'bg-sky-400' : 'bg-sky-400/20'}`} />)}
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <p className="text-sky-500/50">CADENCE_SHIFT</p>
                    <p className="text-xl font-light text-sky-300">+0.8</p>
                </div>
            </div>

            {/* Center Processing Status */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-[10px] text-sky-300/60 font-medium tracking-[0.3em] uppercase flex flex-col items-center">
                <span className="mb-2 w-full h-[1px] bg-sky-500/30" />
                Isolating Vocal Sentiment Markers
            </div>
        </div>
    );
}

// -------------------------------------------------------------------------------- //
// PATTERN 3: SEMANTIC COGNITIVE MATRIX (Focus on words, logic, structured thought)
// Inspiration: DNA/Hexagonal deep-dive scans, dense data tracking.
// -------------------------------------------------------------------------------- //
export function SemanticHUD() {
    return (
        <div className="relative w-full h-[600px] overflow-hidden bg-[#040f16] flex items-center justify-center font-mono select-none">
            {/* Hexagonal Background Grid */}
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `radial-gradient(#14b8a6 1px, transparent 1px)`, backgroundSize: '15px 15px' }} />

            {/* Central Rotating Hexagons */}
            <div className="relative w-[300px] h-[300px] flex items-center justify-center">
                <motion.svg viewBox="0 0 100 100" className="absolute w-full h-full text-teal-400/20"
                    animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}>
                    <polygon points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.2" strokeDasharray="1 3" />
                </motion.svg>

                {/* Inner Opposite Rotating Hexagon */}
                <motion.svg viewBox="0 0 100 100" className="absolute w-[70%] h-[70%] text-teal-300/30"
                    animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }}>
                    <polygon points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="10 5" />
                    {/* Connecting lines */}
                    <path d="M50 5 L50 95 M10 27.5 L90 72.5 M10 72.5 L90 27.5" stroke="currentColor" strokeWidth="0.2" />
                </motion.svg>

                {/* Data Core Node */}
                <motion.div className="w-16 h-16 border border-teal-400/50 flex items-center justify-center rotate-45"
                    animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity }}>
                    <div className="w-6 h-6 bg-teal-300/80 shadow-[0_0_20px_#2dd4bf] -rotate-45" />
                </motion.div>
            </div>

            {/* Semantic Processing Nodes (Lines traversing the screen) */}
            <motion.div className="absolute w-[1px] h-[100%] bg-gradient-to-b from-transparent via-teal-400 to-transparent left-[20%]"
                animate={{ top: ["-100%", "100%"] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
            <motion.div className="absolute w-[1px] h-[100%] bg-gradient-to-b from-transparent via-teal-400 to-transparent right-[30%]"
                animate={{ top: ["-100%", "100%"] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />

            {/* Logic Tree Readout */}
            <div className="absolute top-1/4 left-10 text-[8px] text-teal-400/80 tracking-widest leading-relaxed border-l border-teal-500/30 pl-2">
                <p className="text-teal-300 font-bold mb-1">SEMANTIC_TREE_0x9</p>
                <motion.p animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 0.5, repeat: Infinity }}>&gt; PARSING SYNTAX...</motion.p>
                <p>&gt; LOGIC_NODE_FOUND</p>
                <p>&gt; VERIFYING CONTEXT</p>
                <p className="text-teal-500/50 mt-1">COHERENCE MAP: GREEN</p>
            </div>

            {/* Keyword Extraction Matrix */}
            <div className="absolute bottom-1/4 right-10 text-[8px] text-teal-400/80 tracking-widest text-right border-r border-teal-500/30 pr-2">
                <p className="text-teal-300 font-bold mb-1">LEXICAL_EXTRACTION</p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="bg-teal-500/10 px-2 py-0.5 border border-teal-500/20">LEADERSHIP</div>
                    <div className="bg-teal-500/10 px-2 py-0.5 border border-teal-500/20 opacity-50">VISION</div>
                    <div className="bg-teal-500/30 px-2 py-0.5 border border-teal-400 shadow-[0_0_5px_#2dd4bf]">EXECUTION</div>
                    <div className="bg-teal-500/10 px-2 py-0.5 border border-teal-500/20 opacity-30">GROWTH</div>
                </div>
            </div>

            {/* Bottom Status */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[10px] text-teal-300/60 font-medium tracking-[0.3em] uppercase">
                Mapping Cognitive Conviction Flow
            </div>
        </div>
    );
}
