import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, PlayCircle, BarChart3, ChevronRight, Activity, ArrowRight } from "lucide-react";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NewAnalysisForm } from "@/components/new-analysis-form";
import { Badge } from "@/components/ui/badge";
import { DemoCTA } from "@/components/demo-cta";
import { NavActions } from "@/components/nav-actions";

export default async function Dashboard() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Ignored
          }
        }
      },
    }
  );

  // Fetch recent analyses
  const { data: analyses } = await supabase
    .from("video_analyses")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(4);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col items-center justify-center relative overflow-hidden">

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-200/40 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/40 blur-[100px] rounded-full" />
      </div>

      <nav className="absolute top-0 w-full flex justify-between items-center p-6 z-10">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-sm">
            <Video className="h-5 w-5" />
          </div>
          <span className="font-bold text-slate-800 tracking-tight">ExecComms Ninja</span>
        </div>
        <div className="flex items-center gap-6">
          <Suspense fallback={<div className="w-20 h-8 animate-pulse bg-slate-200 rounded-full" />}>
            <NavActions />
          </Suspense>
        </div>
      </nav>

      <main className="w-full max-w-5xl px-6 relative z-10 flex flex-col items-center justify-center pt-8">
        {/* Hero Section */}
        <div className="w-full text-center space-y-8 mb-16 relative z-10 pt-10">
          <Badge variant="outline" className="bg-white/50 backdrop-blur border-emerald-200 text-emerald-700 px-4 py-1.5 text-sm font-bold uppercase tracking-widest shadow-sm">
            AI-Powered Executive Coaching
          </Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] max-w-4xl mx-auto">
            Master Your <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 line-clamp-2 pb-2">
              Executive Presence
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Elevate your media presence and leadership communication with C-suite level AI precision. Analyze tone, conviction, and strategic message delivery instantly.
          </p>

          <div className="pt-6 pb-2">
            <DemoCTA />
          </div>
          <p className="text-sm font-medium text-slate-500">
            Start with our interactive Jack Welch analysis — no credit card required.
          </p>
        </div>

        {/* Founder Story Section */}
        <div className="max-w-4xl mx-auto bg-white/60 backdrop-blur-xl border border-white p-8 md:p-12 rounded-3xl shadow-xl relative z-10 mb-20 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center justify-center flex-wrap gap-y-2 gap-x-3">
            <span>Designed by</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Executive Comms Ninja Logo" className="h-8 w-auto inline-block relative -top-0.5" />
          </h2>
          <div className="space-y-4 text-lg text-slate-700 leading-relaxed max-w-3xl mx-auto text-left">
            <p>
              This entire platform was engineered by a former Blue Bird PR professional operating out of the Far East.
            </p>
            <p>
              Drawing upon a wealth of knowledge forged in the high-stakes crucible of corporate risk management and executive media training, this AI distills the exact methodologies used to prepare global executives for the world's most aggressive press interviews.
            </p>
            <p>
              Our neural analysis acts as your personal, hyper-vigilant communications coach—detecting the subtle shifts in cadence, vocal authority, and emotional resonance that separate competent managers from legendary leaders.
            </p>
          </div>
        </div>

        {/* Custom Analysis Section Removed - Now Behind Paywall */}

        {/* Footer / Inquiry */}
        <footer className="w-full max-w-5xl px-6 relative z-10 flex flex-col items-center justify-center pt-8 border-t border-slate-200/50 mt-12">
          <div className="flex flex-col items-center gap-4">
            <span className="font-bold text-slate-800 tracking-tight text-xl mb-4">ExecComms Ninja</span>
            <p className="text-sm text-slate-500 font-medium text-center">
              For enterprise inquiries and support, please send a DM to our official X account.
            </p>
            <a href="https://x.com/ExecCommsNinja" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-slate-800 font-bold hover:text-black transition-colors bg-slate-100 px-6 py-3 rounded-full hover:bg-slate-200 border border-slate-200 shadow-sm mt-2">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
              DM us on X (@ExecCommsNinja)
            </a>
          </div>
          <div className="flex flex-wrap gap-4 md:gap-6 mt-8 w-full border-t border-slate-200 pt-6 justify-center items-center">
            <Link href="/legal" className="text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors">Terms of Service</Link>
            <Link href="/legal" className="text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors">Privacy Policy</Link>
            <Link href="/legal/tokushoho" className="text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors whitespace-nowrap">特定商取引法に基づく表記</Link>
            <Link href="/legal" className="text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors">FAQ & Support</Link>
          </div>
        </footer>
      </main>
    </div >
  );
}
