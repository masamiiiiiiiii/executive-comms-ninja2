"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Check, ShieldAlert, Sparkles, Target, Zap, Activity } from "lucide-react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_dummy");

export default function PricingPage() {
    const [loadingOneTime, setLoadingOneTime] = useState(false);
    const [loadingSub, setLoadingSub] = useState(false);
    const router = useRouter(); // Initialized useRouter

    const handleCheckout = async (tier: "one_time" | "subscription") => {
        const setLoading = tier === "one_time" ? setLoadingOneTime : setLoadingSub;
        setLoading(true);
        try {
            // PRE-STRIPE REGISTRATION & HUMAN VERIFICATION INTERCEPT
            if (typeof window !== "undefined") {
                sessionStorage.setItem("selected_pricing_tier", tier);
            }
            router.push('/register');
        } catch (error) {
            console.error("Link failed:", error);
            toast.error("Failed to establish secure link.");
        } finally {
            setLoading(false);
        }
    };

    const handleCheckoutOneTime = () => handleCheckout("one_time");
    const handleCheckoutSub = () => handleCheckout("subscription");

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">

            {/* Ambient Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 opacity-40">
                <div className="absolute top-[0%] left-[-10%] w-[40%] h-[40%] bg-emerald-200/40 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/40 blur-[120px] rounded-full" />
            </div>

            {/* Top Navigation */}
            <div className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex items-center justify-start pointer-events-auto">
                <Button variant="ghost" className="bg-white/50 hover:bg-white/80 backdrop-blur-md flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors shadow-sm rounded-full px-4 border border-slate-200/50" onClick={() => router.push('/')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
                    Back to Home
                </Button>
            </div>

            <div className="relative z-10 w-full max-w-5xl pt-20 pb-16">
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                        Invest in <br className="md:hidden" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                            Executive Authority
                        </span>
                    </h1>
                    <p className="text-slate-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                        In high-stakes corporate communication, intuition is a liability. Equip yourself with military-grade neural telemetry.
                        Choose the precise level of intelligence required for your next critical appearance.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">

                    {/* Single Deep Dive */}
                    <Card className="bg-white/80 border-slate-200 backdrop-blur-xl shadow-xl flex flex-col">
                        <CardHeader className="pb-8">
                            <CardTitle className="text-2xl text-slate-900 font-bold flex items-center gap-2">
                                <Target className="h-6 w-6 text-emerald-600" />
                                Tactical Deep Dive
                            </CardTitle>
                            <CardDescription className="text-slate-500 text-sm mt-2 leading-relaxed h-10">
                                Immediate, surgical precision for a single upcoming high-stakes interview or keynote.
                            </CardDescription>
                            <div className="mt-6 flex items-baseline text-slate-900">
                                <span className="text-5xl font-black tracking-tighter">$49</span>
                                <span className="ml-2 text-sm font-semibold text-slate-500 uppercase tracking-widest">/ Report</span>
                            </div>
                            <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-widest bg-emerald-50 w-fit px-3 py-1 rounded-full border border-emerald-100">
                                <Zap className="h-3 w-3" /> Pay-As-You-Go
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4 flex-grow">
                            <p className="font-semibold text-slate-800 text-sm border-b border-slate-100 pb-2 mb-4">Included Intelligence:</p>
                            <ul className="space-y-4">
                                <li className="flex items-start text-slate-700 text-sm">
                                    <Check className="h-5 w-5 text-emerald-500 mr-3 shrink-0 mt-0.5" />
                                    <span><strong>One Comprehensive Analysis:</strong> Full neural breakdown of a single video asset.</span>
                                </li>
                                <li className="flex items-start text-slate-700 text-sm">
                                    <Check className="h-5 w-5 text-emerald-500 mr-3 shrink-0 mt-0.5" />
                                    <span><strong>Targeted Processing:</strong> Submit any public YouTube URL and analyze up to 5 minutes of focused footage.</span>
                                </li>
                                <li className="flex items-start text-slate-700 text-sm">
                                    <Check className="h-5 w-5 text-emerald-500 mr-3 shrink-0 mt-0.5" />
                                    <span><strong>No Subscription Required:</strong> Zero recurring commitments. Perfect for acute crisis management or isolated rehearsal.</span>
                                </li>
                            </ul>
                        </CardContent>

                        <CardFooter className="pt-6 border-t border-slate-100">
                            <Button
                                onClick={handleCheckoutOneTime}
                                disabled={loadingOneTime}
                                variant="outline"
                                className="w-full border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-bold text-base py-6"
                            >
                                {loadingOneTime ? "Securing Intelligence..." : "Unlock Single Report"}
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Pro Subscription */}
                    <Card className="bg-slate-900 border-emerald-500/30 relative overflow-hidden shadow-2xl flex flex-col">
                        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-400 to-emerald-600" />

                        <CardHeader className="pb-8">
                            <div className="flex justify-between items-start mb-2">
                                <CardTitle className="text-2xl text-white font-bold flex items-center gap-2">
                                    <ShieldAlert className="h-6 w-6 text-emerald-400" />
                                    Executive Pro
                                </CardTitle>
                                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-500/30">
                                    Best Value
                                </span>
                            </div>
                            <CardDescription className="text-slate-400 text-sm mt-2 leading-relaxed h-10">
                                Continuous mastery and reputation management for CEOs, Founders, and PR exact teams.
                            </CardDescription>
                            <div className="mt-6 flex items-baseline text-white">
                                <span className="text-5xl font-black tracking-tighter">$149</span>
                                <span className="ml-2 text-sm font-semibold text-slate-500 uppercase tracking-widest">/ Month</span>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4 flex-grow">
                            <p className="font-semibold text-slate-300 text-sm border-b border-slate-800 pb-2 mb-4">Included Intelligence:</p>
                            <ul className="space-y-4">
                                <li className="flex items-start text-slate-300 text-sm">
                                    <Sparkles className="h-5 w-5 text-emerald-400 mr-3 shrink-0 mt-0.5" />
                                    <span><strong>5 Executive Analyses per Month:</strong> Continuous feedback loops across various media formats and media interviews. Support for YouTube URLs (analyze any 5-minute segment from videos of any length). ($245 Value)</span>
                                </li>
                                <li className="flex items-start text-slate-300 text-sm">
                                    <Check className="h-5 w-5 text-emerald-400 mr-3 shrink-0 mt-0.5" />
                                    <span><strong>Industry Benchmarking:</strong> Contextualize your performance against the Top 10% of Fortune 500 CEOs via the Strategic Radar.</span>
                                </li>
                                <li className="flex items-start text-slate-300 text-sm">
                                    <Activity className="h-5 w-5 text-emerald-400 mr-3 shrink-0 mt-0.5" />
                                    <span><strong>Priority Processing:</strong> Jump the neural queue for lightning-fast results during time-sensitive media cycles.</span>
                                </li>
                            </ul>
                        </CardContent>

                        <CardFooter className="pt-6 border-t border-slate-800">
                            <Button
                                onClick={handleCheckoutSub}
                                disabled={loadingSub}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base py-6 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all"
                            >
                                {loadingSub ? "Establishing Uplink..." : "Subscribe to Pro"}
                            </Button>
                        </CardFooter>
                    </Card>

                </div>
            </div>
        </div>
    );
}
