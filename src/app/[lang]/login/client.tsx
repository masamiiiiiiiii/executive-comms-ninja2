"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { ShieldCheck, Mail, Lock, Loader2, ArrowRight, Video } from "lucide-react";
import Link from "next/link";

const text: Record<string, Record<string, string>> = {
    en: {
        title: "Executive-Comms",
        subtitle: "Sign in to your Command Center",
        email: "Email address",
        password: "Password",
        signIn: "Sign In",
        signingIn: "Authenticating...",
        noAccount: "Don't have an account?",
        register: "Get access",
        forgotPassword: "Forgot password?",
        errorInvalid: "Invalid email or password.",
        errorGeneric: "Authentication failed. Please try again.",
    },
    ja: {
        title: "Executive-Comms",
        subtitle: "コマンドセンターにサインイン",
        email: "メールアドレス",
        password: "パスワード",
        signIn: "サインイン",
        signingIn: "認証中...",
        noAccount: "アカウントをお持ちでない方は",
        register: "アクセスを取得",
        forgotPassword: "パスワードをお忘れの方",
        errorInvalid: "メールアドレスまたはパスワードが正しくありません。",
        errorGeneric: "認証に失敗しました。もう一度お試しください。",
    },
};

export function LoginClient({ lang, dict }: { lang: string; dict: any }) {
    const t = text[lang] || text["en"];
    const router = useRouter();
    const supabase = createClient();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });

            if (error) {
                toast.error(error.message.includes("Invalid") ? t.errorInvalid : t.errorGeneric);
                setLoading(false);
                return;
            }

            const userId = data.user?.id;
            if (!userId) { setLoading(false); return; }

            // Check profile tier
            const { data: profile } = await supabase
                .from("profiles")
                .select("tier")
                .eq("id", userId)
                .single();

            const tier = profile?.tier;

            if (!tier) {
                // No purchase yet → go to pricing
                router.push(`/${lang}/pricing`);
            } else {
                // Any paid tier → dashboard
                router.push(`/${lang}/dashboard`);
            }
        } catch {
            toast.error(t.errorGeneric);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-emerald-500/8 blur-[120px] rounded-full" />
            </div>

            <div className="w-full max-w-sm relative z-10">
                {/* Logo */}
                <div className="flex flex-col items-center mb-10">
                    <div className="h-12 w-12 bg-emerald-600 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)] mb-4">
                        <Video className="h-6 w-6 text-white" />
                    </div>
                    <h1 className="text-xl font-bold text-white tracking-tight">{t.title}</h1>
                    <p className="text-slate-400 text-sm mt-1">{t.subtitle}</p>
                </div>

                {/* Card */}
                <form
                    onSubmit={handleLogin}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-5"
                >
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Mail className="h-3 w-3" /> {t.email}
                        </label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                            placeholder="you@company.com"
                            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-600 focus:border-emerald-500 focus:ring-emerald-500/20 h-11"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Lock className="h-3 w-3" /> {t.password}
                        </label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                            placeholder="••••••••"
                            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-600 focus:border-emerald-500 focus:ring-emerald-500/20 h-11"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading || !email || !password}
                        className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:scale-[1.02] gap-2 mt-2"
                    >
                        {loading ? (
                            <><Loader2 className="h-4 w-4 animate-spin" /> {t.signingIn}</>
                        ) : (
                            <><ShieldCheck className="h-4 w-4" /> {t.signIn} <ArrowRight className="h-4 w-4 ml-auto" /></>
                        )}
                    </Button>
                </form>

                {/* Footer links */}
                <div className="mt-6 text-center space-y-3">
                    <p className="text-slate-500 text-sm">
                        {t.noAccount}{" "}
                        <Link href={`/${lang}/pricing`} className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
                            {t.register}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
