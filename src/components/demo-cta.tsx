"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PlayCircle, Loader2, ArrowRight } from "lucide-react";
import { NinjaIntelligenceIndicator } from "./v2/ninja-indicator";

export function DemoCTA({ dict, currentLang }: { dict: { initializing: string, experience: string }, currentLang: string }) {
    const [loading, setLoading] = useState(false);
    const [isGlobalProcessing, setIsGlobalProcessing] = useState(false);
    const router = useRouter();

    const handleDemo = () => {
        setLoading(true);
        setIsGlobalProcessing(true);
        // Brief animation, then navigate directly to static demo page — no API call
        setTimeout(() => {
            router.push(`/${currentLang}/demo`);
        }, 400);
    };

    return (
        <>
            {isGlobalProcessing && (
                <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center scale-150 opacity-60 pointer-events-none z-0">
                        <NinjaIntelligenceIndicator isObserving={true} />
                    </div>
                    <div className="relative z-50 text-center mt-32">
                        <h2 className="text-xl font-mono text-emerald-400 mb-2 tracking-widest uppercase bg-slate-950/80 px-4 py-2 rounded">
                            {currentLang === "ja" ? "デモを初期化中" : "Initializing Demo"}
                        </h2>
                        <p className="text-slate-400 text-sm font-mono opacity-80 animate-pulse bg-slate-950/80 px-4 py-2 rounded inline-block">
                            {currentLang === "ja" ? "分析結果を読み込んでいます..." : "Loading analysis results..."}
                        </p>
                    </div>
                </div>
            )}
            <div className="relative inline-flex items-center justify-center">
                {/* Pulsing ring animations behind the button */}
                {!loading && (
                    <>
                        <span className="absolute inline-flex h-full w-full rounded-2xl bg-emerald-500 opacity-25 animate-ping" />
                        <span className="absolute inline-flex h-[115%] w-[115%] rounded-2xl bg-emerald-400 opacity-10 animate-pulse" />
                    </>
                )}
                <Button
                    size="lg"
                    onClick={handleDemo}
                    disabled={loading}
                    className="relative h-16 px-10 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xl rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.55)] hover:shadow-[0_0_60px_rgba(16,185,129,0.8)] transition-all duration-300 hover:scale-105 gap-3"
                >
                    {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <PlayCircle className="h-6 w-6" />}
                    {loading ? dict.initializing : dict.experience}
                    {!loading && <ArrowRight className="h-5 w-5 ml-1" />}
                </Button>
            </div>
        </>
    );
}
