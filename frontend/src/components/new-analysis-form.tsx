"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner"; // Use sonner instead of useToast

export function NewAnalysisForm() {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleAnalyze = async () => {
        if (!url) return;
        setLoading(true);

        try {
            // 1. Get current user (anonymous or logged in)
            const { data: { user } } = await supabase.auth.getUser();

            let userId = user?.id;
            if (!userId) {
                // MVP: Use the Guest User ID created via backend
                // This satisfies the foreign key constraint in `video_analyses`
                userId = "0d93271a-2865-458a-8191-7a3b5934b52c";
            }

            // 1.5 Extract transcript natively via Vercel to bypass GCP Datacenter block
            toast.loading("Extracting interview text...", { id: "transcript" });
            const transcriptRes = await fetch("/api/transcript", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url })
            });

            if (!transcriptRes.ok) {
                toast.dismiss("transcript");
                throw new Error("Unable to extract transcript due to YouTube security restrictions. Please try another video or the Demo.");
            }
            const { transcript } = await transcriptRes.json();
            toast.success("Transcript extracted!", { id: "transcript" });

            // 2. Call Backend API
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analyze`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    youtube_url: url,
                    user_id: userId,
                    video_title: "Pending...", // Expect backend/worker to update this
                    company: "Demo Corp", // Default for quick demo
                    role: "Executive",
                    target_person: "Speaker",
                    transcript_text: transcript
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to start analysis");
            }

            const data = await response.json();

            toast.success("Analysis started!");
            router.push(`/analysis/${data.analysis_id}`);

        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Failed to start analysis. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDemo = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            let userId = user?.id;

            // Generate a random ID if no user (for demo purposes)
            if (!userId) {
                // MVP: Use the Guest User ID created via backend
                userId = "0d93271a-2865-458a-8191-7a3b5934b52c";
            }

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
        <div className="flex flex-col gap-4 w-full">
            <div className="flex gap-2 w-full">
                <Input
                    placeholder="Paste YouTube URL here..."
                    className="h-12 text-lg border-0 bg-secondary/50 focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                />
                <Button size="lg" className="h-12 px-8 text-base" onClick={handleAnalyze} disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Plus className="mr-2 h-5 w-5" />}
                    {loading ? "Analyzing..." : "Analyze"}
                </Button>
            </div>
        </div>
    );
}
