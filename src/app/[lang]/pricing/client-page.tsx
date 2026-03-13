"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Check, ShieldAlert, Sparkles, Target, Zap, Activity, Download } from "lucide-react";
import { GlobalFooter } from "@/components/global-footer";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_dummy");

export function PricingClient({ lang, dict }: { lang: string, dict: any }) {
    const [loadingOneTime, setLoadingOneTime] = useState(false);
    const [loadingSub, setLoadingSub] = useState(false);
    const router = useRouter();

    const handleCheckout = async (tier: "one_time" | "subscription") => {
        const setLoading = tier === "one_time" ? setLoadingOneTime : setLoadingSub;
        setLoading(true);
        try {
            if (typeof window !== "undefined") {
                // If ja, use the ja-specific tiers
                const finalTier = lang === "ja" ? `${tier}_ja` : tier;
                sessionStorage.setItem("selected_pricing_tier", finalTier);
            }
            router.push(`/${lang}/register`);
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
            <div className="fixed top-0 left-0 w-full z-50 px-4 sm:px-6 py-4 flex items-center justify-start pointer-events-auto">
                <Button variant="ghost" asChild className="bg-white/50 hover:bg-white/80 backdrop-blur-md flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors shadow-sm rounded-full px-5 py-6 sm:px-4 sm:py-2 border border-slate-200/50 min-h-[44px]">
                    <a href={`/${lang}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
                        {dict.nav.backToHome}
                    </a>
                </Button>
            </div>

            <div className="relative z-10 w-full max-w-5xl pt-20 pb-16">
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                        {dict.pricing.title1} <br className="md:hidden" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                            {dict.pricing.title2}
                        </span>
                    </h1>
                    <p className="text-slate-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                        {dict.pricing.subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">

                    {/* Single Deep Dive */}
                    <Card className="bg-white/80 border-slate-200 backdrop-blur-xl shadow-xl flex flex-col">
                        <CardHeader className="pb-8">
                            <CardTitle className="text-2xl text-slate-900 font-bold flex items-center gap-2">
                                <Target className="h-6 w-6 text-emerald-600" />
                                {dict.pricing.tactical.title}
                            </CardTitle>
                            <CardDescription className="text-slate-500 text-sm mt-2 leading-relaxed h-10">
                                {dict.pricing.tactical.desc}
                            </CardDescription>
                            <div className="mt-6 flex items-baseline text-slate-900">
                                <span className={lang === 'ja' ? 'text-4xl font-black tracking-tighter' : 'text-5xl font-black tracking-tighter'}>{dict.pricing.tactical.price}</span>
                                <span className="ml-2 text-sm font-semibold text-slate-500 uppercase tracking-widest">{dict.pricing.tactical.interval}</span>
                            </div>
                            <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-widest bg-emerald-50 w-fit px-3 py-1 rounded-full border border-emerald-100">
                                <Zap className="h-3 w-3" /> {dict.pricing.tactical.badge}
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4 flex-grow">
                            <p className="font-semibold text-slate-800 text-sm border-b border-slate-100 pb-2 mb-4">{dict.pricing.tactical.includes}</p>
                            <ul className="space-y-4">
                                <li className="flex items-start text-slate-700 text-sm">
                                    <Check className="h-5 w-5 text-emerald-500 mr-3 shrink-0 mt-0.5" />
                                    <span>{dict.pricing.tactical.f1}</span>
                                </li>
                                <li className="flex items-start text-slate-700 text-sm">
                                    <Check className="h-5 w-5 text-emerald-500 mr-3 shrink-0 mt-0.5" />
                                    <span>{dict.pricing.tactical.f2}</span>
                                </li>
                                <li className="flex items-start text-slate-700 text-sm">
                                    <Check className="h-5 w-5 text-emerald-500 mr-3 shrink-0 mt-0.5" />
                                    <span>{dict.pricing.tactical.f3}</span>
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
                                {loadingOneTime ? dict.pricing.tactical.buttonLoading : dict.pricing.tactical.button}
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
                                    {dict.pricing.pro.title}
                                </CardTitle>
                                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-500/30">
                                    {dict.pricing.pro.badge}
                                </span>
                            </div>
                            <CardDescription className="text-slate-400 text-sm mt-2 leading-relaxed h-10">
                                {dict.pricing.pro.desc}
                            </CardDescription>
                            <div className="mt-6 flex items-baseline text-white">
                                <span className={lang === 'ja' ? 'text-4xl font-black tracking-tighter' : 'text-5xl font-black tracking-tighter'}>{dict.pricing.pro.price}</span>
                                <span className="ml-2 text-sm font-semibold text-slate-500 uppercase tracking-widest">{dict.pricing.pro.interval}</span>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4 flex-grow">
                            <p className="font-semibold text-slate-300 text-sm border-b border-slate-800 pb-2 mb-4">{dict.pricing.pro.includes}</p>
                            <ul className="space-y-4">
                                <li className="flex items-start text-slate-300 text-sm">
                                    <Sparkles className="h-5 w-5 text-emerald-400 mr-3 shrink-0 mt-0.5" />
                                    <span>{dict.pricing.pro.f1}</span>
                                </li>
                                <li className="flex items-start text-slate-300 text-sm">
                                    <Check className="h-5 w-5 text-emerald-400 mr-3 shrink-0 mt-0.5" />
                                    <span>{dict.pricing.pro.f2}</span>
                                </li>
                                <li className="flex items-start text-slate-300 text-sm">
                                    <Activity className="h-5 w-5 text-emerald-400 mr-3 shrink-0 mt-0.5" />
                                    <span>{dict.pricing.pro.f3}</span>
                                </li>
                                <li className="flex items-start text-slate-300 text-sm">
                                    <Download className="h-5 w-5 text-emerald-400 mr-3 shrink-0 mt-0.5" />
                                    <span>{dict.pricing.pro.f4}</span>
                                </li>
                            </ul>
                        </CardContent>

                        <CardFooter className="pt-6 border-t border-slate-800">
                            <Button
                                onClick={handleCheckoutSub}
                                disabled={loadingSub}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base py-6 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all"
                            >
                                {loadingSub ? dict.pricing.pro.buttonLoading : dict.pricing.pro.button}
                            </Button>
                        </CardFooter>
                    </Card>

                </div>
            </div>
            <GlobalFooter />
        </div>
    );
}
