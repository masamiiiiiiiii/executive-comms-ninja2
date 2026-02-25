"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Activity, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

function SuccessContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams?.get("session_id");

    useEffect(() => {
        if (typeof window !== "undefined") {
            sessionStorage.setItem("ninja_pro_unlocked", "true");
        }
    }, []);

    return (
        <div className="relative z-10 w-full max-w-2xl text-center space-y-8">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-24 h-24 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.3)] mb-8"
            >
                <CheckCircle2 className="h-12 w-12 text-emerald-500" />
            </motion.div>

            <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                    Intelligence Unlocked
                </h1>
                <p className="text-slate-600 text-lg leading-relaxed max-w-xl mx-auto">
                    Your transaction was successful. You now have full access to high-fidelity neural analysis and executive-ready export capabilities.
                </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm border border-slate-200 rounded-xl p-6 shadow-sm text-left max-w-md mx-auto">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Transaction Details</p>
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Status</span>
                        <span className="font-semibold text-emerald-600 flex items-center gap-1">
                            <ShieldCheck className="h-4 w-4" /> SECURE
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-sm border-t border-slate-100 pt-3">
                        <span className="text-slate-600">Session ID</span>
                        <span className="font-mono text-slate-400 text-xs">{sessionId || "demo_checkout_verification"}</span>
                    </div>
                </div>
            </div>

            <div className="pt-8">
                <Link href="/">
                    <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-6 h-auto text-base rounded-full shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] hover:-translate-y-0.5 transition-all">
                        Return to Command Center <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </Link>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs font-mono text-slate-400 pt-8 mt-8 border-t border-slate-200/50">
                <Activity className="h-3 w-3" />
                <span>Uplink established. Connection encrypted.</span>
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 opacity-50">
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-200/40 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/40 blur-[120px] rounded-full" />
            </div>

            <Suspense fallback={<div className="text-emerald-500 animate-pulse font-mono flex items-center gap-2"><Activity className="h-5 w-5 animate-spin" /> Verifying Transaction Security...</div>}>
                <SuccessContent />
            </Suspense>
        </div>
    );
}
