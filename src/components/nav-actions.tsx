"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, LogIn } from "lucide-react";
import { LanguageSwitcher } from "./language-switcher";
import { createClient } from "@/lib/supabase/client";

export function NavActions({
    currentLang,
    dict
}: {
    currentLang: string,
    dict: { pricing: string, terminalAccess: string, login?: string }
}) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const supabase = createClient();

    const loginLabel = dict.login || (currentLang === "ja" ? "ログイン" : "Login");

    useEffect(() => {
        // Check Supabase session
        supabase.auth.getUser().then(({ data: { user } }) => {
            setIsLoggedIn(!!user);
        });

        // Also listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsLoggedIn(!!session?.user);
        });
        return () => subscription.unsubscribe();
    }, []);

    return (
        <div className="flex items-center gap-3 sm:gap-5">
            <LanguageSwitcher currentLang={currentLang} />

            {isLoggedIn ? (
                // Logged-in: show Command Center link
                <Link
                    href={`/${currentLang}/dashboard`}
                    className="flex items-center gap-2 text-sm font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200 hover:bg-emerald-100 hover:scale-105 transition-all shadow-sm min-h-[44px]"
                >
                    <ShieldCheck className="w-4 h-4" />
                    {dict.terminalAccess}
                </Link>
            ) : (
                // Not logged in: show Login + Pricing
                <>
                    <Link
                        href={`/${currentLang}/login`}
                        className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors px-3 py-2 rounded-full hover:bg-slate-100 min-h-[44px]"
                    >
                        <LogIn className="w-4 h-4" />
                        {loginLabel}
                    </Link>
                    <Link
                        href={`/${currentLang}/pricing`}
                        className="flex items-center justify-center text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors px-5 py-2 rounded-full hover:bg-slate-200/50 active:bg-slate-200 min-h-[44px]"
                    >
                        {dict.pricing}
                    </Link>
                </>
            )}
        </div>
    );
}
