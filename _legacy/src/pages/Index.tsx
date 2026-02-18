import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, BarChart3, Users, Brain, ArrowLeft, Clock, LogOut, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AnalysisResults from "@/components/AnalysisResults";
import Layout from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "react-router-dom";

const Index = () => {
  const { user, session, loading: authLoading, signOut } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  const [userProfile, setUserProfile] = useState<any>(null);
  const [currentUsageHours, setCurrentUsageHours] = useState(0);
  const maxUsageHours = 100;

  const [step, setStep] = useState<"input" | "details" | "person" | "analyzing" | "results">("input");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [analysisDetails, setAnalysisDetails] = useState({
    company: "",
    role: "",
    intervieweeName: "",
    targetPerson: ""
  });
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  // Check if we have pre-loaded analysis results from navigation
  useEffect(() => {
    if (location.state?.analysisResults) {
      setAnalysisResults(location.state.analysisResults);
      setYoutubeUrl(location.state.youtubeUrl || "");
      setAnalysisDetails({
        company: location.state.company || "",
        role: location.state.role || "",
        intervieweeName: "",
        targetPerson: location.state.targetPerson || ""
      });
      setStep("results");
    }
  }, [location.state]);

  // Load user profile and usage data
  useEffect(() => {
    if (user && session) {
      loadUserProfile();
      loadUsageData();
    }
  }, [user, session]);

  const loadUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
        return;
      }

      if (data) {
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadUsageData = async () => {
    try {
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format

      const { data, error } = await supabase
        .from('usage_tracking')
        .select('total_hours_used')
        .eq('user_id', user?.id)
        .eq('month_year', currentMonth)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading usage:', error);
        return;
      }

      if (data) {
        setCurrentUsageHours(data.total_hours_used);
      }
    } catch (error) {
      console.error('Error loading usage:', error);
    }
  };

  const handleUrlSubmit = () => {
    if (youtubeUrl) {
      setStep("details");
    }
  };

  const handleDetailsSubmit = () => {
    if (analysisDetails.company && analysisDetails.role && analysisDetails.intervieweeName) {
      setStep("person");
    }
  };

  const handlePersonSubmit = () => {
    if (analysisDetails.targetPerson) {
      setStep("analyzing");
      performAnalysis();
    }
  };

  const performAnalysis = async () => {
    setAnalyzing(true);
    console.log("Queueing analysis for:", youtubeUrl);

    try {
      // 1. Create a pending analysis record
      const { data: analysisRecord, error: insertError } = await supabase
        .from('video_analyses')
        .insert({
          user_id: user.id,
          youtube_url: youtubeUrl,
          video_title: "Processing...", // Will be updated by worker
          company: analysisDetails.company,
          role: analysisDetails.role,
          target_person: analysisDetails.targetPerson,
          video_duration_hours: 0, // Will be updated by worker
          status: 'pending',
          analysis_results: null
        })
        .select()
        .single();

      if (insertError) {
        console.error('Database insert error:', insertError);
        throw new Error('Failed to queue analysis.');
      }

      console.log('Analysis queued:', analysisRecord.id);

      // 2. Poll for completion
      const pollInterval = setInterval(async () => {
        const { data: updatedRecord, error: pollError } = await supabase
          .from('video_analyses')
          .select('*')
          .eq('id', analysisRecord.id)
          .single();

        if (pollError) {
          console.error('Polling error:', pollError);
          return;
        }

        if (updatedRecord.status === 'completed') {
          clearInterval(pollInterval);
          setAnalysisResults(updatedRecord.analysis_results);
          setAnalyzing(false);
          setStep("results");
          toast({
            title: "Analysis Complete",
            description: "Video analysis has been completed successfully!",
          });
        } else if (updatedRecord.status === 'failed') {
          clearInterval(pollInterval);
          setAnalyzing(false);
          setStep("person"); // Go back to step 3
          toast({
            title: "Analysis Failed",
            description: updatedRecord.error_message || "An error occurred during processing.",
            variant: "destructive",
          });
        }
      }, 5000); // Poll every 5 seconds

      // Cleanup interval on unmount (simple safety, though technically this effect runs once)
      return () => clearInterval(pollInterval);

    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setStep("person");
      setAnalyzing(false);
    }
  };

  const handleBack = () => {
    setStep("input");
    setYoutubeUrl("");
    setAnalysisDetails({
      company: "",
      role: "",
      intervieweeName: "",
      targetPerson: ""
    });
    setAnalysisResults(null);
  };

  const handleSignOut = () => {
    signOut();
  };

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Redirect to auth if not authenticated
  if (!user || !session) {
    window.location.href = '/auth';
    return null;
  }

  // Analysis results display
  if (step === "results") {
    return (
      <Layout
        currentUsageHours={currentUsageHours}
        maxUsageHours={maxUsageHours}
        userProfile={userProfile}
      >
        <div className="bg-gradient-to-br from-background to-secondary/20 min-h-full">
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="hover:bg-secondary"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Start New Analysis
              </Button>
            </div>
            <AnalysisResults
              videoTitle={`${analysisDetails.company} ${analysisDetails.role} - ${analysisDetails.intervieweeName}`}
              videoUrl={youtubeUrl}
              analysisDetails={analysisDetails}
              analysisResults={analysisResults}
            />
          </div>
        </div>
      </Layout>
    );
  }

  // Loading screen during analysis
  if (step === "analyzing") {
    return (
      <Layout
        currentUsageHours={currentUsageHours}
        maxUsageHours={maxUsageHours}
        userProfile={userProfile}
      >
        <div className="bg-gradient-to-br from-background to-secondary/20 min-h-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold mb-2">Analyzing Video</h2>
            <p className="text-muted-foreground">Processing {analysisDetails.intervieweeName} from {analysisDetails.company}...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Main form flow
  return (
    <Layout
      currentUsageHours={currentUsageHours}
      maxUsageHours={maxUsageHours}
      userProfile={userProfile}
    >
      <div className="bg-gradient-to-br from-background to-secondary/20 min-h-full">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Executive Comms Ninja
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
              Advanced AI-powered analysis of executive video interviews to enhance communication effectiveness
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Navigation */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === "input" ? "bg-primary text-primary-foreground" :
                    ["details", "person", "analyzing", "results"].includes(step) ? "bg-green-500 text-white" : "bg-secondary"
                  }`}>
                  1
                </div>
                <div className="text-sm">URL Input</div>
                <div className="w-8 border-t-2 border-secondary"></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === "details" ? "bg-primary text-primary-foreground" :
                    ["person", "analyzing", "results"].includes(step) ? "bg-green-500 text-white" : "bg-secondary"
                  }`}>
                  2
                </div>
                <div className="text-sm">Details</div>
                <div className="w-8 border-t-2 border-secondary"></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === "person" ? "bg-primary text-primary-foreground" :
                    ["analyzing", "results"].includes(step) ? "bg-green-500 text-white" : "bg-secondary"
                  }`}>
                  3
                </div>
                <div className="text-sm">Person ID</div>
              </div>
            </div>

            {/* Step 1: URL Input */}
            {step === "input" && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PlayCircle className="h-6 w-6 text-primary" />
                    Start Video Analysis
                  </CardTitle>
                  <CardDescription>
                    Enter a YouTube URL to begin analyzing executive presentation skills
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleUrlSubmit}
                      disabled={!youtubeUrl}
                      className="min-w-[100px]"
                    >
                      Next
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Analysis Details */}
            {step === "details" && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-6 w-6 text-primary" />
                    Analysis Details
                  </CardTitle>
                  <CardDescription>
                    Provide information about the executive being analyzed
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Company</label>
                      <Input
                        placeholder="e.g., Microsoft, Apple, Google"
                        value={analysisDetails.company}
                        onChange={(e) => setAnalysisDetails(prev => ({ ...prev, company: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Role/Position</label>
                      <Input
                        placeholder="e.g., CEO, CFO, VP"
                        value={analysisDetails.role}
                        onChange={(e) => setAnalysisDetails(prev => ({ ...prev, role: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Executive Name</label>
                      <Input
                        placeholder="e.g., Satya Nadella"
                        value={analysisDetails.intervieweeName}
                        onChange={(e) => setAnalysisDetails(prev => ({ ...prev, intervieweeName: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setStep("input")}>
                      Back
                    </Button>
                    <Button
                      onClick={handleDetailsSubmit}
                      disabled={!analysisDetails.company || !analysisDetails.role || !analysisDetails.intervieweeName}
                    >
                      Next
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Person Identification */}
            {step === "person" && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-6 w-6 text-primary" />
                    Identify Target Person
                  </CardTitle>
                  <CardDescription>
                    Specify which person in the video should be analyzed (since videos may contain multiple people)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Who should be the focus of analysis?</label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="interviewee"
                          name="targetPerson"
                          value="interviewee"
                          checked={analysisDetails.targetPerson === "interviewee"}
                          onChange={(e) => setAnalysisDetails(prev => ({ ...prev, targetPerson: e.target.value }))}
                          className="h-4 w-4"
                        />
                        <label htmlFor="interviewee" className="text-sm">
                          The Interviewee ({analysisDetails.intervieweeName} - main person being interviewed)
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="interviewer"
                          name="targetPerson"
                          value="interviewer"
                          checked={analysisDetails.targetPerson === "interviewer"}
                          onChange={(e) => setAnalysisDetails(prev => ({ ...prev, targetPerson: e.target.value }))}
                          className="h-4 w-4"
                        />
                        <label htmlFor="interviewer" className="text-sm">
                          The Interviewer (person asking questions)
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="other"
                          name="targetPerson"
                          value="other"
                          checked={analysisDetails.targetPerson === "other"}
                          onChange={(e) => setAnalysisDetails(prev => ({ ...prev, targetPerson: e.target.value }))}
                          className="h-4 w-4"
                        />
                        <label htmlFor="other" className="text-sm">
                          Other person in the video (please specify in notes)
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setStep("details")}>
                      Back
                    </Button>
                    <Button
                      onClick={handlePersonSubmit}
                      disabled={!analysisDetails.targetPerson}
                    >
                      Start Analysis
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Features Grid (shown on first step) */}
            {step === "input" && (
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Brain className="h-5 w-5 text-primary" />
                      Facial & Emotion Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      AI-powered analysis of facial expressions, eye contact, and gestures to quantify confidence and credibility
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      Message Impact Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Evaluate audience influence through voice tone, speaking pace, and message consistency analysis
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Users className="h-5 w-5 text-primary" />
                      Communication Strategy
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Receive actionable recommendations to enhance executive presence and communication effectiveness
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;