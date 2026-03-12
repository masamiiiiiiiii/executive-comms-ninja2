"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { NewsJackExportCard } from "@/components/newsjack-export-card";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NewsJackResultPage() {
    const params = useParams();
    const id = params?.id as string;
    const router = useRouter();
    const [analysis, setAnalysis] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAnalysis = useCallback(async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analyze/${id}`, { cache: "no-store" });
            if (!res.ok) {
                setError("Failed to load analysis.");
                return null;
            }
            const data = await res.json();
            setAnalysis(data);
            setLoading(false);
            return data;
        } catch (e) {
            setError("Network error. Please check your connection.");
            setLoading(false);
            return null;
        }
    }, [id]);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        let pollCount = 0;

        const poll = async () => {
            const data = await fetchAnalysis();
            const status = data?.status;

            // Keep polling if still processing/queued
            if ((status === "processing" || status === "queued") && pollCount < 24) {
                pollCount++;
                timer = setTimeout(poll, 5000);
            }
        };

        poll();
        return () => clearTimeout(timer);
    }, [fetchAnalysis]);

    if (loading || !analysis || analysis.status === "processing" || analysis.status === "queued") {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 text-emerald-500 animate-spin mb-4" />
                <p className="text-emerald-400 font-mono tracking-widest uppercase text-sm">Processing Neural Link...</p>
            </div>
        );
    }

    if (error || analysis.status === "failed") {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
                <p className="text-red-400 font-mono mb-4">{error || "Analysis Failed."}</p>
                <Button variant="outline" className="text-slate-300" onClick={() => router.push("/newsjack")}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Try Again
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 p-8 flex items-center justify-center">
            <NewsJackExportCard analysis={analysis} />
        </div>
    );
}
