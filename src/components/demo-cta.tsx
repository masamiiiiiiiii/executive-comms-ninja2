"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PlayCircle, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { NinjaIntelligenceIndicator } from "./v2/ninja-indicator";

export function DemoCTA() {
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
                    target_person: "Jack Welch"
                }),
            });

            // Run the fetch and a 5-second timer concurrently
            const [response, _] = await Promise.all([
                fetchPromise,
                new Promise(resolve => setTimeout(resolve, 5000))
            ]);

            if (!response.ok) throw new Error("Failed to start demo");

            const data = await response.json();
            toast.success("Demo Analysis Loaded!");
            router.push(`/analysis/${data.analysis_id}`);

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
            <Button
                size="lg"
                onClick={handleDemo}
                disabled={loading}
                className="h-14 px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all hover:scale-105"
            >
                {loading ? <Loader2 className="mr-3 h-5 w-5 animate-spin" /> : <PlayCircle className="mr-3 h-5 w-5" />}
                {loading ? "Initializing Demo..." : "Experience Interactive Demo"}
            </Button>
        </>
    );
}
