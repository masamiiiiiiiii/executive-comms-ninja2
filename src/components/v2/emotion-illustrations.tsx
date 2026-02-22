"use client";

import React from "react";
import {
    Target,
    Sparkles,
    Waves,
    Activity,
    ShieldCheck,
    Zap,
    BrainCircuit,
    Compass
} from "lucide-react";

interface EmotionIllustrationProps {
    emotion?: string;
    className?: string;
}

export const EmotionIllustration: React.FC<EmotionIllustrationProps> = ({ emotion = "Neutral", className = "" }) => {
    const e = emotion.toLowerCase();

    // Default: Neutral / Analytical
    let Icon = BrainCircuit;
    let colorClass = "from-slate-400 to-slate-600";
    let glowClass = "bg-slate-500/20";
    let iconColor = "text-slate-100";
    let borderClass = "border-slate-500/30";

    if (e.includes("enthusiastic") || e.includes("happy") || e.includes("passion")) {
        Icon = Sparkles;
        colorClass = "from-amber-400 to-orange-500";
        glowClass = "bg-orange-500/20";
        iconColor = "text-orange-100";
        borderClass = "border-orange-500/30";
    } else if (e.includes("confident") || e.includes("authoritative")) {
        Icon = ShieldCheck;
        colorClass = "from-emerald-400 to-teal-500";
        glowClass = "bg-emerald-500/20";
        iconColor = "text-emerald-100";
        borderClass = "border-emerald-500/30";
    } else if (e.includes("composed") || e.includes("calm")) {
        Icon = Waves;
        colorClass = "from-blue-400 to-cyan-500";
        glowClass = "bg-blue-500/20";
        iconColor = "text-blue-100";
        borderClass = "border-blue-500/30";
    } else if (e.includes("nervous") || e.includes("hesitant") || e.includes("tension")) {
        Icon = Activity;
        colorClass = "from-rose-400 to-red-500";
        glowClass = "bg-rose-500/20";
        iconColor = "text-rose-100";
        borderClass = "border-rose-500/30";
    }

    return (
        <div className={`relative flex items-center justify-center w-full h-full ${className}`}>
            {/* Ambient background glow */}
            <div className={`absolute inset-0 rounded-full blur-xl ${glowClass} animate-pulse`} style={{ animationDuration: '3s' }} />

            {/* Core Icon Container - Glassmorphic gem */}
            <div className={`relative z-10 w-[75%] h-[75%] rounded-2xl bg-gradient-to-br ${colorClass} p-[1px] shadow-[0_0_15px_rgba(0,0,0,0.5)]`}>
                <div className="w-full h-full bg-slate-950/80 rounded-2xl flex items-center justify-center backdrop-blur-md">
                    <Icon className={`w-1/2 h-1/2 ${iconColor} drop-shadow-[0_0_8px_currentColor]`} strokeWidth={1.5} />
                </div>
            </div>

            {/* Orbital decorative rings for a sophisticated tech aesthetic */}
            <div className={`absolute inset-1 border ${borderClass} rounded-full animate-[spin_10s_linear_infinite]`} style={{ borderStyle: 'dashed' }} />
            <div className={`absolute inset-0 border ${borderClass} rounded-full opacity-50`} />
        </div>
    );
};
