import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayCircle, BarChart3, Users, Brain, ArrowLeft } from "lucide-react";
import AnalysisResults from "@/components/AnalysisResults";

const Index = () => {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (youtubeUrl) {
      setAnalyzing(true);
      console.log("Analyzing video:", youtubeUrl);
      
      // モック分析プロセス
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setAnalyzing(false);
      setShowResults(true);
    }
  };

  const handleBack = () => {
    setShowResults(false);
    setYoutubeUrl("");
  };

  // 分析結果表示
  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
        <div className="container mx-auto px-4 py-8">
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="mb-6 hover:bg-secondary"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Start New Analysis
          </Button>
          <AnalysisResults 
            videoTitle="CEO Interview - Corporate Strategy Discussion"
            videoUrl={youtubeUrl}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Executive Comms Ninja
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Analyze executive presence, emotions, and message effectiveness from YouTube videos to optimize B2B communications
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Main Analysis Card */}
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
                  onClick={handleAnalyze} 
                  disabled={!youtubeUrl || analyzing}
                  className="min-w-[100px]"
                >
                  {analyzing ? "Analyzing..." : "Analyze"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Features Grid */}
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
                  B2B Specialized Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Corporate communication-focused improvement recommendations and executive benchmarking
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
