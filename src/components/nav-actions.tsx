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
    const pricingShort = currentLang === "ja" ? "料金" : "Pricing";

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setIsLoggedIn(!!user);
        });
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsLoggedIn(!!session?.user);
        });
        return () => subscription.unsubscribe();
    }, []);

    return (
        <div className="flex items-center gap-1.5 sm:gap-3">
            <LanguageSwitcher currentLang={currentLang} />

            {isLoggedIn ? (
                // Logged-in: Command Center link
                <Link
                    href={`/${currentLang}/dashboard`}
                    className="flex items-center gap-1.5 text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-full border border-emerald-200 hover:bg-emerald-100 transition-all shadow-sm min-h-[40px] whitespace-nowrap"
                >
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span className="hidden sm:inline">{dict.terminalAccess}</span>
                </Link>
            ) : (
                // Not logged in: Login icon + Pricing text
                <>
                    <Link
                        href={`/${currentLang}/login`}
                        className="flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors p-2.5 rounded-full hover:bg-slate-100 min-h-[40px] min-w-[40px] justify-center"
                        title={loginLabel}
                    >
                        <LogIn className="w-4 h-4 shrink-0" />
                        <span className="hidden sm:inline">{loginLabel}</span>
                    </Link>
                    <Link
                        href={`/${currentLang}/pricing`}
                        className="flex items-center justify-center text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors px-3 py-2 rounded-full hover:bg-slate-200/50 min-h-[40px] whitespace-nowrap"
                    >
                        <span className="sm:hidden">{pricingShort}</span>
                        <span className="hidden sm:inline">{dict.pricing}</span>
                    </Link>
                </>
            )}
        </div>
    );
}
