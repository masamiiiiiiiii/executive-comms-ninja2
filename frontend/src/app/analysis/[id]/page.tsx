import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { VideoPlayer } from "@/components/video-player";
import { AnalysisCharts } from "@/components/analysis-charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { SentimentChart } from "@/components/sentiment-chart";

export default async function AnalysisPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Fetch from Backend API (bypassing RLS)
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analyze/${id}`, {
        cache: 'no-store' // Ensure fresh data
    });

    if (!res.ok) {
        if (res.status === 404) notFound();
        throw new Error("Failed to fetch analysis");
    }

    const analysis = await res.json();

    const results = analysis.analysis_results || {};

    return (
        <div className="min-h-screen bg-background text-foreground font-sans p-6 space-y-8">

            {/* Header */}
            <div className="flex items-center gap-4 max-w-7xl mx-auto">
                <Link href="/">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">{analysis.video_title || "Untitled Analysis"}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <span>{analysis.company}</span>
                        <span>•</span>
                        <span>{analysis.role}</span>
                        <span>•</span>
                        <Badge variant={analysis.status === 'completed' ? "default" : "secondary"}>
                            {analysis.status}
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">

                {/* Left Column: Video & Timeline */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur">
                        <div className="aspect-video bg-black">
                            <VideoPlayer url={analysis.youtube_url} timeline={results.timeline || []} />
                        </div>
                    </Card>

                    <Card className="border-border/50 bg-card/50">
                        <CardHeader>
                            <CardTitle>Executive Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground leading-relaxed">
                                {results.summary || "No summary available yet."}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Metrics & Feedback */}
                <div className="space-y-6">
                    {/* Scorecard */}
                    <Card className="border-primary/20 bg-primary/5">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg text-primary">Executive Presence</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-5xl font-extrabold text-primary">
                                {results.executive_presence_score || results.metrics?.confidence || "--"}
                                <span className="text-xl text-muted-foreground font-normal">/100</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Charts */}
                    <Card className="border-border/50 bg-card/50">
                        <CardHeader>
                            <CardTitle>Performance Metrics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <AnalysisCharts data={results.strategic_metrics || results.metrics} />
                        </CardContent>
                    </Card>

                    {/* NEW: Sentiment Arc */}
                    {results.sentiment_arc && (
                        <Card className="border-border/50 bg-card/50">
                            <CardHeader>
                                <CardTitle>Sentiment Arc</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <SentimentChart data={results.sentiment_arc} />
                            </CardContent>
                        </Card>
                    )}

                    {/* Strengths & Weaknesses */}
                    <div className="grid gap-4">
                        <Card className="border-green-500/20 bg-green-500/5">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-green-500 text-base">Strengths</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                                    {results.strengths?.map((s: string, i: number) => (
                                        <li key={i}>{s}</li>
                                    )) || <li>No data yet</li>}
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="border-red-500/20 bg-red-500/5">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-red-500 text-base">Areas for Improvement</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                                    {results.weaknesses?.map((w: string, i: number) => (
                                        <li key={i}>{w}</li>
                                    )) || <li>No data yet</li>}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
