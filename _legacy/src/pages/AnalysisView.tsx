import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import AnalysisResults from "@/components/AnalysisResults";
import SynchronizedAnalysis from "@/components/video-analysis/SynchronizedAnalysis";

interface AnalysisData {
  id: string;
  video_title: string;
  youtube_url: string;
  company: string;
  role: string;
  target_person: string;
  video_duration_hours: number;
  analysis_results: any;
  created_at: string;
}

const AnalysisView = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && user) {
      loadAnalysis();
    }
  }, [id, user]);

  const loadAnalysis = async () => {
    try {
      const { data, error } = await supabase
        .from('video_analyses')
        .select('*')
        .eq('id', id)
        .eq('user_id', user?.id)
        .single();

      if (error) {
        console.error('Error loading analysis:', error);
        toast({
          title: "Error",
          description: "Failed to load analysis. Please try again.",
          variant: "destructive",
        });
        navigate('/dashboard');
        return;
      }

      setAnalysis(data);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-white">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-lg font-medium tracking-tight">Loading Executive Analysis...</span>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Analysis Not Found</h1>
          <p className="text-neutral-400 mb-6">The requested analysis could not be found.</p>
          <Button onClick={() => navigate('/dashboard')} variant="outline" className="border-neutral-800 hover:bg-neutral-800 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-primary/30">
      {/* Navigation Header */}
      <div className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="text-neutral-400 hover:text-white hover:bg-white/5"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
          <div className="text-sm font-medium text-neutral-400 truncate max-w-md">
            {analysis.video_title}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero Section: Synchronized Analysis */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-neutral-500 bg-clip-text text-transparent mb-2">
              Executive Performance Lab
            </h1>
            <p className="text-neutral-400">
              Real-time analysis of communication dynamics
            </p>
          </div>

          <SynchronizedAnalysis
            videoUrl={analysis.youtube_url}
            videoTitle={analysis.video_title}
            initialAnalysisData={analysis.analysis_results}
          />
        </section>

        {/* Deep Dive Section: Detailed Report */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <h2 className="text-xl font-semibold text-neutral-300">Detailed Report</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          <AnalysisResults
            videoTitle={analysis.video_title}
            videoUrl={analysis.youtube_url}
            analysisDetails={{
              company: analysis.company,
              role: analysis.role,
              intervieweeName: analysis.target_person,
              targetPerson: analysis.target_person
            }}
            analysisResults={analysis.analysis_results}
          />
        </section>
      </div>
    </div>
  );
};

export default AnalysisView;