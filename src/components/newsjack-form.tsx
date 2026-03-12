"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Zap, Clock } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

export function NewsJackForm() {
    const [url, setUrl] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [targetPerson, setTargetPerson] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const parseTimeToSeconds = (timeStr: string): number | null => {
        if (!timeStr) return null;
        const parts = timeStr.split(':');
        if (parts.length !== 2) return null;
        const mins = parseInt(parts[0], 10);
        const secs = parseInt(parts[1], 10);
        if (isNaN(mins) || isNaN(secs) || secs >= 60) return null;
        return mins * 60 + secs;
    };

    const handleAnalyze = async () => {
        if (!url) return;

        const startSecs = parseTimeToSeconds(startTime);
        const endSecs = parseTimeToSeconds(endTime);

        if ((startTime && startSecs === null) || (endTime && endSecs === null)) {
            toast.error("Invalid time format. Please use MM:SS.");
            return;
        }

        if (startSecs !== null && endSecs !== null) {
            if (startSecs >= endSecs) {
                toast.error("Start time must be before end time.");
                return;
            }
            if (endSecs - startSecs > 300) {
                toast.error("The timeframe cannot exceed 5 minutes (300 seconds).");
                return;
            }
        }

        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            let userId = user?.id || "0d93271a-2865-458a-8191-7a3b5934b52c";

            let transcript = "";
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
                console.log("Transcript fetch skipped or failed.");
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analyze`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    youtube_url: url,
                    user_id: userId,
                    video_title: "Generated for News Jack",
                    company: "Ninja Intelligence V2",
                    role: "Executive",
                    target_person: targetPerson || "Speaker",
                    transcript_text: transcript,
                    start_time: startSecs,
                    end_time: endSecs
                }),
            });

            if (!response.ok) throw new Error("Failed to start analysis");

            const data = await response.json();
            toast.success("Analysis Initiated!");
            router.push(`/newsjack/${data.analysis_id}`);
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Analysis failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-4 w-full animate-in fade-in zoom-in duration-500">
            <div className="flex flex-col gap-6 p-8 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all">
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex-1 w-full">
                        <Input
                            placeholder="YouTube URL..."
                            className="h-14 font-mono w-full text-sm border-white/10 focus:border-emerald-500 focus:ring-emerald-500/50 bg-black/50 text-white shadow-inner placeholder:text-slate-600 transition-all"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                        />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 py-4 border-t border-white/5">
                    <div className="flex items-center gap-2 text-slate-400 font-mono text-xs uppercase tracking-widest w-full sm:w-auto shrink-0">
                        <Zap className="w-4 h-4 text-emerald-500/50" />
                        <span>Target Person</span>
                    </div>
                    <div className="flex-1 w-full sm:w-auto">
                        <Input
                            placeholder="e.g. CEO, Elon Musk, Speaker"
                            className="h-10 font-mono text-sm border-white/10 focus:border-emerald-500 focus:ring-emerald-500/50 bg-black/40 text-white shadow-inner placeholder:text-slate-600 transition-all"
                            value={targetPerson}
                            onChange={(e) => setTargetPerson(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 py-4 border-t border-white/5">
                    <div className="flex items-center gap-2 text-slate-400 font-mono text-xs uppercase tracking-widest w-full sm:w-auto shrink-0">
                        <Clock className="w-4 h-4 text-emerald-500/50" />
                        <span>Clip Timeframe (Max 5m)</span>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="flex items-center gap-2 bg-black/40 px-3 py-2 rounded-lg border border-white/5">
                            <Label className="text-slate-500 font-mono text-[10px] uppercase">Start</Label>
                            <Input
                                placeholder="00:00"
                                className="h-8 w-20 font-mono text-xs border-none bg-transparent text-white focus-visible:ring-0 focus-visible:ring-offset-0 px-1 text-center"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                            />
                        </div>
                        <span className="text-slate-600">-</span>
                        <div className="flex items-center gap-2 bg-black/40 px-3 py-2 rounded-lg border border-white/5">
                            <Label className="text-slate-500 font-mono text-[10px] uppercase">End</Label>
                            <Input
                                placeholder="05:00"
                                className="h-8 w-20 font-mono text-xs border-none bg-transparent text-white focus-visible:ring-0 focus-visible:ring-offset-0 px-1 text-center"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="ml-auto w-full sm:w-auto mt-4 sm:mt-0">
                        <Button
                            size="lg"
                            className="w-full h-12 sm:h-auto sm:px-8 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105"
                            onClick={handleAnalyze}
                            disabled={loading || !url}
                        >
                            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Zap className="mr-2 h-5 w-5" />}
                            Generate
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
