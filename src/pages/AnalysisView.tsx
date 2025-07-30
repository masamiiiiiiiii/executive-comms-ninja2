import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import AnalysisResults from "@/components/AnalysisResults";

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
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading analysis...</span>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Analysis Not Found</h1>
          <p className="text-muted-foreground mb-6">The requested analysis could not be found.</p>
          <Button onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
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
      </div>
    </div>
  );
};

export default AnalysisView;