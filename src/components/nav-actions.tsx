"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";

export function NavActions() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isUnlocked, setIsUnlocked] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            // Check for payment success redirect
            if (searchParams?.get("payment_success") === "true") {
                sessionStorage.setItem("ninja_pro_unlocked", "true");
                toast.success("Transaction Secure. Executive Pro unlocked.", { duration: 5000 });

                // Clean the URL
                window.history.replaceState({}, document.title, window.location.pathname);

                // Redirect straight to dashboard
                setTimeout(() => {
                    router.push("/dashboard");
                }, 1000);
            }

            // Check existing state
            if (sessionStorage.getItem("ninja_pro_unlocked") === "true") {
                setIsUnlocked(true);
            }
        }
    }, [searchParams, router]);

    return (
        <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/pricing" className="flex items-center justify-center text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors px-5 py-3 sm:px-4 sm:py-2 rounded-full hover:bg-slate-200/50 active:bg-slate-200 min-h-[44px] min-w-[80px]">
                Pricing
            </Link>
            {isUnlocked && (
                <Link
                    href="/dashboard"
                    className="flex items-center gap-2 text-sm font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200 hover:bg-emerald-100 hover:scale-105 transition-all shadow-sm"
                >
                    <ShieldCheck className="w-4 h-4" />
                    Terminal Access
                </Link>
            )}
        </div>
    );
}
