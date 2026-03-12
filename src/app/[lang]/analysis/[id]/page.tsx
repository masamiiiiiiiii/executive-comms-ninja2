"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { VideoPlayer } from "@/components/video-player";
import { TimelineChart } from "@/components/timeline-chart";
import { TimelineSection } from "@/components/timeline-section";
import { AnalysisCharts } from "@/components/analysis-charts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, FileText, AlertTriangle, CheckCircle2, Info, User, Building2, Calendar, Target, Mic, MessageSquare, Sparkles, Trophy, Flag, TrendingUp, Smile, Meh, Frown, Activity, Loader2, RefreshCw, ShieldAlert, Zap } from "lucide-react";
import { SentimentChart } from "@/components/sentiment-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ElegantWaveform } from "@/components/v2/elegant-waveform";
import { NinjaIntelligenceIndicator } from "@/components/v2/ninja-indicator";
import { GlobalFooter } from "@/components/global-footer";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { generatePDFExport, generateCSVExport } from "@/lib/export-utils";

// --- Components ---

function AnalysisReliabilityNotice({ score, notice }: { score?: number, notice?: string }) {
    if (!score || score > 80) return null;
    return (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3 mb-6">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
                <p className="font-semibold text-amber-800 text-sm">Analysis Reliability Notice</p>
                <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                    {notice || "Analysis accuracy may vary depending on video format (camera angle, lighting, audio quality)."}
                </p>
            </div>
        </div>
    );
}

function ShieldCheckIcon(props: any) { return <CheckCircle2 {...props} /> }
function UserCheckIcon(props: any) { return <User {...props} /> }
function SparklesIcon(props: any) { return <Sparkles {...props} /> }
function LightbulbIcon(props: any) { return <Info {...props} /> }
function BarChart3(props: any) { return <Target {...props} /> }

function MetricCard({ title, score, icon: Icon, colorClass = "bg-primary", definition }: { title: string, score: number, icon?: any, colorClass?: string, definition?: string }) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Card className="border-border/60 shadow-sm cursor-help hover:border-border transition-colors group">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    {Icon && <Icon className="h-4 w-4 text-muted-foreground group-hover:text-slate-800 transition-colors" />}
                                    <span className="text-sm font-medium text-muted-foreground group-hover:text-slate-800 transition-colors">{title}</span>
                                </div>
                                <span className="text-lg font-bold">{score}%</span>
                            </div>
                            <Progress value={score} className="h-2" indicatorClassName={colorClass} />
                        </CardContent>
                    </Card>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-[200px] text-xs p-3">
                    {definition || "Metric definition unavailable."}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

