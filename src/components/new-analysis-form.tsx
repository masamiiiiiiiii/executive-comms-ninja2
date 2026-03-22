"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, PlayCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { WatchInterface } from "./v2/watch-interface";
import { NinjaIntelligenceIndicator } from "./v2/ninja-indicator";

const formText: Record<string, Record<string, string>> = {
    en: {
        labelTarget: "Target Source Video",
        btnEstablish: "Establish Link",
        supportedTargets: "Supported targets: Public YouTube uniform resource locators (URLs).",
        coWatchTitle: "Co-Watching Session",
        coWatchDesc: "Observation Mode: Active. Ensure the designated segment is watched.",
        abortReset: "Abort & Reset",
        initNeural: "Initializing Neural Link",
        connectingGrid: "Establishing connection to observation grid...",
        toastUnlocked: "Transaction Secure. Executive Pro unlocked.",
        toastNeuralReady: "Neural Link ready. Awaiting your observation command.",
        toastLoaded: "Video Loaded. Ninja is ready to observe.",
        toastInvalidUrl: "Invalid YouTube URL",
        toastQuotaSub: "Monthly quota exhausted. You have used your 5 neural links.",
        toastQuotaOne: "Your Tactical Deep Dive has already been consumed. Please upgrade to Pro.",
        toastAnalysis: "Deep Analysis Initiated!",
        toastFailed: "Analysis failed.",
    },
    ja: {
        labelTarget: "分析対象ビデオ",
        btnEstablish: "リンクを確立",
        supportedTargets: "対象: 公開されているYouTube URLのみ対応しています。",
        coWatchTitle: "共同視聴セッション",
        coWatchDesc: "観察モード: アクティブ。指定セグメントを視聴してください。",
        abortReset: "中止 & リセット",
        initNeural: "ニューラルリンクを初期化中",
        connectingGrid: "観察グリッドへの接続を確立中...",
        toastUnlocked: "決済完了。Executive Proがアンロックされました。",
        toastNeuralReady: "ニューラルリンク準備完了。観察コマンドを待機中。",
        toastLoaded: "動画読み込み完了。Ninjaが観察準備完了。",
        toastInvalidUrl: "無効なYouTube URLです",
        toastQuotaSub: "月間クォータ上限に達しました。今月の5回分を使用済みです。",
        toastQuotaOne: "タクティカル・ディープダイブは消費済みです。Proにアップグレードしてください。",
        toastAnalysis: "ディープ分析を開始しました！",
        toastFailed: "分析に失敗しました。",
    },
};

