"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PlayCircle, Loader2, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { NinjaIntelligenceIndicator } from "./v2/ninja-indicator";

export function DemoCTA({ dict, currentLang }: { dict: { initializing: string, experience: string }, currentLang: string }) {
    const [loading, setLoading] = useState(false);
    const [isGlobalProcessing, setIsGlobalProcessing] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleDemo = async () => {
        setLoading(true);
        setIsGlobalProcessing(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            let userId = user?.id;

            if (!userId) {
                userId = "0d93271a-2865-458a-8191-7a3b5934b52c"; // Default guest ID
            }

            const fetchPromise = fetch(`${process.env.NEXT_PUBLIC_API_URL}/analyze`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    youtube_url: "DEMO_MODE",
                    user_id: userId,
                    video_title: "Jack Welch Leadership Interview",
                    company: "General Electric",
                    role: "Legendary CEO",
                    target_person: "Jack Welch",
                    lang: currentLang
                }),
            });

            // Run the fetch and a 5-second timer concurrently
            const [response] = await Promise.all([
                fetchPromise,
                new Promise(resolve => setTimeout(resolve, 5000))
            ]);

            if (!response.ok) throw new Error("Failed to start demo");

            const data = await response.json();
            toast.success("Demo Analysis Loaded!");
            router.push(`/${currentLang}/analysis/${data.analysis_id}`);

        } catch (error) {
            console.error(error);
            toast.error("Failed to load demo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {isGlobalProcessing && (
                <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center scale-150 opacity-60 pointer-events-none z-0">
                        <NinjaIntelligenceIndicator isObserving={true} />
                    </div>
                    <div className="relative z-50 text-center mt-32">
                        <h2 className="text-xl font-mono text-emerald-400 mb-2 tracking-widest uppercase bg-slate-950/80 px-4 py-2 rounded">Initializing Neural Link</h2>
                        <p className="text-slate-400 text-sm font-mono opacity-80 animate-pulse bg-slate-950/80 px-4 py-2 rounded inline-block">Establishing connection to observation grid...</p>
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
