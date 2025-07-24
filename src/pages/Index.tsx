import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, BarChart3, Users, Brain, ArrowLeft, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AnalysisResults from "@/components/AnalysisResults";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [usedHours] = useState(23); // Mock data for used hours
  const { toast } = useToast();

  const [step, setStep] = useState<"input" | "details" | "person" | "analyzing" | "results">("input");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [analysisDetails, setAnalysisDetails] = useState({
    company: "",
    role: "",
    intervieweeName: "",
    targetPerson: ""
  });
  const [analyzing, setAnalyzing] = useState(false);

  const handleAuthentication = () => {
    if (!userEmail || !userName) {
      toast({
        title: "入力エラー",
        description: "メールアドレスと名前を入力してください。",
        variant: "destructive",
      });
      return;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      toast({
        title: "入力エラー", 
        description: "有効なメールアドレスを入力してください。",
        variant: "destructive",
      });
      return;
    }

    setIsAuthenticated(true);
    toast({
      title: "アクセス承認",
      description: `${userName}さん、Executive Comms Ninjaへようこそ！`,
    });
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
    console.log("Analyzing video:", youtubeUrl, "Details:", analysisDetails);
    
    // Mock analysis process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setAnalyzing(false);
    setStep("results");
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
  };

  // Authentication screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary/60 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Executive Comms Ninja
            </CardTitle>
            <CardDescription>
              グローバル広報チーム専用ツール<br/>
              アクセスには認証が必要です
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="userEmail" className="text-sm font-medium">メールアドレス</label>
              <Input
                id="userEmail"
                type="email"
                placeholder="your.name@company.com"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="userName" className="text-sm font-medium">お名前</label>
              <Input
                id="userName"
                type="text"
                placeholder="山田 太郎"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleAuthentication}
              className="w-full"
              disabled={!userEmail || !userName}
            >
              アクセス開始
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Analysis results display
  if (step === "results") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
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
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                月間使用時間: {usedHours}/100時間
              </div>
              <Badge variant="secondary" className="px-3 py-1">
                {userName} ({userEmail})
              </Badge>
            </div>
          </div>
          <AnalysisResults 
            videoTitle={`${analysisDetails.company} ${analysisDetails.role} - ${analysisDetails.intervieweeName}`}
            videoUrl={youtubeUrl}
            analysisDetails={analysisDetails}
          />
        </div>
      </div>
    );
  }

  // Loading screen during analysis
  if (step === "analyzing") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">Analyzing Video</h2>
          <p className="text-muted-foreground">Processing {analysisDetails.intervieweeName} from {analysisDetails.company}...</p>
        </div>
      </div>
    );
  }

  // Main form flow
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Executive Comms Ninja
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
            経営陣の動画インタビューを分析し、コミュニケーション力を向上させる
          </p>
          <div className="flex justify-center items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              月間使用時間: {usedHours}/100時間
            </div>
            <Badge variant="secondary" className="px-3 py-1">
              {userName} ({userEmail})
            </Badge>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Navigation */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === "input" ? "bg-primary text-primary-foreground" : 
                ["details", "person", "analyzing", "results"].includes(step) ? "bg-green-500 text-white" : "bg-secondary"
              }`}>
                1
              </div>
              <div className="text-sm">URL Input</div>
              <div className="w-8 border-t-2 border-secondary"></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === "details" ? "bg-primary text-primary-foreground" : 
                ["person", "analyzing", "results"].includes(step) ? "bg-green-500 text-white" : "bg-secondary"
              }`}>
                2
              </div>
              <div className="text-sm">Details</div>
              <div className="w-8 border-t-2 border-secondary"></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === "person" ? "bg-primary text-primary-foreground" : 
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;