"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Check, Zap, Shield, Sparkles } from "lucide-react";

// Initialize Stripe (dummy key for UI demonstration if env var is missing)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_dummy");

export default function PricingPage() {
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        setLoading(true);
        // We will call our FastAPI backend to generate a Stripe Checkout Session URL later.
        console.log("Initiating Stripe Checkout...");
        setTimeout(() => {
            setLoading(false);
            alert("Checkout flow will be triggered here natively via Stripe.");
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">

            {/* Ambient Background Glow */}
            <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-5xl">
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                        Unlock <span className="text-emerald-400">Executive Precision</span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Elevate your communication with unlimited AI-driven co-watching, high-fidelity PDF exports, and deep neural analysis.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Free Tier */}
                    <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
                        <CardHeader>
                            <CardTitle className="text-2xl text-slate-100">Standard Agent</CardTitle>
                            <CardDescription className="text-slate-400">Basic insights for occasional use.</CardDescription>
                            <div className="mt-4 flex items-baseline text-white">
                                <span className="text-4xl font-extrabold tracking-tight">$0</span>
                                <span className="ml-1 text-xl font-medium text-slate-500">/month</span>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 mt-4">
                            <ul className="space-y-3">
                                <li className="flex items-center text-slate-300">
                                    <Check className="h-5 w-5 text-emerald-500 mr-2 shrink-0" />
                                    3 Analysis Sessions per month
                                </li>
                                <li className="flex items-center text-slate-300">
                                    <Check className="h-5 w-5 text-emerald-500 mr-2 shrink-0" />
                                    Basic Metadata Extraction
                                </li>
                                <li className="flex items-center text-slate-500">
                                    <Shield className="h-5 w-5 mr-2 shrink-0" />
                                    Standard Web Export Only
                                </li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800">
                                Current Plan
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Pro Tier (Highlighted) */}
                    <Card className="bg-slate-900 border-emerald-500/50 relative overflow-hidden shadow-2xl shadow-emerald-900/20">
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600" />
                        <CardHeader>
                            <div className="flex justify-between items-center mb-2">
                                <CardTitle className="text-2xl text-emerald-400 flex items-center gap-2">
                                    <Zap className="h-5 w-5 text-emerald-400" fill="currentColor" />
                                    Ninja Pro
                                </CardTitle>
                                <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/20">
                                    MOST POPULAR
                                </span>
                            </div>
                            <CardDescription className="text-slate-400">Unlimited power for serious professionals.</CardDescription>
                            <div className="mt-4 flex items-baseline text-white">
                                <span className="text-4xl font-extrabold tracking-tight">$29</span>
                                <span className="ml-1 text-xl font-medium text-slate-500">/month</span>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 mt-4">
                            <ul className="space-y-3">
                                <li className="flex items-center text-slate-100">
                                    <Check className="h-5 w-5 text-emerald-500 mr-2 shrink-0" />
                                    Unlimited Analysis Sessions
                                </li>
                                <li className="flex items-center text-slate-100">
                                    <Check className="h-5 w-5 text-emerald-500 mr-2 shrink-0" />
                                    Ninja Co-Watching Visual Analytics
                                </li>
                                <li className="flex items-center text-slate-100">
                                    <Check className="h-5 w-5 text-emerald-500 mr-2 shrink-0" />
                                    Premium PDF & CSV Exports
                                </li>
                                <li className="flex items-center text-slate-100 items-start">
                                    <Sparkles className="h-5 w-5 text-emerald-500 mr-2 shrink-0 mt-0.5" />
                                    Advanced "Strategic Radar" Sentiment
                                </li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button
                                onClick={handleCheckout}
                                disabled={loading}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]"
                            >
                                {loading ? "Connecting..." : "Upgrade to Pro"}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
