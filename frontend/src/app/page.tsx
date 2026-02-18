import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// Removed Plus as it is not used directly here anymore
import { Video, PlayCircle, BarChart3, ChevronRight } from "lucide-react";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NewAnalysisForm } from "@/components/new-analysis-form";

export default async function Dashboard() {
  const cookieStore = await cookies(); // Await cookies() for Next.js 15+

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
    .limit(10);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="rounded-md bg-primary p-1">
              <Video className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">ExecComms Ninja</span>
          </div>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" size="sm">Log in</Button>
            <Button size="sm">Get Started</Button>
          </nav>
        </div>
      </header>

      <main className="container py-10 space-y-10">

        {/* Hero / New Analysis Section */}
        <section className="mx-auto max-w-2xl text-center space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Master Your Executive Presence
          </h1>
          <p className="text-muted-foreground text-lg">
            AI-powered analysis of your communication style, tone, and body language.
          </p>

          <Card className="p-1 border-muted/40 shadow-xl">
            <CardContent className="p-4">
              <NewAnalysisForm />
            </CardContent>
          </Card>
        </section>

        {/* Recent Analyses Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Recent Analyses</h2>
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {analyses?.map((analysis) => (
              <Link href={`/analysis/${analysis.id}`} key={analysis.id}>
                <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer group border-muted/40 overflow-hidden">
                  <div className="aspect-video bg-muted relative">
                    {/* Placeholder for thumbnail */}
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20 group-hover:text-primary transition-colors">
                      <PlayCircle className="h-12 w-12" />
                    </div>
                    {/* We could use ytimg if we extracted video ID */}
                    <img
                      src={`https://img.youtube.com/vi/${analysis.youtube_url?.split('v=')[1]?.split('&')[0]}/maxresdefault.jpg`}
                      alt={analysis.video_title}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                    />
                  </div>
                  <CardHeader className="pb-2 space-y-1">
                    <CardTitle className="leading-tight truncate">{analysis.video_title || "Untitled Video"}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium uppercase tracking-wider ${analysis.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                          analysis.status === 'failed' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'
                        }`}>
                        {analysis.status}
                      </span>
                      <span>•</span>
                      <span>{new Date(analysis.created_at).toLocaleDateString()}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <BarChart3 className="h-4 w-4" />
                        <span>Score: {analysis.analysis_results?.metrics?.confidence || "--"}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}

            {(!analyses || analyses.length === 0) && (
              <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/20 rounded-lg border border-dashed border-border">
                <p>No analyses found. Start your first one above!</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
