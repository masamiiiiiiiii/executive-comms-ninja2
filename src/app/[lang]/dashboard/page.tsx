"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
    ShieldCheck, Loader2, PlaySquare, Calendar, Target,
    Trophy, ArrowRight, RefreshCw, Zap, Clock, Trash2
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { NewAnalysisForm } from "@/components/new-analysis-form";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface AnalysisRecord {
    id: string;
    created_at: string;
    video_title: string;
    target_person: string;
    status: string;
    analysis_results?: {
        overall_performance?: { score: number; level: string; };
        video_metadata?: { extracted_interviewee_name?: string; };
    };
}

interface Profile {
    tier: string;
    monthly_usage_count: number;
    monthly_period_start: string | null;
    payment_date: string | null;
    is_master: boolean;
}

const MONTHLY_LIMIT = 5;

// Retention windows by tier
const RETENTION_DAYS: Record<string, number> = {
    one_time_ja: 90,
    one_time: 90,
    subscription_ja: 180,
    subscription: 180,
};

const t: Record<string, Record<string, string>> = {
    en: {
        loading: "Accessing Secure Archives...",
        title: "Command Center",
        welcomeTitle: "Secure Link Established",
        welcomeDescOnetime: "Welcome back. Your single analysis session is active. Initiate your analysis below, or review your archived report.",
        welcomeDescSub: "Welcome back. Your Executive Pro subscription is active.",
        newAnalysis: "Initiate New Analysis",
        archives: "Analysis Archives",
        noData: "No archived analyses found. Initiate your first analysis above.",
        viewReport: "View Report",
        deleteReport: "Delete",
        deleteConfirm: "Are you sure you want to delete this analysis? This cannot be undone.",
        untitled: "Untitled Analysis",
        remaining: "Analyses remaining this month",
        retentionNote: "Reports stored for",
        days: "days",
        signOut: "Sign Out",
        loginRequired: "Login required",
    },
    ja: {
        loading: "セキュアアーカイブにアクセス中...",
        title: "コマンドセンター",
        welcomeTitle: "セキュアリンク確立済み",
        welcomeDescOnetime: "ご利用の一回切り分析セッションがアクティブです。以下から分析を開始するか、過去のレポートをご確認ください。",
        welcomeDescSub: "Executive Proサブスクリプションがアクティブです。",
        newAnalysis: "新規分析を開始",
        archives: "分析アーカイブ",
        noData: "分析履歴がありません。上から最初の分析を開始してください。",
        viewReport: "レポートを見る",
        deleteReport: "削除",
        deleteConfirm: "この分析を削除しますか？この操作は元に戻せません。",
        untitled: "タイトルなし分析",
        remaining: "今月の残り分析回数",
        retentionNote: "レポート保存期間",
        days: "日間",
        signOut: "サインアウト",
        loginRequired: "ログインが必要です",
    },
};