function DetailedMetricRow({ label, value, rating, observation }: { label: string, value: string, rating?: string, observation?: string }) {
    let ratingColor = "bg-slate-100 text-slate-600";
    if (rating === "Good" || rating === "Excellent" || rating === "Positive" || rating === "Appropriate" || rating === "Logical" || rating === "Optimal Pace" || rating === "Dynamic") ratingColor = "bg-emerald-100 text-emerald-700";
    if (rating === "Fair" || rating === "Neutral") ratingColor = "bg-amber-100 text-amber-700";
    if (rating === "Poor" || rating === "Negative") ratingColor = "bg-red-100 text-red-700";

    return (
        <div className="group py-4 border-b border-border/40 last:border-0 hover:bg-slate-50/50 px-3 rounded-sm transition-colors">
            <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">{label}</span>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-500">{value}</span>
                    {rating && <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${ratingColor}`}>{rating}</span>}
                </div>
            </div>
            {observation && (
                <p className="text-xs text-slate-500 leading-relaxed pl-0.5 border-l-2 border-transparent group-hover:border-slate-300 group-hover:pl-2 transition-all">
                    {observation}
                </p>
            )}
        </div>
    );
}

function TimelineIcon({ label }: { label?: string }) {
    if (!label) return <Activity className="h-4 w-4 text-slate-400" />;
    const l = label.toLowerCase();
    if (l.includes("confident") || l.includes("positive") || l.includes("happy")) return <Smile className="h-4 w-4 text-emerald-500" />;
    if (l.includes("focused") || l.includes("neutral") || l.includes("serious")) return <Meh className="h-4 w-4 text-blue-500" />;
    if (l.includes("nervous") || l.includes("negative") || l.includes("hesitant")) return <Frown className="h-4 w-4 text-amber-500" />;
    return <Activity className="h-4 w-4 text-slate-400" />;
}

// --- Processing Skeleton ---
function ProcessingState({ status }: { status: string }) {
    const isQueued = status === "queued";
    const isDownloading = status === "downloading";

    let title = "Analyzing Executive Presence";
    let description = "Gemini AI is analyzing communication patterns, vocal dynamics, and leadership presence. This usually takes 15–30 seconds.";

    if (isQueued) {
        title = "Analysis Queued";
        description = "Your analysis is waiting to be processed. This will start shortly...";
    } else if (isDownloading) {
        title = "Downloading Audio Content";
        description = "YouTube transcript is unavailable. We are downloading the audio for an AI multimodal analysis (voice & tone).";
    }

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 w-full p-6 flex justify-start z-50">
                <Button variant="ghost" className="bg-slate-900/50 hover:bg-slate-800 backdrop-blur-md flex items-center text-sm font-medium text-slate-300 hover:text-white transition-colors shadow-sm rounded-full px-4 border border-slate-700/50" onClick={() => window.location.href = '/'}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Button>
            </div>
            <div className="scale-150 mb-16 opacity-60 pointer-events-none">
                <NinjaIntelligenceIndicator isObserving={true} />
            </div>
            <div className="text-center max-w-sm mx-auto p-8 rounded-2xl relative z-10 border border-emerald-500/20 bg-slate-950/60 backdrop-blur-md shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                <h2 className="text-base font-mono text-emerald-400 mb-2 tracking-widest uppercase">{title}</h2>
                <p className="text-slate-400 text-xs leading-relaxed font-mono opacity-80">{description}</p>
            </div>
        </div>
    );
}

// --- Failed State ---
function FailedState({ error, onRetry }: { error?: string, onRetry: () => void }) {
    return (
        <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
            <div className="text-center max-w-md mx-auto p-8">
                <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-slate-900 mb-2">Analysis Could Not Be Completed</h2>
                <p className="text-slate-500 text-sm mb-2 leading-relaxed">
                    Something went wrong during the analysis process.
                </p>
                {error && <p className="text-xs text-slate-400 bg-slate-100 rounded p-2 mb-6 text-left font-mono break-all">{error.slice(0, 300)}</p>}
                <div className="flex flex-col gap-2">
                    <Button onClick={onRetry} variant="outline" size="sm">
                        <RefreshCw className="h-3 w-3 mr-2" /> Try Another Video
                    </Button>
                </div>
            </div>
        </div>
    );
}

// --- Main Page ---

export default function AnalysisPage() {
    const params = useParams();
    const id = params?.id as string;
    const router = useRouter();
    const [analysis, setAnalysis] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isUnlocked, setIsUnlocked] = useState(false);
    const [pricingTier, setPricingTier] = useState<string | null>(null);

    const summarizeVideoTitle = (title: string) => {
        if (!title) return "Untitled Analysis";
        let clean = title.split(' | ')[0].split(' - ')[0].trim();
        if (clean.length > 55) return clean.substring(0, 55) + "...";
        return clean;
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            setIsUnlocked(sessionStorage.getItem("ninja_pro_unlocked") === "true");
            setPricingTier(sessionStorage.getItem("selected_pricing_tier"));
        }
    }, []);

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

            // Keep polling if still processing/queued (max 2 minutes)
            if ((status === "processing" || status === "queued") && pollCount < 24) {
                pollCount++;
                timer = setTimeout(poll, 5000); // poll every 5s
            }
        };

        poll();
        return () => clearTimeout(timer);
    }, [fetchAnalysis]);

    if (loading || !analysis) {
        return <ProcessingState status={analysis?.status || "queued"} />;
    }

    if (error && !analysis) {
        return <FailedState error={error} onRetry={() => router.push("/")} />;
    }

    const status = analysis.status;
    if (status === "processing" || status === "queued") {
        return <ProcessingState status={status} />;
    }
    if (status === "failed") {
        return <FailedState error={analysis.error_message} onRetry={() => router.push("/")} />;
    }

    const results = analysis.analysis_results || {};

    const metrics = results.high_level_metrics || {
        confidence: { score: 0, label: "Confidence" },
        trustworthiness: { score: 0, label: "Trustworthiness" },
        engagement: { score: 0, label: "Engagement" },
        clarity: { score: 0, label: "Clarity" }
    };

    const overallScore = results.overall_performance?.score || results.executive_presence_score || 0;
    const voiceAnalysis = results.detailed_analysis?.voice_analysis || {};
    const messageAnalysis = results.detailed_analysis?.message_analysis || {};

    const metricDefinitions = {
        Confidence: "Assesses vocal stability, posture, and lack of hesitation. Key for leadership.",
        Trustworthiness: "Evaluates sincerity, eye contact, and consistency of message.",
        Engagement: "Measures audience connection through tonal variety and energy.",
        Clarity: "Analyzes articulation, structure, and ease of understanding."
    };

    return (
        <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans pb-20">

            {/* Top Navigation */}
            <div className="bg-white/90 backdrop-blur-md border-b border-border sticky top-0 z-50 px-4 sm:px-6 py-3 flex items-center justify-between shadow-sm">
                <Button variant="ghost" asChild className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors p-2 sm:p-0 min-h-[44px]">
                    <a href={isUnlocked ? '/dashboard' : '/'}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {isUnlocked ? 'Back to Dashboard' : 'Back to Home'}
                    </a>
                </Button>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-2 text-xs"
                        onClick={() => generatePDFExport(analysis, "exportable-analysis-results")}
                    >
                        <FileText className="h-3 w-3" /> PDF Export
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-2 text-xs"
                        onClick={() => generateCSVExport(analysis)}
                    >
                        <Download className="h-3 w-3" /> Export CSV
                    </Button>
                </div>
            </div>

            <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">

                <AnalysisReliabilityNotice score={results.analysis_reliability?.score} notice={results.analysis_reliability?.notice} />

                {/* Header Section */}
                <div className="bg-white rounded-xl border border-border shadow-sm p-6 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500 transition-all group-hover:w-2" />
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 leading-tight mb-2">Analysis Results</h1>
                            <p className="text-lg text-slate-700 font-medium">{summarizeVideoTitle(analysis.video_title)}</p>

                            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500 uppercase tracking-wide font-semibold">
                                <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded">
                                    <Target className="h-3 w-3" />
                                    <span>Who: {analysis.analysis_results?.video_metadata?.extracted_interviewee_name || analysis.target_person || "Speaker"} {analysis.role ? `(${analysis.role})` : ""}</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded">
                                    <Sparkles className="h-3 w-3" />
                                    <span>Media: {analysis.analysis_results?.video_metadata?.channel_title || "YouTube Channel"}</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded">
                                    <Calendar className="h-3 w-3" />
                                    <span>Published: {analysis.analysis_results?.video_metadata?.published_date || analysis.created_at?.split("T")[0] || "Unknown"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Overall Score Card */}
                <div className="bg-slate-950 rounded-2xl border border-emerald-500/20 shadow-2xl p-10 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-40">
                        <ElegantWaveform />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                                <Trophy className="h-5 w-5 text-emerald-500" />
                            </div>
                            <h2 className="text-xs font-bold text-emerald-500/80 uppercase tracking-[0.3em]">Neural Verification Score</h2>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end">
                            <div>
                                <p className="text-slate-300 text-sm leading-relaxed mb-8 max-w-xl font-medium">
                                    {results.overall_performance?.summary || "Your executive patterns have been processed and compared against global leadership benchmarks."}
                                </p>
                                <div className="flex items-baseline gap-4">
                                    <span className="text-8xl font-black text-emerald-500 tracking-tighter drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">{overallScore}</span>
                                    <div className="space-y-1">
                                        <Badge className="bg-emerald-500 text-slate-950 border-none px-3 py-1 font-black text-[10px] uppercase tracking-widest">
                                            {results.overall_performance?.level || "PROFESSIONAL"} LEVEL
                                        </Badge>
                                        <p className="text-slate-500 text-[10px] font-mono uppercase tracking-tight">Executive Threshold: 85+</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pb-2">
                                <div className="flex justify-between text-[10px] font-mono text-emerald-500/60 uppercase tracking-widest">
                                    <span>Sync Accuracy</span>
                                    <span>High Fidelity</span>
                                </div>
                                <div className="relative h-2 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${overallScore}%` }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="bg-slate-100/80 p-1 w-full justify-start h-12 rounded-lg border border-border/50 overflow-x-auto">
                        <TabsTrigger value="overview" className="h-10 px-4 data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm">Overview</TabsTrigger>
                        <TabsTrigger value="detailed" className="h-10 px-4 data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm">Detailed Analysis</TabsTrigger>
                        <TabsTrigger value="emotion" className="h-10 px-4 data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm">Strategic Radar</TabsTrigger>
                        <TabsTrigger value="timeline" className="h-10 px-4 data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm">Timeline</TabsTrigger>
                        <TabsTrigger value="recommendations" className="h-10 px-4 data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm">Recommendations</TabsTrigger>
                    </TabsList>

                    {/* OVERVIEW TAB */}
                    <TabsContent value="overview" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <MetricCard title="Confidence" score={metrics.confidence?.score || 0} icon={ShieldCheckIcon} colorClass="bg-emerald-500" definition={metricDefinitions.Confidence} />
                            <MetricCard title="Trustworthiness" score={metrics.trustworthiness?.score || 0} icon={UserCheckIcon} colorClass="bg-emerald-500" definition={metricDefinitions.Trustworthiness} />
                            <MetricCard title="Engagement" score={metrics.engagement?.score || 0} icon={SparklesIcon} colorClass="bg-blue-500" definition={metricDefinitions.Engagement} />
                            <MetricCard title="Clarity" score={metrics.clarity?.score || 0} icon={LightbulbIcon} colorClass="bg-emerald-500" definition={metricDefinitions.Clarity} />
                        </div>

                        {/* Executive Summary Box */}
                        <Card className="bg-emerald-50/30 border-emerald-100">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-emerald-800">
                                    <Sparkles className="h-5 w-5" />
                                    Executive Coach's Note
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-700 leading-relaxed max-w-4xl">
                                    {results.summary || "No executive summary available yet."}
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* DETAILED TAB */}
                    <TabsContent value="detailed" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="border-border/60 shadow-sm h-full">
                                <CardHeader className="bg-emerald-50/50 border-b border-border/40 py-4">
                                    <div className="flex items-center gap-2">
                                        <Mic className="h-4 w-4 text-emerald-600" />
                                        <CardTitle className="text-base font-bold text-slate-800">Voice Analysis</CardTitle>
                                    </div>
                                    <CardDescription>Evaluation of pacing, tone, and vocal delivery.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="p-4 space-y-1">
                                        <DetailedMetricRow label="Speaking Rate" value={voiceAnalysis.speaking_rate || "Normal"} rating={voiceAnalysis.speaking_rate === "Optimal Pace" ? "Positive" : "Neutral"} observation={voiceAnalysis.observation} />
                                        <DetailedMetricRow label="Pause Frequency" value={voiceAnalysis.pause_frequency || "Average"} rating="Positive" observation="Effective use of pauses creates anticipation." />
                                        <DetailedMetricRow label="Volume Variation" value={voiceAnalysis.volume_variation || "Steady"} rating="Positive" observation="Dynamic volume keeps audience attentive." />
                                        <DetailedMetricRow label="Clarity" value={voiceAnalysis.clarity_rating || "Good"} rating="Good" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-border/60 shadow-sm h-full">
                                <CardHeader className="bg-indigo-50/50 border-b border-border/40 py-4">
                                    <div className="flex items-center gap-2">
                                        <MessageSquare className="h-4 w-4 text-indigo-600" />
                                        <CardTitle className="text-base font-bold text-slate-800">Message Analysis</CardTitle>
                                    </div>
                                    <CardDescription>Assessment of content structure and emotional resonance.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="p-4 space-y-1">
                                        <DetailedMetricRow label="Keyword Density" value={messageAnalysis.keyword_density || "N/A"} rating="Appropriate" observation="Key terms are used frequently but not repetitively." />
                                        <DetailedMetricRow label="Emotional Tone" value={messageAnalysis.emotional_tone || "Neutral"} rating="Positive" observation={messageAnalysis.observation} />
                                        <DetailedMetricRow label="Structure" value={messageAnalysis.structure_rating || "Structured"} rating="Logical" observation="Clear beginning, middle, and end structure." />
                                        <DetailedMetricRow label="Logic Flow" value={messageAnalysis.logic_flow || "Linear"} rating="Logical" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="recommendations" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="grid gap-4">
                            {results.recommendations?.map((rec: any, i: number) => (
                                <Card key={i} className="border-emerald-100 bg-emerald-50/30">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-start justify-between">
                                            <CardTitle className="text-base font-bold text-emerald-800 flex items-center gap-2">
                                                <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-200 shrink-0">
                                                    <span className="text-xs font-bold text-emerald-700">{i + 1}</span>
                                                </div>
                                                {rec.title}
                                            </CardTitle>
                                            <Badge variant="outline" className="text-[10px] bg-white text-emerald-600 border-emerald-200">{rec.priority} Priority</Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Rationale</p>
                                                <p className="text-sm text-slate-700">{rec.rationale}</p>
                                            </div>
                                            <div className="bg-white p-3 rounded border border-emerald-100 shadow-sm">
                                                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1 flex items-center gap-1">
                                                    <TrendingUp className="h-3 w-3" /> Strategy
                                                </p>
                                                <p className="text-sm text-slate-700">{rec.strategy}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-6 text-xs border-t border-emerald-100 pt-3 mt-2">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-emerald-800">Timeframe</span>
                                                <span className="font-medium text-slate-500">{rec.timeframe}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-emerald-800">Expected Impact</span>
                                                <span className="font-medium text-emerald-600">+{rec.expected_impact}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="timeline" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <TimelineSection analysis={analysis} results={results} />
                    </TabsContent>

                    <TabsContent value="emotion" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="md:col-span-2">
                                <CardHeader>
                                    <CardTitle>Strategic Radar: You vs Industry Standard</CardTitle>
                                    <CardDescription>Comparison against top performing executives in similar roles.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[400px]">
                                        <AnalysisCharts
                                            data={results.emotion_radar || metrics}
                                            benchmarkData={results.benchmark_comparison?.emotion_radar_benchmark}
                                            isEliteBenchmark={overallScore >= 92}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="md:col-span-1 bg-slate-50/50 border-dashed">
                                <CardHeader>
                                    <CardTitle className="text-sm uppercase tracking-widest text-slate-500">Benchmark Insights</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {overallScore >= 92 ? (
                                        <div>
                                            <p className="text-3xl font-light text-amber-500 mb-1">{results.benchmark_comparison?.top_ceos || 92}</p>
                                            <p className="text-xs font-bold text-amber-600 uppercase">Elite Leaders</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="text-3xl font-light text-slate-400 mb-1">{results.benchmark_comparison?.industry_average || 72}</p>
                                            <p className="text-xs font-bold text-slate-500 uppercase">Industry Average</p>
                                        </div>
                                    )}
                                    <div className="pt-6 border-t border-slate-200">
                                        <p className="text-xs text-slate-500 leading-relaxed">
                                            {overallScore >= 92
                                                ? "Your performance is exceptional, placing you among the elite tier of executive communicators. You have exceeded all standard industry benchmarks."
                                                : "Your performance is solid compared to the industry average, but there is still room to grow to reach the Elite Leaders benchmark (92+)."
                                            }
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                </Tabs>

                {/* --- Post-Analysis Conversion & Navigation CTA --- */}
                <div className="mt-16 pt-12 border-t border-slate-200/50">
                    {!isUnlocked || analysis.target_person === "Jack Welch" ? (
                        // Demo / Unpaid User CTA
                        <div className="max-w-3xl mx-auto bg-gradient-to-br from-emerald-950 to-slate-900 rounded-3xl p-10 text-center shadow-2xl border border-emerald-500/20 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
                            <div className="absolute inset-0 bg-emerald-500/10 blur-[100px] group-hover:bg-emerald-500/20 transition-all duration-700"></div>

                            <div className="relative z-10 space-y-6">
                                <ShieldAlert className="w-12 h-12 text-emerald-400 mx-auto mb-2 opacity-80" />
                                <h3 className="text-3xl font-extrabold text-white tracking-tight">Run Your Own Intelligence Sweep</h3>
                                <p className="text-emerald-100/70 text-lg max-w-xl mx-auto leading-relaxed font-medium">
                                    You have just witnessed a fraction of the predictive capability. Unlock the full neural suite and analyze your own high-stakes engagements.
                                </p>
                                <Button
                                    size="lg"
                                    onClick={() => router.push('/pricing')}
                                    className="mt-6 h-14 px-10 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black tracking-widest uppercase text-sm shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all hover:scale-105"
                                >
                                    <Zap className="mr-2 h-5 w-5" />
                                    Unlock Executive Pro
                                </Button>
                            </div>
                        </div>
                    ) : (
                        // Paid User Navigation
                        <div className="max-w-xl mx-auto text-center space-y-6">
                            <h3 className="text-xl font-bold text-slate-800">Analysis Complete</h3>
                            {pricingTier === "subscription" ? (
                                <div className="space-y-4">
                                    <p className="text-slate-500">You can return to the dashboard to queue another observation phase.</p>
                                    <Button
                                        size="lg"
                                        onClick={() => router.push('/dashboard')}
                                        className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                                    >
                                        Return to Dashboard (New Session)
                                    </Button>
                                    <Button variant="ghost" className="w-full text-slate-400" onClick={() => router.push('/')}>
                                        End Session (Return to Home)
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <p className="text-slate-500">Your tactical deep dive report is safely stored. Returning to base.</p>
                                    <Button
                                        size="lg"
                                        onClick={() => router.push('/')}
                                        className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                                    >
                                        Return to Home
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

            </main>
            <GlobalFooter />
        </div>
    );
}
