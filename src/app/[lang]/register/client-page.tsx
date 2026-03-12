"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ShieldCheck, Activity, BrainCircuit, CheckCircle2, Lock, Mail, KeyRound, AlertTriangle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { NinjaIntelligenceIndicator } from "@/components/v2/ninja-indicator";
import { GlobalFooter } from "@/components/global-footer";

export function RegisterClient({ lang, dict }: { lang: string, dict: any }) {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    // PR / Executive themed Verification Questions from Dictionary
    const VERIFICATION_QUESTIONS = [
        {
            question: dict.register.questions[0].q,
            options: [
                dict.register.questions[0].o1,
                dict.register.questions[0].o2,
                dict.register.questions[0].o3
            ],
            correctIndex: 1
        },
        {
            question: dict.register.questions[1].q,
            options: [
                dict.register.questions[1].o1,
                dict.register.questions[1].o2,
                dict.register.questions[1].o3
            ],
            correctIndex: 2
        },
        {
            question: dict.register.questions[2].q,
            options: [
                dict.register.questions[2].o1,
                dict.register.questions[2].o2,
                dict.register.questions[2].o3
            ],
            correctIndex: 0
        }
    ];

    // Quiz State
    const [quizQuestion, setQuizQuestion] = useState(VERIFICATION_QUESTIONS[0]);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isHumanVerified, setIsHumanVerified] = useState(false);
    const [failedAttempts, setFailedAttempts] = useState(0);
    const [isLocked, setIsLocked] = useState(false);

    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        // Select a random question on mount
        const randomQ = VERIFICATION_QUESTIONS[Math.floor(Math.random() * VERIFICATION_QUESTIONS.length)];
        setQuizQuestion(randomQ);
    }, []);

    const validatePassword = (pass: string) => {
        if (pass.length < 8) return dict.register.passwordHint;
        if (!/[a-zA-Z]/.test(pass)) return dict.register.passwordHint;
        if (!/[0-9]/.test(pass)) return dict.register.passwordHint;
        if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(pass)) return dict.register.passwordHint;
        return "";
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setPassword(val);
        if (val) {
            setPasswordError(validatePassword(val));
        } else {
            setPasswordError("");
        }
    };

    const handleOptionSelect = (index: number) => {
        if (isHumanVerified || isLocked) return;
        setSelectedOption(index);

        if (index === quizQuestion.correctIndex) {
            setIsHumanVerified(true);
            toast.success("Security Clearance Granted. Humanity Verified.", { icon: <ShieldCheck className="h-4 w-4 text-emerald-500" /> });
        } else {
            if (failedAttempts === 0) {
                toast.error("Incorrect. 1 attempt remaining. Decoupling imminent.", { duration: 4000 });
                setFailedAttempts(1);
                setSelectedOption(null);

                // Cycle to a different question
                const remaining = VERIFICATION_QUESTIONS.filter(q => q.question !== quizQuestion.question);
                setQuizQuestion(remaining[Math.floor(Math.random() * remaining.length)]);
            } else {
                toast.error("Protocol Failed. Access Denied.", { duration: Infinity });
                setIsLocked(true);
            }
        }
    };

    const handleCheckoutDirect = async () => {
        const error = validatePassword(password);
        if (error) {
            setPasswordError(error);
            toast.error("Invalid Security Credentials.");
            return;
        }
        if (!isHumanVerified) {
            toast.error(dict.register.toastVerificationFailed);
            return;
        }
        if (!email.includes("@")) {
            toast.error(dict.register.toastEmailInvalid);
            return;
        }

        setIsProcessing(true);
        try {
            const tier = typeof window !== "undefined" ? (sessionStorage.getItem("selected_pricing_tier") || "one_time") : "one_time";

            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
            const res = await fetch(`${baseUrl}/stripe/create-checkout-session`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: email, // Passing email as reference for now
                    tier: tier,
                    success_url: `${window.location.origin}/?payment_success=true`,
                    cancel_url: `${window.location.origin}/${lang}/pricing`
                })
            });
            const data = await res.json();
            if (data.checkout_url) {
                window.location.href = data.checkout_url;
            } else {
                throw new Error("No checkout URL returned.");
            }
        } catch (e) {
            console.error(e);
            toast.error(dict.register.toastUplinkFailed);
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden font-mono text-slate-200">
            {/* Background HUD Interface */}
            <div className="fixed inset-0 z-0 opacity-40 pointer-events-none flex items-center justify-center scale-[1.5]">
                <NinjaIntelligenceIndicator isObserving={true} />
            </div>

            {/* Top Navigation */}
            <div className="fixed top-0 left-0 w-full z-50 px-4 sm:px-6 py-4 flex items-center justify-start pointer-events-auto">
                <Button variant="ghost" asChild className="bg-slate-900/50 hover:bg-slate-800 backdrop-blur-md flex items-center text-sm font-medium text-slate-300 hover:text-white transition-colors shadow-sm rounded-full px-5 py-6 sm:px-4 sm:py-2 border border-slate-700/50 min-h-[44px]">
                    <a href={`/${lang}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
                        {dict.nav.backToHome}
                    </a>
                </Button>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-xl"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-slate-900 border border-emerald-500/30 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(16,185,129,0.15)] relative overflow-hidden">
                        <div className="absolute inset-0 bg-emerald-500/10 animate-pulse" />
                        <ShieldCheck className="h-8 w-8 text-emerald-400 relative z-10" />
                    </div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300 tracking-widest uppercase">
                        {dict.register.title}
                    </h1>
                    <p className="text-xs text-slate-500 mt-2 uppercase tracking-[0.2em]">{dict.register.subtitle}</p>
                </div>

                <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-800 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

                    <CardHeader className="space-y-1 pb-4 border-b border-slate-800/50">
                        <CardTitle className="text-lg text-slate-200 flex items-center gap-2">
                            <Lock className="w-4 h-4 text-emerald-500" /> {dict.register.credentials}
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-400">{dict.register.credentialsDesc}</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6 pt-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Mail className="w-3 h-3" /> {dict.register.email}
                                </label>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={dict.register.emailPlaceholder}
                                    className="bg-slate-950/50 border-slate-800 text-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 placeholder:text-slate-700 h-12"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <KeyRound className="w-3 h-3" /> {dict.register.password}
                                    </label>
                                    <span className="text-[10px] text-slate-500">{dict.register.passwordHint}</span>
                                </div>
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    placeholder="••••••••"
                                    className={`bg-slate-950/50 text-slate-200 focus:ring-emerald-500/20 placeholder:text-slate-700 h-12 ${passwordError ? 'border-amber-500/50 focus:border-amber-500' : 'border-slate-800 focus:border-emerald-500'}`}
                                />
                                <AnimatePresence>
                                    {passwordError && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="text-[10px] text-amber-500 flex items-start gap-1 mt-1"
                                        >
                                            <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                                            <span>{passwordError}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                {!passwordError && password.length > 0 && (
                                    <div className="text-[10px] text-emerald-500 flex items-center gap-1 mt-1">
                                        <CheckCircle2 className="w-3 h-3" /> {dict.register.passwordOk}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Human Verification Module */}
                        <div className="mt-8 pt-6 border-t border-slate-800/50">
                            <div className="flex items-center justify-between mb-4">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <BrainCircuit className={`w-4 h-4 ${isHumanVerified ? 'text-emerald-500' : isLocked ? 'text-red-500' : 'text-cyan-500 animate-pulse'}`} />
                                    {dict.register.humanVerif}
                                </label>
                                {isHumanVerified && <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded border border-emerald-500/30 uppercase tracking-widest">{dict.register.cleared}</span>}
                                {isLocked && <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-1 rounded border border-red-500/30 uppercase tracking-widest animate-pulse">{dict.register.locked}</span>}
                                {failedAttempts === 1 && !isLocked && !isHumanVerified && <span className="text-[10px] bg-amber-500/20 text-amber-500 px-2 py-1 rounded border border-amber-500/30 uppercase tracking-widest">{dict.register.attemptLeft}</span>}
                            </div>

                            <div className={`p-4 rounded-xl border ${isHumanVerified ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-slate-950/50 border-slate-800'} transition-colors duration-500`}>
                                <p className="text-sm text-slate-300 mb-4 leading-relaxed font-sans">{quizQuestion.question}</p>
                                <div className="space-y-2">
                                    {quizQuestion.options.map((option: string, idx: number) => {
                                        const isSelected = selectedOption === idx;
                                        const isCorrect = idx === quizQuestion.correctIndex;

                                        let btnStateClass = "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200";

                                        if (isHumanVerified) {
                                            if (isCorrect) btnStateClass = "bg-emerald-500/10 border-emerald-500/50 text-emerald-400";
                                            else btnStateClass = "bg-slate-950 border-slate-900 text-slate-700 opacity-50";
                                        } else if (isLocked) {
                                            if (isSelected) btnStateClass = "bg-red-500/10 border-red-500/50 text-red-500";
                                            else btnStateClass = "bg-slate-950 border-slate-900 text-slate-700 opacity-50";
                                        } else if (isSelected && !isCorrect) {
                                            btnStateClass = "bg-amber-500/10 border-amber-500/50 text-amber-500";
                                        }

                                        return (
                                            <Button
                                                key={idx}
                                                variant="outline"
                                                className={`w-full justify-start h-auto py-3 px-4 font-sans text-xs sm:text-sm whitespace-normal text-left transition-all ${btnStateClass}`}
                                                onClick={() => handleOptionSelect(idx)}
                                                disabled={isHumanVerified || isLocked}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={`w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center mt-0.5 ${isHumanVerified && isCorrect ? 'border-emerald-500 bg-emerald-500/20' : 'border-slate-700'}`}>
                                                        {isHumanVerified && isCorrect && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                                                    </div>
                                                    <span>{option}</span>
                                                </div>
                                            </Button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                    </CardContent>

                    <CardFooter className="bg-slate-950/50 pt-6 pb-6 border-t border-slate-800/50 flex flex-col gap-4">
                        <div className="text-[10px] text-slate-500 text-center px-4 leading-relaxed">
                            {dict.register.tosPre}
                            <Link href="/legal" target="_blank" className="text-emerald-500 hover:text-emerald-400 underline underline-offset-2">{dict.register.tos}</Link>
                            {dict.register.and}
                            <Link href="/legal" target="_blank" className="text-emerald-500 hover:text-emerald-400 underline underline-offset-2">{dict.register.privacy}</Link>
                            {dict.register.tosPost}
                        </div>

                        <Button
                            className={`w-full h-14 tracking-widest uppercase font-bold transition-all duration-500 ${isHumanVerified && email && !passwordError && password
                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
                            disabled={!isHumanVerified || !email || !!passwordError || !password || isProcessing}
                            onClick={handleCheckoutDirect}
                        >
                            {isProcessing ? (
                                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> {dict.register.btnProcessing}</>
                            ) : (
                                <><Activity className="mr-2 h-5 w-5" /> {dict.register.btnProceed}</>
                            )}
                        </Button>
                    </CardFooter>
                </Card>

                <div className="text-center mt-6">
                    <Button variant="link" className="text-xs text-slate-500 hover:text-slate-300" onClick={() => router.push(`/${lang}/pricing`)}>
                        {dict.register.abort}
                    </Button>
                </div>
            </motion.div>

            <div className="w-full mt-12 pb-8">
                <GlobalFooter theme="dark" />
            </div>
        </div>
    );
}
