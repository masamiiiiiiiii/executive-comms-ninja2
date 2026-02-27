import Link from "next/link";

export function GlobalFooter({ theme = "light" }: { theme?: "light" | "dark" }) {
    const isDark = theme === "dark";
    const textColor = isDark ? "text-slate-400" : "text-slate-500";
    const headingColor = isDark ? "text-slate-200" : "text-slate-800";
    const borderColor = isDark ? "border-slate-800/50" : "border-slate-200/50";
    const buttonBg = isDark ? "bg-slate-900 border-slate-700 hover:bg-slate-800 text-slate-200" : "bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-800";
    const linkHover = isDark ? "hover:text-emerald-400" : "hover:text-emerald-600";

    return (
        <footer className={`w-full max-w-5xl px-6 mx-auto relative z-10 flex flex-col items-center justify-center pt-12 pb-8 border-t ${borderColor} mt-12`}>
            <div className="flex flex-col items-center gap-4 max-w-2xl text-center">
                <span className={`font-bold tracking-tight text-xl mb-2 ${headingColor}`}>ExecComms Ninja</span>
                <p className={`text-sm font-medium leading-relaxed ${textColor}`}>
                    Follow <a href="https://x.com/ExecCommsNinja" target="_blank" rel="noopener noreferrer" className={`underline underline-offset-2 hover:text-emerald-400 transition-colors`}>@ExecCommsNinja</a> on X for continuous executive intelligence and platform updates. 
                    <br />Please direct all inquiries and support requests to our official DMs.
                </p>
                <a 
                    href="https://x.com/ExecCommsNinja" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`inline-flex items-center gap-2 font-bold transition-all px-6 py-3 rounded-full border shadow-sm mt-4 ${buttonBg}`}
                >
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                    </svg>
                    DM us on X (@ExecCommsNinja)
                </a>
            </div>
            
            <div className={`flex flex-wrap gap-4 md:gap-8 mt-10 w-full border-t ${borderColor} pt-6 justify-center items-center`}>
                <Link href="/legal" className={`text-xs font-medium transition-colors ${textColor} ${linkHover}`}>Terms of Service</Link>
                <Link href="/legal" className={`text-xs font-medium transition-colors ${textColor} ${linkHover}`}>Privacy Policy</Link>
                <Link href="/legal/tokushoho" className={`text-xs font-medium transition-colors whitespace-nowrap ${textColor} ${linkHover}`}>特定商取引法に基づく表記</Link>
                <Link href="/legal" className={`text-xs font-medium transition-colors ${textColor} ${linkHover}`}>FAQ & Support</Link>
            </div>
        </footer>
    );
}
