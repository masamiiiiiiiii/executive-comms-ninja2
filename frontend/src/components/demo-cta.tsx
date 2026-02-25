"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PlayCircle, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function DemoCTA() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleDemo = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            let userId = user?.id;

            if (!userId) {
                userId = "0d93271a-2865-458a-8191-7a3b5934b52c"; // Default guest ID
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analyze`, {
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
        <Button
            size="lg"
            onClick={handleDemo}
            disabled={loading}
            className="h-14 px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all hover:scale-105"
        >
            {loading ? <Loader2 className="mr-3 h-5 w-5 animate-spin" /> : <PlayCircle className="mr-3 h-5 w-5" />}
            {loading ? "Initializing Demo..." : "Experience Interactive Demo"}
        </Button>
    );
}
