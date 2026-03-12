"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2, PlaySquare, Calendar, Target, Trophy, ArrowRight } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { NewAnalysisForm } from "@/components/new-analysis-form";
import { motion } from "framer-motion";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface AnalysisRecord {
    id: string;
    created_at: string;
    video_title: string;
    target_person: string;
    status: string;
    analysis_results?: {
        overall_performance?: {
            score: number;
            level: string;
        };
        video_metadata?: {
            extracted_interviewee_name?: string;
        };
    };
}

export default function DashboardPage() {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
    const [analyses, setAnalyses] = useState<AnalysisRecord[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    const summarizeVideoTitle = (title: string) => {
        if (!title) return "Untitled Analysis";
        let clean = title.split(' | ')[0].split(' - ')[0].trim();
        if (clean.length > 55) return clean.substring(0, 55) + "...";
        return clean;
    };

    useEffect(() => {
        // Simple client-side auth check
        const unlocked = sessionStorage.getItem("ninja_pro_unlocked") === "true";
        if (!unlocked) {
            router.push("/pricing");
        } else {
            setIsAuthorized(true);
            fetchAnalyses();
        }
    }, [router]);

    const fetchAnalyses = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const userId = user?.id || "0d93271a-2865-458a-8191-7a3b5934b52c";

            const { data, error } = await supabase
                .from("video_analyses")
                .select("*")
                .eq("user_id", userId)
                .order("created_at", { ascending: false });

            if (error) throw error;
            setAnalyses(data || []);
        } catch (error) {
            console.error("Error fetching analyses:", error);
        } finally {
            setLoadingData(false);
        }
    };

    if (isAuthorized === null || loadingData) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-4" />
                <p className="text-emerald-500/70 font-mono text-sm uppercase tracking-widest">Accessing Secure Archives...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-mono relative overflow-hidden flex flex-col items-center pt-24 pb-12 px-6">
            <div className="relative z-10 w-full max-w-5xl">
                <div className="flex items-center gap-3 mb-8">
                    <ShieldCheck className="w-8 h-8 text-emerald-400" />
                    <h1 className="text-3xl font-bold text-white tracking-widest uppercase">Command Center</h1>
                </div>

                <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-6 mb-12 flex flex-col gap-2">
                    <h2 className="text-emerald-400 font-bold uppercase tracking-widest text-sm">Secure Link Established</h2>
                    <p className="text-slate-400 leading-relaxed font-sans text-sm">
                        Welcome to your Executive Comms Command Center. Initiate a new neural scorecard below, or review your historical analysis archives.
                    </p>
                </div>

                <div className="mb-16">
                    <h2 className="text-xl font-bold text-white tracking-widest uppercase mb-6 flex items-center gap-2">
                        <PlaySquare className="w-5 h-5 text-emerald-500" />
                        Initiate New Analysis
                    </h2>
                    <div className="max-w-4xl">
                        <NewAnalysisForm />
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-bold text-white tracking-widest uppercase mb-6 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-emerald-500" />
                        Analysis Archives
                    </h2>

                    {analyses.length === 0 ? (
                        <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl bg-slate-900/50">
                            <p className="text-slate-500 font-sans">No historical data found. Initiate your first analysis above.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {analyses.map((record, i) => {
                                const score = record.analysis_results?.overall_performance?.score || 0;
                                const isCompleted = record.status === "completed";
                                const subjectName = record.analysis_results?.video_metadata?.extracted_interviewee_name || record.target_person || "Speaker";

                                return (
                                    <Link href={`/analysis/${record.id}`} key={record.id}>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-xl p-5 transition-all group flex flex-col justify-between h-full"
                                        >
                                            <div>
                                                <div className="flex justify-between items-start mb-3">
                                                    <span className="text-xs text-slate-500 bg-slate-950 px-2 py-1 rounded">
                                                        {new Date(record.created_at).toLocaleDateString()}
                                                    </span>
                                                    {isCompleted ? (
                                                        <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                                                            <Trophy className="w-3 h-3" />
                                                            Score: {score}
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 px-2 py-1 rounded">
                                                            <Loader2 className="w-3 h-3 animate-spin" />
                                                            Processing
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className="text-base font-bold text-white font-sans leading-snug mb-2 group-hover:text-emerald-400 transition-colors">
                                                    {summarizeVideoTitle(record.video_title)}
                                                </h3>
                                                <div className="flex items-center gap-1.5 text-slate-400 text-sm font-sans">
                                                    <Target className="w-3.5 h-3.5" />
                                                    {subjectName}
                                                </div>
                                            </div>

                                            <div className="mt-4 pt-4 border-t border-slate-800 flex justify-end items-center text-emerald-500 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-300">
                                                View Report <ArrowRight className="w-4 h-4 ml-1" />
                                            </div>
                                        </motion.div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
