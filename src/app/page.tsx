import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, PlayCircle, BarChart3, ChevronRight, Activity, ArrowRight } from "lucide-react";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NewAnalysisForm } from "@/components/new-analysis-form";
import { Badge } from "@/components/ui/badge";

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
        <div>
          {/* Future Auth Buttons */}
        </div>
      </nav>

      <main className="w-full max-w-5xl px-6 relative z-10 grid lg:grid-cols-5 gap-12 items-center">

        {/* Left: Hero & Input */}
        <div className="lg:col-span-3 text-left space-y-8">
          <div className="space-y-4">
            <Badge variant="outline" className="bg-white/50 backdrop-blur border-emerald-200 text-emerald-700 px-3 py-1 text-sm font-medium">
              AI-Powered Executive Coaching
            </Badge>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Master Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                Executive Presence
              </span>
            </h1>
            <p className="text-lg text-slate-600 max-w-lg leading-relaxed">
              Analyze your communication style, tone, and impact with C-suite level precision.
              Get actionable feedback instantly.
            </p>
          </div>

          <div className="bg-white p-2 rounded-2xl shadow-xl border border-slate-100/50 ring-4 ring-slate-100/50">
            <NewAnalysisForm />
          </div>

          <div className="flex items-center gap-6 text-sm text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full" /> Instant Analysis
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full" /> Privacy First
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full" /> Deep Insights
            </div>
          </div>
        </div>

        {/* Right: Recent Results (Mini-Feed) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-sm font-bold uppercase text-slate-400 tracking-widest">Recent Reports</h2>
            <Link href="#" className="text-xs font-medium text-emerald-600 hover:underline flex items-center gap-1">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid gap-3">
            {analyses?.map((analysis) => (
              <Link href={`/analysis/${analysis.id}`} key={analysis.id}>
                <div className="group bg-white rounded-xl p-3 border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex gap-3 cursor-pointer">
                  <div className="shrink-0 h-16 w-24 bg-slate-100 rounded-lg overflow-hidden relative">
                    {/* Thumbnail */}
                    <img
                      src={`https://img.youtube.com/vi/${analysis.youtube_url?.split('v=')[1]?.split('&')[0]}/mqdefault.jpg`}
                      alt=""
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-transparent transition-colors">
                      <PlayCircle className="h-6 w-6 text-white drop-shadow-md" />
                    </div>
                  </div>
                  <div className="flex flex-col justify-center min-w-0">
                    <h3 className="font-bold text-slate-800 text-sm truncate pr-2 group-hover:text-emerald-700 transition-colors">
                      {analysis.video_title || "Untitled Analysis"}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-[10px] h-4 px-1 bg-slate-100 text-slate-500">{new Date(analysis.created_at).toLocaleDateString()}</Badge>
                      {analysis.analysis_results?.metrics?.confidence && (
                        <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                          <Activity className="h-3 w-3" /> {analysis.analysis_results.metrics.confidence}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {(!analyses || analyses.length === 0) && (
              <div className="text-center py-8 text-slate-400 text-sm bg-slate-100/50 rounded-xl border border-dashed border-slate-200">
                No recent analyses.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
