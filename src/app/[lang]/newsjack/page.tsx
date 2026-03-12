import { GlobalFooter } from "@/components/global-footer";
import { NewsJackForm } from "@/components/newsjack-form";

export default function NewsJackPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col items-center justify-center relative overflow-hidden">
            <main className="w-full max-w-5xl px-6 relative z-10 flex flex-col items-center justify-center pt-8 flex-1">
                <div className="w-full text-center space-y-8 mb-16 relative z-10 pt-10">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1] max-w-4xl mx-auto">
                        News Jack <span className="text-emerald-500">Generator</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Generate high-impact 800x800 analysis cards for X (Twitter).
                    </p>
                    <div className="pt-6 pb-2 max-w-xl mx-auto w-full relative z-20">
                        <NewsJackForm />
                    </div>
                </div>
            </main>
            <GlobalFooter />
        </div>
    );
}
