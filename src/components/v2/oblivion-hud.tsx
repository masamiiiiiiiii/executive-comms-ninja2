"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function OblivionHUD() {
    const [data, setData] = useState({
        pupil: "4.2", tremor: "0.01", symm: "98.5", blink: "12",
        hrv: "45", micro: "0.0", cogLoad: "LOW"
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setData({
                pupil: (Math.random() * 2 + 3).toFixed(1),
                tremor: (Math.random() * 0.08).toFixed(3),
                symm: (Math.random() * 3 + 96).toFixed(1),
                blink: Math.floor(Math.random() * 30).toString(),
                hrv: Math.floor(Math.random() * 20 + 40).toString(),
                micro: (Math.random() * 5).toFixed(1),
                cogLoad: Math.random() > 0.8 ? "HIGH" : "NOMINAL"
            });
        }, 150); // Fast updates for dynamic feel
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-slate-950 flex items-center justify-center font-mono select-none">
            {/* Fine Grid Background */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(to right, #10b981 1px, transparent 1px), linear-gradient(to bottom, #10b981 1px, transparent 1px)`, backgroundSize: '16px 16px' }} />

            {/* Expanding Radar Sweep (Sonar scanning effect) */}
            <motion.div className="absolute w-[800px] h-[800px] rounded-full border border-emerald-500/20"
                animate={{ scale: [0, 1.5], opacity: [0.8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
            />

            {/* Central Optical Focus Area */}
            <div className="relative w-[500px] h-[500px] flex items-center justify-center">

                {/* Expanding Outer Framing Rings */}
                <motion.div className="absolute w-[80%] h-[80%] border-2 border-emerald-500/20 rounded-full"
                    animate={{ scale: [1, 1.02, 0.98, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }} />
                <motion.div className="absolute w-[85%] h-[85%] border border-emerald-400/10 rounded-full"
                    animate={{ scale: [1, 1.05, 1], rotate: [0, -10, 10, 0] }} transition={{ duration: 0.8, repeat: Infinity, ease: "circInOut" }} />

                {/* Thin Lens Rings (Snappy rotations) */}
                <motion.svg viewBox="0 0 200 200" className="absolute w-[70%] h-[70%] text-emerald-400/30"
                    animate={{ rotate: [0, 90, 90, 180, 270, 360] }} transition={{ duration: 6, repeat: Infinity, ease: "circInOut" }}>
                    <circle cx="100" cy="100" r="95" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5 15 40 10" />
                    <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 3" />
                    {/* Inner Tick marks */}
                    {[...Array(36)].map((_, i) => (
                        <line key={i} x1="100" y1="12" x2="100" y2="16" transform={`rotate(${i * 10} 100 100)`} stroke="currentColor" strokeWidth="0.5" />
                    ))}
                </motion.svg>

                {/* Counter-rotating Inner Ring (Thickened for contrast) */}
                <motion.svg viewBox="0 0 200 200" className="absolute w-[50%] h-[50%] text-teal-400/50"
                    animate={{ rotate: [360, 270, 180, 90, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "backInOut" }}>
                    <circle cx="100" cy="100" r="95" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="80 120" />
                </motion.svg>

                {/* Jittery Focus Reticle (Thickened for anchor point) */}
                <motion.svg viewBox="0 0 100 100" className="absolute w-[30%] h-[30%] text-emerald-300/90"
                    animate={{ scale: [1, 0.9, 1.1, 1], rotate: [0, -2, 2, 0] }} transition={{ duration: 0.2, repeat: Infinity, repeatType: "mirror" }}>
                    <path d="M50 5 L50 25 M50 95 L50 75 M5 50 L25 50 M95 50 L75 50" stroke="currentColor" strokeWidth="3" />
                    <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.75" strokeDasharray="5 10" />
                    <circle cx="50" cy="50" r="3" fill="currentColor" />
                </motion.svg>
            </div>

            {/* Micro-Expression Tracking Nodes (Dynamic dots overlay) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {[...Array(12)].map((_, i) => (
                    <motion.div key={i} className="absolute w-[4px] h-[4px] bg-emerald-300/80 shadow-[0_0_10px_#34d399]"
                        style={{ top: `${30 + Math.random() * 40}%`, left: `${30 + Math.random() * 40}%` }}
                        animate={{ opacity: [1, 0, 1], scale: [1, 2, 0], x: [(Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100], y: [(Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100] }}
                        transition={{ duration: 0.5 + Math.random(), repeat: Infinity }}
                    />
                ))}
            </div>

            {/* Scanning Vertical Laser (Thickened) */}
            <motion.div className="absolute w-[4px] h-[80%] bg-emerald-400 shadow-[0_0_25px_#10b981] opacity-70 shadow-emerald-400"
                animate={{ left: ["10%", "90%", "10%"] }} transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity }} />

            {/* Corner Camera Brackets */}
            <div className="absolute inset-10 border border-emerald-500/10 pointer-events-none">
                <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-emerald-500/50" />
                <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-emerald-500/50" />
                <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-emerald-500/50" />
                <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-emerald-500/50" />
            </div>

            {/* Left Data Panel */}
            <div className="absolute top-16 left-16 text-[9px] text-emerald-400/80 tracking-widest leading-relaxed flex flex-col items-start text-left">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-emerald-400 animate-pulse" />
                    <p className="font-bold text-emerald-300">OPTICAL_SENSOR_01</p>
                </div>
                <div className="w-32 h-[1px] bg-emerald-500/30 my-2" />
                <p>SUBJECT: TARGET_A</p>
                <p>STATE: <span className="text-emerald-300 font-bold">ACTIVE_TRACKING</span></p>
                <p>SYNC_RATE: 240HZ</p>
                <div className="mt-4 border-l border-emerald-500/30 pl-2">
                    <p className="text-emerald-500/50 mb-1">COGNITIVE_LOAD</p>
                    <motion.div className="h-2 bg-emerald-400/80" animate={{ width: data.cogLoad === "HIGH" ? "100%" : "40%" }} transition={{ duration: 0.3 }} />
                    <p className="mt-1">{data.cogLoad}</p>
                </div>
            </div>

            {/* Right Data Panel (Biometrics) */}
            <div className="absolute top-16 right-16 text-[9px] text-emerald-400/80 tracking-widest flex flex-col items-end text-right">
                <p className="font-bold text-emerald-300">BIOMETRIC_READOUT</p>
                <div className="w-full h-[1px] flex justify-end my-2">
                    <div className="w-32 h-[1px] bg-emerald-500/30" />
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-right">
                    <span className="text-emerald-500/50">PPL_DIL:</span><span className="text-emerald-300">{data.pupil} MM</span>
                    <span className="text-emerald-500/50">M_TRMR:</span><span className="text-emerald-300">{data.tremor} G</span>
                    <span className="text-emerald-500/50">F_SYMM:</span><span className="text-emerald-300">{data.symm} %</span>
                    <span className="text-emerald-500/50">BLINK:</span><span className="text-emerald-300">{data.blink}/M</span>
                    <span className="text-emerald-500/50">HR_VAR:</span><span className="text-emerald-300">{data.hrv} MS</span>
                    <span className="text-emerald-500/50">MICRO_:</span><span className="text-emerald-300">{data.micro} S</span>
                </div>

                {/* Live Waveform Fragment */}
                <div className="mt-4 flex flex-col items-end">
                    <p className="text-emerald-500/50 mb-1">STRESS_WAVE</p>
                    <div className="w-24 h-8 flex items-end gap-[1px]">
                        {[...Array(24)].map((_, i) => (
                            <motion.div key={i} className="flex-1 bg-emerald-400/60"
                                animate={{ height: [`${Math.random() * 30}%`, `${Math.random() * 100}%`, `${Math.random() * 30}%`] }}
                                transition={{ duration: 0.1 + Math.random() * 0.2, repeat: Infinity }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Processing Status */}
            <div className="absolute bottom-16 text-[11px] text-emerald-300/80 font-bold tracking-[0.4em] uppercase flex flex-col items-center">
                <div className="flex gap-1 mb-2">
                    {[...Array(20)].map((_, i) => (
                        <motion.div key={i} className="w-2 h-1 bg-emerald-500"
                            animate={{ opacity: [0.2, 1, 0.2] }}
                            transition={{ duration: 0.5, delay: i * 0.05, repeat: Infinity }} />
                    ))}
                </div>
                Isolating Emotional Micro-Signatures
            </div>
        </div>
    );
}
