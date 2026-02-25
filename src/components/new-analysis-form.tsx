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

export function NewAnalysisForm() {
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
                toast.success("Transaction Secure. Executive Pro unlocked.", { duration: 5000 });

                // Clean the URL so the query param doesn't linger
                window.history.replaceState({}, document.title, window.location.pathname);

                // Re-hydrate the pending URL and automatically load it
                const pendingUrl = sessionStorage.getItem("pendingAnalysisUrl");
                if (pendingUrl) {
                    setUrl(pendingUrl);
                    // Slight delay to ensure state updates before triggering the load
                    setTimeout(() => {
                        const id = extractVideoId(pendingUrl);
                        if (id) {
                            setVideoId(id);
                            setWatchMode(true);
                            toast.success("Neural Link ready. Awaiting your observation command.", { duration: 4000 });
                        }
                    }, 100);
                }
            }
        }
    }, [searchParams]);

    const extractVideoId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const handleLoadForWatch = () => {
        if (!url) return;

        // --- Premium Paywall Redirect Logic ---
        const isUnlocked = typeof window !== "undefined" && sessionStorage.getItem("ninja_pro_unlocked") === "true";
        if (!isUnlocked) {
            if (typeof window !== "undefined") {
                sessionStorage.setItem("pendingAnalysisUrl", url);
            }
            router.push("/pricing");
            return;
        }
        // --------------------------------------

        const id = extractVideoId(url);
        if (!id) {
            toast.error("Invalid YouTube URL");
            return;
        }
        setVideoId(id);
        setWatchMode(true);
        toast.success("Video Loaded. Ninja is ready to observe.");
    };

    const handleAnalyze = async () => {
        if (!url) return;

        // Quota Check
        const tier = sessionStorage.getItem("selected_pricing_tier");
        if (tier === "subscription") {
            const usage = parseInt(sessionStorage.getItem("ninja_sub_usage_count") || "0");
            if (usage >= 5) {
                toast.error("Monthly quota exhausted. You have used your 5 neural links.");
                router.push('/');
                return;
            }
        } else if (tier === "one_time") {
            const usage = parseInt(sessionStorage.getItem("ninja_onetime_usage_count") || "0");
            if (usage >= 1) {
                toast.error("Your Tactical Deep Dive has already been consumed. Please upgrade to Pro.");
                router.push('/pricing');
                return;
            }
        }

        setLoading(true);
        setIsGlobalProcessing(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            let userId = user?.id || "0d93271a-2865-458a-8191-7a3b5934b52c";

            let transcript = "";

            // Start a minimum 5-second timer immediately.
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
                        transcript_text: transcript
                    }),
                });
            };

            const [response, _] = await Promise.all([
                performAnalysis(),
                timerPromise
            ]);

            if (!response.ok) throw new Error("Failed to start analysis");

            const data = await response.json();

            // Re-hydrate session storage with latest analysis id for the dashboard loop
            sessionStorage.removeItem("pendingAnalysisUrl");
            sessionStorage.setItem("last_analysis_id", data.analysis_id);

            // Update Quota for Subscription & One-Time users
            const tier = sessionStorage.getItem("selected_pricing_tier");
            if (tier === "subscription") {
                const currentUsage = parseInt(sessionStorage.getItem("ninja_sub_usage_count") || "0");
                sessionStorage.setItem("ninja_sub_usage_count", (currentUsage + 1).toString());
            } else if (tier === "one_time") {
                const currentUsage = parseInt(sessionStorage.getItem("ninja_onetime_usage_count") || "0");
                sessionStorage.setItem("ninja_onetime_usage_count", (currentUsage + 1).toString());
            }

            toast.success("Deep Analysis Initiated!", { id: "analysis" });
            router.push(`/analysis/${data.analysis_id}`);

        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Analysis failed.", { id: "analysis" });
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
                            <h2 className="text-xl font-mono text-emerald-400 mb-2 tracking-widest uppercase">Initializing Neural Link</h2>
                            <p className="text-slate-400 text-sm font-mono opacity-80 animate-pulse">Establishing connection to observation grid...</p>
                        </div>
                    </div>
                )}
                <div className={`w-full max-w-5xl mx-auto animate-in fade-in zoom-in duration-500 ${isGlobalProcessing ? "opacity-0 blur-md transition-all duration-700 pointer-events-none" : ""}`}>
                    <div className="mb-6 flex items-center justify-between border-b border-emerald-500/20 pb-4">
                        <div>
                            <h2 className="text-xl font-bold text-emerald-400 tracking-widest uppercase mb-1">Co-Watching Session</h2>
                            <p className="text-xs text-slate-400 uppercase tracking-widest">Observation Mode: Active. Ensure the designated segment is watched.</p>
                        </div>
                        <Button variant="outline" className="text-xs border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 font-bold tracking-widest uppercase h-8" onClick={() => setWatchMode(false)}>
                            Abort & Reset
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
                        <h2 className="text-xl font-mono text-emerald-400 mb-2 tracking-widest uppercase">Initializing Neural Link</h2>
                        <p className="text-slate-400 text-sm font-mono opacity-80 animate-pulse">Establishing connection to observation grid...</p>
                    </div>
                </div>
            )}
            <div className="flex flex-col gap-4 w-full animate-in fade-in zoom-in duration-500">
                <div className="flex flex-col gap-6 p-8 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all">

                    <div className="space-y-3">
                        <label htmlFor="url-input" className="text-sm font-semibold text-emerald-400 uppercase tracking-widest block">
                            Target Source Video
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
                                Establish Link
                            </Button>
                        </div>
                        <p className="text-xs text-slate-500 font-sans italic opacity-80 pl-1">
                            Supported targets: Public YouTube uniform resource locators (URLs).
                        </p>
                    </div>

                </div>
            </div>
        </>
    );
}