export default function DashboardPage() {
    const router = useRouter();
    const params = useParams();
    const lang = (params?.lang as string) || "en";
    const tx = t[lang] || t["en"];

    const [profile, setProfile] = useState<Profile | null>(null);
    const [analyses, setAnalyses] = useState<AnalysisRecord[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const supabase = createClient();

    const summarizeVideoTitle = (title: string) => {
        if (!title) return tx.untitled;
        let clean = title.split(" | ")[0].split(" - ")[0].trim();
        if (clean.length > 55) return clean.substring(0, 55) + "...";
        return clean;
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push(`/${lang}`);
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (!window.confirm(tx.deleteConfirm)) return;
        setDeletingId(id);
        await supabase.from("video_analyses").delete().eq("id", id);
        setAnalyses(prev => prev.filter(a => a.id !== id));
        setDeletingId(null);
    };

    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push(`/${lang}/login`);
                return;
            }
            setUserId(user.id);

            // Fetch profile
            const { data: profileData } = await supabase
                .from("profiles")
                .select("tier, monthly_usage_count, monthly_period_start, payment_date, is_master")
                .eq("id", user.id)
                .single();

            if (!profileData?.tier) {
                // No paid tier — send to pricing
                router.push(`/${lang}/pricing`);
                return;
            }
            setProfile(profileData as Profile);

            // Sync sessionStorage for components that still rely on it
            sessionStorage.setItem("ninja_pro_unlocked", "true");
            sessionStorage.setItem("selected_pricing_tier", profileData.tier);

            // Fetch analyses within retention window
            const retentionDays = RETENTION_DAYS[profileData.tier] || 90;
            const since = new Date();
            since.setDate(since.getDate() - retentionDays);

            const { data: analysisData } = await supabase
                .from("video_analyses")
                .select("id, created_at, video_title, target_person, status, analysis_results")
                .eq("user_id", user.id)
                .gte("created_at", since.toISOString())
                .order("created_at", { ascending: false });

            setAnalyses(analysisData || []);
            setLoadingData(false);
        };
        init();
    }, [lang]);

    if (loadingData) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-4" />
                <p className="text-emerald-500/70 font-mono text-sm uppercase tracking-widest">{tx.loading}</p>
            </div>
        );
    }

    const isSubscription = profile?.tier === "subscription" || profile?.tier === "subscription_ja" || profile?.is_master;
    const isOneTime = (profile?.tier === "one_time" || profile?.tier === "one_time_ja") && !profile?.is_master;
    const remaining = profile?.is_master ? "∞" : MONTHLY_LIMIT - (profile?.monthly_usage_count || 0);
    const retentionDays = profile?.is_master ? 365 : RETENTION_DAYS[profile?.tier || "one_time_ja"];

    // One-time: show new analysis form only if no completed analysis exists
    const hasCompletedAnalysis = analyses.some(a => a.status === "completed");
    const showNewAnalysisForm = isSubscription || !hasCompletedAnalysis;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-mono relative overflow-hidden flex flex-col items-center pt-16 sm:pt-24 pb-12 px-4 sm:px-6">
            <div className="relative z-10 w-full max-w-5xl">

                {/* Header */}
                <div className="flex items-center justify-between gap-3 mb-8">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="w-7 h-7 text-emerald-400 shrink-0" />
                        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-widest uppercase">{tx.title}</h1>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSignOut}
                        className="text-slate-500 hover:text-slate-300 text-xs"
                    >
                        {tx.signOut}
                    </Button>
                </div>

                {/* Welcome banner */}
                <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-5 sm:p-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-emerald-400 font-bold uppercase tracking-widest text-xs sm:text-sm mb-1">{tx.welcomeTitle}</h2>
                        <p className="text-slate-400 leading-relaxed font-sans text-sm">
                            {isSubscription ? tx.welcomeDescSub : tx.welcomeDescOnetime}
                        </p>
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-1.5 shrink-0">
                        {isSubscription && (
                            <div className="flex items-center gap-2 bg-emerald-500/10 rounded-lg px-3 py-2 border border-emerald-500/20">
                                <Zap className="w-4 h-4 text-emerald-400" />
                                <span className="text-emerald-300 font-bold text-sm">{remaining} / {MONTHLY_LIMIT}</span>
                                <span className="text-slate-400 text-xs font-sans">{tx.remaining}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1.5 text-slate-500 text-xs font-sans">
                            <Clock className="w-3 h-3" />
                            {tx.retentionNote}: {retentionDays}{tx.days}
                        </div>
                    </div>
                </div>

                {/* New Analysis (always shown for subscription; shown for one-time only if no completed analysis) */}
                {showNewAnalysisForm && (
                    <div className="mb-12">
                        <h2 className="text-lg sm:text-xl font-bold text-white tracking-widest uppercase mb-5 flex items-center gap-2">
                            <PlaySquare className="w-5 h-5 text-emerald-500" />
                            {tx.newAnalysis}
                        </h2>
                        <div className="max-w-4xl">
                            <NewAnalysisForm currentLang={lang} />
                        </div>
                    </div>
                )}

                {/* Analysis Archives */}
                <div>
                    <h2 className="text-lg sm:text-xl font-bold text-white tracking-widest uppercase mb-5 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-emerald-500" />
                        {tx.archives}
                    </h2>

                    {analyses.length === 0 ? (
                        <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl bg-slate-900/50">
                            <p className="text-slate-500 font-sans text-sm">{tx.noData}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {analyses.map((record, i) => {
                                const score = record.analysis_results?.overall_performance?.score || 0;
                                const isCompleted = record.status === "completed";
                                const subjectName = record.analysis_results?.video_metadata?.extracted_interviewee_name || record.target_person || "Speaker";

                                return (
                                    <Link href={`/${lang}/analysis/${record.id}`} key={record.id}>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.04 }}
                                            className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-xl p-5 transition-all group flex flex-col justify-between h-full min-h-[120px]"
                                        >
                                            <div>
                                                <div className="flex justify-between items-start mb-3">
                                                    <span className="text-xs text-slate-500 bg-slate-950 px-2 py-1 rounded">
                                                        {new Date(record.created_at).toLocaleDateString()}
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        {isCompleted ? (
                                                            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                                                                <Trophy className="w-3 h-3" /> {score}
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 px-2 py-1 rounded">
                                                                <Loader2 className="w-3 h-3 animate-spin" /> Processing
                                                            </span>
                                                        )}
                                                        {profile?.is_master && (
                                                            <button
                                                                onClick={(e) => handleDelete(e, record.id)}
                                                                disabled={deletingId === record.id}
                                                                className="text-slate-600 hover:text-red-400 transition-colors p-1 rounded hover:bg-red-400/10"
                                                                title={tx.deleteReport}
                                                            >
                                                                {deletingId === record.id
                                                                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                                    : <Trash2 className="w-3.5 h-3.5" />}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                                <h3 className="text-sm sm:text-base font-bold text-white font-sans leading-snug mb-2 group-hover:text-emerald-400 transition-colors">
                                                    {summarizeVideoTitle(record.video_title)}
                                                </h3>
                                                <div className="flex items-center gap-1.5 text-slate-400 text-sm font-sans">
                                                    <Target className="w-3.5 h-3.5 shrink-0" />
                                                    {subjectName}
                                                </div>
                                            </div>

                                            <div className="mt-4 pt-4 border-t border-slate-800 flex justify-end items-center text-emerald-500 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                {tx.viewReport} <ArrowRight className="w-4 h-4 ml-1" />
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
