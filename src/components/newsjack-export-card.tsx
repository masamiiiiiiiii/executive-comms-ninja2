"use client";

import { useRef } from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { Download, ShieldAlert, BadgeCheck, Trophy } from "lucide-react";
import { toast } from "sonner";
import { NinjaIntelligenceIndicator } from "./v2/ninja-indicator";
import { ElegantWaveform } from "./v2/elegant-waveform";
import { Badge } from "@/components/ui/badge";

interface NewsJackExportCardProps {
    analysis: any;
}

export function NewsJackExportCard({ analysis }: NewsJackExportCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        if (!cardRef.current) return;
        try {
            toast.loading("Generating high-res image...", { id: "export-toast" });
            const dataUrl = await toPng(cardRef.current, {
                cacheBust: true,
                canvasWidth: 800,
                canvasHeight: 800,
                pixelRatio: 2, // For high-res
            });
            const link = document.createElement("a");
            link.download = `ninja_analysis_${analysis.analysis_id || "export"}.png`;
            link.href = dataUrl;
            link.click();
            toast.success("Image downloaded successfully!", { id: "export-toast" });
        } catch (err) {
            console.error(err);
            toast.error("Failed to generate image.", { id: "export-toast" });
        }
    };

    const results = analysis.analysis_results || {};
    const overallScore = results.overall_performance?.score || results.executive_presence_score || 0;
    const level = results.overall_performance?.level || "PROFESSIONAL";
    const name = results.video_metadata?.extracted_interviewee_name || analysis.target_person || "Speaker";

    // Fallback metrics if empty
    const metrics = results.high_level_metrics || {
        confidence: { score: 0 },
        trustworthiness: { score: 0 },
    };

    return (
        <div className="flex flex-col items-center gap-6 w-full">
            {/* Download Action */}
            <div className="flex w-full max-w-[800px] justify-between items-center">
                <Button variant="ghost" className="text-slate-400" onClick={() => window.history.back()}>
                    &larr; Back
                </Button>
                <Button onClick={handleDownload} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold">
                    <Download className="w-4 h-4 mr-2" />
                    Download Image for X
                </Button>
            </div>

            {/* Hidden overflow to ensure exact sizing even if container shrinks */}
            <div className="overflow-hidden border border-emerald-500/30 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                {/* Fixed 800x800 Card */}
                <div
                    ref={cardRef}
                    className="w-[800px] h-[800px] bg-slate-950 flex flex-col items-center justify-center relative select-none"
                    style={{ background: "linear-gradient(to bottom right, #020617, #0f172a)" }}
                >
                    {/* Background Noise & Waveform */}
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
                    <div className="absolute inset-x-0 bottom-0 h-1/2 opacity-30">
                        <ElegantWaveform />
                    </div>

                    {/* Glowing Orbs */}
                    <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-emerald-500/20 blur-[120px] rounded-full" />
                    <div className="absolute bottom-[-20%] left-[-20%] w-[60%] h-[60%] bg-blue-500/20 blur-[120px] rounded-full" />

                    {/* Central Indicator Animation */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-150 opacity-40 mix-blend-screen pointer-events-none">
                        <NinjaIntelligenceIndicator isObserving={true} />
                    </div>

                    <div className="relative z-10 flex flex-col w-full h-full p-12 justify-between">
                        {/* Header Details */}
                        <div className="w-full flex justify-between items-start">
                            <div className="flex flex-col">
                                <span className="text-emerald-400 font-mono text-sm tracking-[0.2em] mb-2 uppercase flex items-center gap-2">
                                    <ShieldAlert className="w-4 h-4" />
                                    ExecComms Ninja Verification
                                </span>
                                <h1 className="text-white text-5xl font-extrabold tracking-tight">
                                    {name}
                                </h1>
                            </div>
                            <div className="text-right">
                                <Badge variant="outline" className="border-emerald-500/50 text-emerald-300 px-4 py-2 text-sm font-bold tracking-widest uppercase bg-emerald-500/10">
                                    NEURAL LINK ACTIVE
                                </Badge>
                            </div>
                        </div>

                        {/* Mid-Section Highlights */}
                        <div className="w-full flex justify-center items-center flex-1 mt-8">
                            <div className="flex flex-col items-center gap-6 text-center">
                                {/* Main Overall Score */}
                                <div className="flex flex-col items-center bg-slate-900/50 backdrop-blur-md p-8 rounded-3xl border border-white/5 shadow-2xl min-w-[320px]">
                                    <span className="text-emerald-500/80 font-mono text-sm tracking-widest uppercase mb-4 flex items-center gap-2">
                                        <Trophy className="w-4 h-4" />
                                        Executive Consistency
                                    </span>
                                    <div className="text-9xl font-black text-white tracking-tighter drop-shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                                        {overallScore}<span className="text-5xl text-emerald-500">%</span>
                                    </div>
                                    <span className="text-emerald-400 font-black tracking-widest uppercase text-xl mt-4">
                                        {level} TIER
                                    </span>
                                </div>

                                {/* 3 Key Metrics Below Overall Score */}
                                <div className="grid grid-cols-3 gap-6 w-full max-w-[700px]">
                                    {/* Clarity */}
                                    <div className="flex flex-col items-center bg-slate-900/40 backdrop-blur-sm p-6 rounded-2xl border border-white/5">
                                        <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3 border border-emerald-500/20">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
                                        </div>
                                        <div className="text-4xl font-bold text-white tracking-tight mb-2">
                                            {metrics.clarity?.score || 0}%
                                        </div>
                                        <span className="text-sm font-mono text-slate-400 uppercase tracking-widest">Clarity</span>
                                    </div>

                                    {/* Engagement */}
                                    <div className="flex flex-col items-center bg-slate-900/40 backdrop-blur-sm p-6 rounded-2xl border border-white/5">
                                        <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-3 border border-blue-500/20">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08" /><path d="M5.38 15.99c-.77.77-1.33 1.77-1.6 2.85l-.33 1.34c-.1.35.25.7.6.6l1.34-.33c1.08-.27 2.08-.83 2.85-1.6l8.06-8.08a2.85 2.85 0 1 0-4.03-4.03l-8.08 8.06Z" /><path d="m16 8 4 4" /><path d="m8 16 4 4" /></svg>
                                        </div>
                                        <div className="text-4xl font-bold text-white tracking-tight mb-2">
                                            {metrics.engagement?.score || 0}%
                                        </div>
                                        <span className="text-sm font-mono text-slate-400 uppercase tracking-widest">Engagement</span>
                                    </div>

                                    {/* Confidence */}
                                    <div className="flex flex-col items-center bg-slate-900/40 backdrop-blur-sm p-6 rounded-2xl border border-white/5">
                                        <div className="h-12 w-12 rounded-full bg-indigo-500/10 flex items-center justify-center mb-3 border border-indigo-500/20">
                                            <ShieldAlert className="w-6 h-6 text-indigo-400" />
                                        </div>
                                        <div className="text-4xl font-bold text-white tracking-tight mb-2">
                                            {metrics.confidence?.score || 0}%
                                        </div>
                                        <span className="text-sm font-mono text-slate-400 uppercase tracking-widest">Confidence</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Branding (Metrics Removed) */}
                        <div className="w-full flex justify-end mt-auto border-t border-emerald-500/20 pt-6 backdrop-blur-sm">
                            <span className="text-white font-bold opacity-50 flex items-center gap-2">
                                <BadgeCheck className="w-5 h-5" />
                                execcomms.ninja
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