export function NewAnalysisForm({ currentLang }: { currentLang: string }) {
    const t = formText[currentLang] || formText["en"];

    const [url, setUrl] = useState(() => {
        if (typeof window !== "undefined") {
            return sessionStorage.getItem("pendingAnalysisUrl") || "";
        }
        return "";
    });
    const [loading, setLoading] = useState(false);
    const [isGlobalProcessing, setIsGlobalProcessing] = useState(false);
    const [watchMode, setWatchMode] = useState(false);
    const [videoId, setVideoId] = useState<string | null>(null);

    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = createClient();

    // --- Payment Success Redirect Handler ---
    useEffect(() => {
        if (searchParams?.get("payment_success") === "true") {
            if (typeof window !== "undefined") {
                sessionStorage.setItem("ninja_pro_unlocked", "true");
                toast.success(t.toastUnlocked, { duration: 5000 });

                // Clean the URL so the query param doesn't linger
                window.history.replaceState({}, document.title, window.location.pathname);

                // Re-hydrate the pending URL and automatically load it
                const pendingUrl = sessionStorage.getItem("pendingAnalysisUrl");
                if (pendingUrl) {
                    setUrl(pendingUrl);
                    setTimeout(() => {
                        const id = extractVideoId(pendingUrl);
                        if (id) {
                            setVideoId(id);
                            setWatchMode(true);
                            toast.success(t.toastNeuralReady, { duration: 4000 });
                        }
                    }, 100);
                }
            }
        }
    }, [searchParams, t.toastUnlocked, t.toastNeuralReady]);

    const extractVideoId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const handleLoadForWatch = () => {
        if (!url) return;

        const isUnlocked = typeof window !== "undefined" && sessionStorage.getItem("ninja_pro_unlocked") === "true";
        if (!isUnlocked) {
            if (typeof window !== "undefined") {
                sessionStorage.setItem("pendingAnalysisUrl", url);
            }
            router.push(`/${currentLang}/pricing`);
            return;
        }

        const id = extractVideoId(url);
        if (!id) {
            toast.error(t.toastInvalidUrl);
            return;
        }
        setVideoId(id);
        setWatchMode(true);
        toast.success(t.toastLoaded);
    };

    const handleAnalyze = async () => {
        if (!url) return;

        const tier = sessionStorage.getItem("selected_pricing_tier");
        if (tier === "subscription" || tier === "subscription_ja") {
            const usage = parseInt(sessionStorage.getItem("ninja_sub_usage_count") || "0");
            if (usage >= 5) {
                toast.error(t.toastQuotaSub);
                router.push(`/${currentLang}`);
                return;
            }
        } else if (tier === "one_time" || tier === "one_time_ja") {
            const usage = parseInt(sessionStorage.getItem("ninja_onetime_usage_count") || "0");
            if (usage >= 1) {
                toast.error(t.toastQuotaOne);
                router.push(`/${currentLang}/pricing`);
                return;
            }
        }

        setLoading(true);
        setIsGlobalProcessing(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            let userId = user?.id || "0d93271a-2865-458a-8191-7a3b5934b52c";

            let transcript = "";

            const timerPromise = new Promise(resolve => setTimeout(resolve, 5000));

            const performAnalysis = async () => {
                if (!transcript || transcript.length < 100) {
                    try {
                        const transcriptRes = await fetch("/api/transcript", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ url })
                        });

                        if (transcriptRes.ok) {
                            const data = await transcriptRes.json();
                            transcript = data.transcript;
                        }
                    } catch (e) {
                        console.log("Transcript fetch skipped or failed, falling back to audio.");
                    }
                }

                return fetch(`${process.env.NEXT_PUBLIC_API_URL}/analyze`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        youtube_url: url,
                        user_id: userId,
                        video_title: "Verified via Co-Watch",
                        company: "Ninja Intelligence V2",
                        role: "Executive",
                        target_person: "Speaker",
                        transcript_text: transcript,
                        lang: currentLang
                    }),
                });
            };

            const [response, _] = await Promise.all([
                performAnalysis(),
                timerPromise
            ]);

            if (!response.ok) throw new Error(t.toastFailed);

            const data = await response.json();

            sessionStorage.removeItem("pendingAnalysisUrl");
            sessionStorage.setItem("last_analysis_id", data.analysis_id);

            const currentTier = sessionStorage.getItem("selected_pricing_tier");
            if (currentTier === "subscription" || currentTier === "subscription_ja") {
                const currentUsage = parseInt(sessionStorage.getItem("ninja_sub_usage_count") || "0");
                sessionStorage.setItem("ninja_sub_usage_count", (currentUsage + 1).toString());
            } else if (currentTier === "one_time" || currentTier === "one_time_ja") {
                const currentUsage = parseInt(sessionStorage.getItem("ninja_onetime_usage_count") || "0");
                sessionStorage.setItem("ninja_onetime_usage_count", (currentUsage + 1).toString());
            }

            toast.success(t.toastAnalysis, { id: "analysis" });
            router.push(`/${currentLang}/analysis/${data.analysis_id}`);

        } catch (error: any) {
            console.error(error);
            toast.error(error.message || t.toastFailed, { id: "analysis" });
        } finally {
            setLoading(false);
        }
    };

    if (watchMode && videoId) {
        return (
            <>
                {isGlobalProcessing && (
                    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center animate-in fade-in duration-700">
                        <div className="scale-150 mb-16 opacity-60">
                            <NinjaIntelligenceIndicator isObserving={true} />
                        </div>
                        <div className="relative z-10 text-center">
                            <h2 className="text-xl font-mono text-emerald-400 mb-2 tracking-widest uppercase">{t.initNeural}</h2>
                            <p className="text-slate-400 text-sm font-mono opacity-80 animate-pulse">{t.connectingGrid}</p>
                        </div>
                    </div>
                )}
                <div className={`w-full max-w-5xl mx-auto animate-in fade-in zoom-in duration-500 ${isGlobalProcessing ? "opacity-0 blur-md transition-all duration-700 pointer-events-none" : ""}`}>
                    <div className="mb-6 flex items-center justify-between border-b border-emerald-500/20 pb-4">
                        <div>
                            <h2 className="text-xl font-bold text-emerald-400 tracking-widest uppercase mb-1">{t.coWatchTitle}</h2>
                            <p className="text-xs text-slate-400 uppercase tracking-widest">{t.coWatchDesc}</p>
                        </div>
                        <Button variant="outline" className="text-xs border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 font-bold tracking-widest uppercase h-8" onClick={() => setWatchMode(false)}>
                            {t.abortReset}
                        </Button>
                    </div>
                    <WatchInterface
                        videoId={videoId}
                        onReadyToAnalyze={handleAnalyze}
                        title={url}
                    />
                </div>
            </>
        );
    }

    return (
        <>
            {isGlobalProcessing && (
                <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center">
                    <div className="scale-150 mb-16 opacity-60">
                        <NinjaIntelligenceIndicator isObserving={true} />
                    </div>
                    <div className="relative z-10 text-center">
                        <h2 className="text-xl font-mono text-emerald-400 mb-2 tracking-widest uppercase">{t.initNeural}</h2>
                        <p className="text-slate-400 text-sm font-mono opacity-80 animate-pulse">{t.connectingGrid}</p>
                    </div>
                </div>
            )}
            <div className="flex flex-col gap-4 w-full animate-in fade-in zoom-in duration-500">
                <div className="flex flex-col gap-6 p-8 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all">

                    <div className="space-y-3">
                        <label htmlFor="url-input" className="text-sm font-semibold text-emerald-400 uppercase tracking-widest block">
                            {t.labelTarget}
                        </label>
                        <div className="flex flex-col md:flex-row gap-3">
                            <Input
                                id="url-input"
                                placeholder="https://www.youtube.com/watch?v=..."
                                className="h-14 font-mono text-sm border-white/10 focus:border-emerald-500 focus:ring-emerald-500/50 bg-black/50 text-white shadow-inner flex-1 placeholder:text-slate-600 transition-all"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleLoadForWatch()}
                            />
                            <Button
                                size="lg"
                                className="h-14 px-8 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105"
                                onClick={handleLoadForWatch}
                                disabled={loading || !url}
                            >
                                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <PlayCircle className="mr-2 h-5 w-5" />}
                                {t.btnEstablish}
                            </Button>
                        </div>
                        <p className="text-xs text-slate-500 font-sans italic opacity-80 pl-1">
                            {t.supportedTargets}
                        </p>

                        {/* Recommended content section */}
                        <div className="mt-2 space-y-3">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                                {currentLang === "ja" ? "ベストな分析結果のために — 推奨コンテンツ" : "For Best Results — Recommended Content"}
                            </p>

                            {/* Content type badges */}
                            <div className="flex flex-wrap gap-2 pl-1">
                                {(currentLang === "ja" ? [
                                    { label: "1対1インタビュー", badge: "BEST", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
                                    { label: "記者会見・スピーチ", badge: "GOOD", color: "text-blue-400 bg-blue-500/10 border-blue-500/30" },
                                    { label: "パネルディスカッション", badge: "OK", color: "text-slate-400 bg-slate-500/10 border-slate-500/30" },
                                ] : [
                                    { label: "1-on-1 Interview", badge: "BEST", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
                                    { label: "Press Conference / Speech", badge: "GOOD", color: "text-blue-400 bg-blue-500/10 border-blue-500/30" },
                                    { label: "Panel Discussion", badge: "OK", color: "text-slate-400 bg-slate-500/10 border-slate-500/30" },
                                ]).map((item) => (
                                    <span key={item.label} className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${item.color}`}>
                                        <span className="text-[9px] font-black tracking-widest opacity-70">{item.badge}</span>
                                        {item.label}
                                    </span>
                                ))}
                            </div>

                            {/* Tips */}
                            <div className="bg-slate-800/40 rounded-xl p-3.5 space-y-1.5 border border-white/5">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                                    {currentLang === "ja" ? "推奨条件" : "Ideal Conditions"}
                                </p>
                                {(currentLang === "ja" ? [
                                    "対象者が主要な話者である動画（他者の発言が少ない）",
                                    "10分〜60分程度の長さが最適",
                                    "音声が明瞭で英語または日本語のインタビュー",
                                    "例：CEOインタビュー、経営者の講演、記者会見など",
                                ] : [
                                    "Subject is the primary speaker (minimal other voices)",
                                    "Optimal length: 10 to 60 minutes",
                                    "Clear audio — English or Japanese interviews",
                                    "e.g. CEO interview, keynote speech, press conference",
                                ]).map((tip) => (
                                    <p key={tip} className="text-xs text-slate-400 font-sans flex items-start gap-2">
                                        <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>
                                        {tip}
                                    </p>
                                ))}
                            </div>

                            {/* Clickable example URLs */}
                            <div className="space-y-1.5 pl-1">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                    {currentLang === "ja" ? "サンプル動画（クリックで入力）" : "Sample Videos (click to fill)"}
                                </p>
                                {(currentLang === "ja" ? [
                                    { label: "Jensen Huang — NVIDIA CEO (スタンフォード大学)", url: "https://www.youtube.com/watch?v=lXLBTBBil2U" },
                                    { label: "Dario Amodei — Anthropic CEO (Lex Fridman Podcast)", url: "https://www.youtube.com/watch?v=ugvHCXCOmm4" },
                                    { label: "Sundar Pichai — Google CEO (Bloomberg)", url: "https://www.youtube.com/watch?v=MGr_mcrnB0M" },
                                ] : [
                                    { label: "Jensen Huang — NVIDIA CEO (Stanford GSB)", url: "https://www.youtube.com/watch?v=lXLBTBBil2U" },
                                    { label: "Dario Amodei — Anthropic CEO (Lex Fridman Podcast)", url: "https://www.youtube.com/watch?v=ugvHCXCOmm4" },
                                    { label: "Sundar Pichai — Google CEO (Bloomberg)", url: "https://www.youtube.com/watch?v=MGr_mcrnB0M" },
                                ]).map((ex) => (
                                    <button
                                        key={ex.url}
                                        type="button"
                                        onClick={() => setUrl(ex.url)}
                                        className="w-full text-left text-xs text-slate-400 hover:text-emerald-400 font-mono truncate transition-colors flex items-center gap-2 group py-1"
                                    >
                                        <PlayCircle className="w-3 h-3 shrink-0 text-slate-600 group-hover:text-emerald-500 transition-colors" />
                                        {ex.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
