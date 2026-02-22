"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, PlayCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { WatchInterface } from "./v2/watch-interface";

export function NewAnalysisForm() {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [watchMode, setWatchMode] = useState(false);
    const [videoId, setVideoId] = useState<string | null>(null);

    const router = useRouter();
    const supabase = createClient();

    const [showManual, setShowManual] = useState(false);
    const [manualText, setManualText] = useState("");

    const extractVideoId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const handleLoadForWatch = () => {
        if (!url) return;
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
        if (!url && !manualText) return;
        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            let userId = user?.id || "0d93271a-2865-458a-8191-7a3b5934b52c";

            let transcript = manualText;

            if (!transcript || transcript.length < 100) {
                toast.loading("Gathering observation metadata...", { id: "analysis" });
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

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analyze`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    youtube_url: url || "MANUAL_INPUT",
                    user_id: userId,
                    video_title: "Verified via Co-Watch",
                    company: "Ninja Intelligence V2",
                    role: "Executive",
                    target_person: "Speaker",
                    transcript_text: transcript
                }),
            });

            if (!response.ok) throw new Error("Failed to start analysis");

            const data = await response.json();
            toast.success("Deep Analysis Initiated!", { id: "analysis" });
            router.push(`/analysis/${data.analysis_id}`);

        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Analysis failed.", { id: "analysis" });
        } finally {
            setLoading(false);
        }
    };

    const handleDemo = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            let userId = user?.id || "0d93271a-2865-458a-8191-7a3b5934b52c";

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analyze`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    youtube_url: "DEMO_MODE",
                    user_id: userId,
                    video_title: "Executive Presence Demo",
                    company: "Demo Corp",
                    role: "Executive",
                    target_person: "Speaker"
                }),
            });

            if (!response.ok) throw new Error("Failed to start demo");

            const data = await response.json();
            toast.success("Demo Loaded!");
            router.push(`/analysis/${data.analysis_id}`);
        } catch (error) {
            toast.error("Demo failed.");
        } finally {
            setLoading(false);
        }
    };

    if (watchMode && videoId) {
        return (
            <div className="w-full max-w-5xl mx-auto animate-in fade-in zoom-in duration-500">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Co-Watching Session</h2>
                        <p className="text-sm text-slate-500">Observation Mode: Active. Ensure the designated segment is watched.</p>
                    </div>
                    <Button variant="ghost" className="text-slate-400 hover:text-slate-600" onClick={() => setWatchMode(false)}>
                        Cancel & Reset
                    </Button>
                </div>
                <WatchInterface
                    videoId={videoId}
                    onReadyToAnalyze={handleAnalyze}
                    title={url}
                />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto">
            <div className="flex flex-col gap-4 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Ninja V2: Intelligence Portal</h3>
                    <p className="text-sm text-slate-500">Paste a URL to initiate the Co-Watch observation phase.</p>
                </div>

                <div className="flex gap-2">
                    <Input
                        placeholder="Paste YouTube URL here..."
                        className="h-12 text-sm border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 bg-slate-50/50"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleLoadForWatch()}
                    />
                    <Button size="lg" className="h-12 px-6 bg-slate-900 hover:bg-slate-800 text-white font-medium transition-all active:scale-95 shadow-lg shadow-slate-200" onClick={handleLoadForWatch} disabled={loading}>
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Load Video
                    </Button>
                </div>

                {showManual && (
                    <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <textarea
                            placeholder="Paste the transcript text here manually if you prefer direct analysis..."
                            className="w-full h-32 p-3 text-sm border rounded-lg border-amber-200 bg-amber-50/30 focus:border-amber-500 focus:ring-amber-500 outline-none resize-none transition-all"
                            value={manualText}
                            onChange={(e) => setManualText(e.target.value)}
                        />
                        <div className="flex justify-between items-center mt-2">
                            <p className="text-[10px] text-amber-600 font-medium italic">Bypassing Co-Watch. Manual evidence provided.</p>
                            <Button variant="ghost" size="sm" className="h-7 text-xs text-slate-400 hover:text-slate-600" onClick={() => setShowManual(false)}>Hide</Button>
                        </div>
                        <Button className="w-full mt-2 bg-amber-600 hover:bg-amber-700" onClick={handleAnalyze} disabled={loading}>
                            Analyze Manual Text
                        </Button>
                    </div>
                )}

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Training:</span>
                        <Button variant="link" className="text-xs text-emerald-600 font-semibold p-0 h-auto hover:text-emerald-700" onClick={handleDemo}>
                            Run Demo Session →
                        </Button>
                    </div>

                    <Button variant="ghost" className="text-[10px] text-slate-400 hover:text-slate-600 h-auto p-0 font-medium uppercase tracking-tight" onClick={() => setShowManual(!showManual)}>
                        {showManual ? "Hide Manual Input" : "Paste transcript manually"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
