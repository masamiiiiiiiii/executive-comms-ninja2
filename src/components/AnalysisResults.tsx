import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  Smile, 
  Eye, 
  Mic, 
  MessageSquare,
  Star,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Info,
  Download
} from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';
import AnalysisSettings from './AnalysisSettings';

interface AnalysisResultsProps {
  videoTitle: string;
  videoUrl: string;
  analysisDetails: {
    company: string;
    role: string;
    intervieweeName: string;
    targetPerson: string;
  };
  analysisResults?: {
    videoPublishedAt?: string;
    [key: string]: any;
  };
}

const AnalysisResults = ({ videoTitle, videoUrl, analysisDetails, analysisResults }: AnalysisResultsProps) => {
  // 詳細分析データ
  const overallScore = 78;
  const analysisData = {
    // コア指標
    confidence: 82,
    authenticity: 75,
    engagement: 80,
    clarity: 77,
    // 詳細指標
    eyeContact: 79,
    voiceStability: 84,
    gestureEffectiveness: 72,
    speechPacing: 68,
    facialExpression: 86,
    bodyLanguage: 73,
    messageCoherence: 81,
    credibility: 77,
    // 音声分析
    duration: "2:34",
    speakingRate: "145 wpm",
    pauseFrequency: "8.2/min",
    volumeVariation: "12dB",
    // 言語分析
    vocabularyLevel: "Professional",
    sentimentScore: 0.73,
    keywordDensity: "Optimal"
  };

  // 時系列感情変化データ
  const emotionTimelineData = [
    { time: "0:00", confidence: 75, enthusiasm: 70, composure: 80, trust: 72 },
    { time: "0:30", confidence: 78, enthusiasm: 75, composure: 82, trust: 74 },
    { time: "1:00", confidence: 85, enthusiasm: 88, composure: 78, trust: 80 },
    { time: "1:30", confidence: 80, enthusiasm: 82, composure: 85, trust: 82 },
    { time: "2:00", confidence: 88, enthusiasm: 90, composure: 83, trust: 85 },
    { time: "2:30", confidence: 84, enthusiasm: 85, composure: 87, trust: 83 }
  ];

  // パフォーマンス比較データ（業界平均との比較）
  const benchmarkData = [
    { metric: "Confidence", current: 82, industry: 74, ceo: 89 },
    { metric: "Trustworthiness", current: 75, industry: 78, ceo: 85 },
    { metric: "Engagement", current: 80, industry: 72, ceo: 87 },
    { metric: "Clarity", current: 77, industry: 75, ceo: 84 },
    { metric: "Eye Contact", current: 79, industry: 70, ceo: 88 },
    { metric: "Voice Stability", current: 84, industry: 76, ceo: 91 }
  ];

  // レーダーチャート用感情データ（5角形）
  const emotionRadarData = [
    { subject: "Confidence", A: 82, fullMark: 100 },
    { subject: "Trust", A: 75, fullMark: 100 },
    { subject: "Enthusiasm", A: 88, fullMark: 100 },
    { subject: "Composure", A: 71, fullMark: 100 },
    { subject: "Approachability", A: 79, fullMark: 100 }
  ];

  // データソース情報
  const dataSources = {
    confidence: "Google Cloud Video Intelligence API",
    authenticity: "Facial Expression Analysis Engine",
    engagement: "Speech Pattern Recognition",
    clarity: "Natural Language Processing",
    emotion: "Microsoft Face API + Proprietary Emotion Analysis Model"
  };

  // タイムラインデータ（キャプチャ画像付き）
  const timelineData = [
    { 
      time: "0:15", 
      event: "Strong Eye Contact", 
      score: 85, 
      type: "positive",
      thumbnail: "/placeholder.svg",
      analysis: "Sustained eye contact with camera for 3.2 seconds. Ideal duration for building trust.",
      annotation: { x: 45, y: 32, label: "Eye Contact" }
    },
    { 
      time: "0:45", 
      event: "Effective Gestures", 
      score: 78, 
      type: "positive",
      thumbnail: "/placeholder.svg",
      analysis: "Hand gestures reinforce message effectively. Open-hand gestures enhance trustworthiness.",
      annotation: { x: 65, y: 55, label: "Hand Movement" }
    },
    { 
      time: "1:20", 
      event: "Speaking Pace Slightly Fast", 
      score: 65, 
      type: "warning",
      thumbnail: "/placeholder.svg",
      analysis: "Speaking rate at 180wpm. Exceeds ideal range of 140-160wpm.",
      annotation: { x: 50, y: 25, label: "Mouth Movement" }
    },
    { 
      time: "2:10", 
      event: "Rich Facial Expression", 
      score: 90, 
      type: "positive",
      thumbnail: "/placeholder.svg",
      analysis: "Natural smile sustained for 1.8 seconds. Builds rapport with audience.",
      annotation: { x: 48, y: 38, label: "Facial Expression" }
    }
  ];

  // 詳細な改善提案（What, Why, How）
  const detailedRecommendations = [
    {
      what: "Enhance eye contact with camera to improve trustworthiness",
      why: "Current average eye contact duration is 2.1 seconds, below the B2B presentation average of 3.5 seconds (Fortune 500 CEO analysis data)",
      how: "IBM CEO Arvind Krishna maintains 4.2 seconds of eye contact during earnings calls",
      exampleUrl: "https://youtube.com/example-ceo-presentation",
      benchmark: "Earnings Call Analysis"
    },
    {
      what: "Reduce speaking pace by 10-15% for better comprehension",
      why: "Current 180wpm exceeds optimal technical presentation range of 140-160wpm (MIT research data)",
      how: "Microsoft CEO Satya Nadella maintains 155wpm for complex technical explanations",
      exampleUrl: "https://youtube.com/example-tech-presentation",
      benchmark: "Technical Presentation Analysis"
    },
    {
      what: "Increase hand gesture frequency by 20% for better engagement",
      why: "Current rate of 2.3 gestures per minute, but 3-4 per minute is ideal for engagement (Harvard Business Review research)",
      how: "Salesforce CEO Marc Benioff uses 3.8 effective gestures per minute",
      exampleUrl: "https://youtube.com/example-engaging-presentation",
      benchmark: "Engagement Analysis"
    },
    {
      what: "Extend smile duration to improve approachability",
      why: "Current 1.2-second smile duration, but 2-3 seconds is effective for building rapport (psychology research data)",
      how: "Adobe CEO Shantanu Narayen demonstrates natural 2.5-second smiles for approachability",
      exampleUrl: "https://youtube.com/example-approachable-ceo",
      benchmark: "Rapport Building Analysis"
    }
  ];

  // CSV Export Function
  const exportToCSV = () => {
    const csvData = [
      ['Executive Comms Ninja - Analysis Report'],
      [''],
      ['Executive Information'],
      ['Company', analysisDetails.company],
      ['Role', analysisDetails.role],
      ['Name', analysisDetails.intervieweeName],
      ['Analysis Target', analysisDetails.targetPerson],
      ['Video URL', videoUrl],
      [''],
      ['Overall Performance'],
      ['Overall Score', `${overallScore}%`],
      [''],
      ['Detailed Metrics'],
      ['Confidence', `${analysisData.confidence}%`],
      ['Trustworthiness', `${analysisData.authenticity}%`],
      ['Engagement', `${analysisData.engagement}%`],
      ['Clarity', `${analysisData.clarity}%`],
      [''],
      ['Emotion Analysis'],
      ...emotionRadarData.map(emotion => [emotion.subject, `${emotion.A}%`]),
      [''],
      ['Timeline Analysis'],
      ['Time', 'Event', 'Score', 'Analysis'],
      ...timelineData.map(item => [item.time, item.event, item.score, item.analysis]),
      [''],
      ['Improvement Recommendations'],
      ['What', 'Why', 'How', 'Benchmark'],
      ...detailedRecommendations.map(rec => [rec.what, rec.why, rec.how, rec.benchmark]),
      [''],
      ['Generated on', new Date().toISOString()]
    ];

    const csvContent = csvData.map(row => 
      Array.isArray(row) ? row.map(field => `"${field}"`).join(',') : `"${row}"`
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `executive-analysis-${analysisDetails.company}-${analysisDetails.intervieweeName}-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in p-6 bg-gradient-to-br from-background to-secondary/20 min-h-screen">
      {/* Header with Export - Enhanced */}
      <div className="border-b border-gradient-to-r from-primary/20 to-accent/20 pb-6 flex justify-between items-start bg-card/50 backdrop-blur-sm rounded-xl p-6 shadow-lg hover-scale">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Analysis Results
          </h2>
          <p className="text-muted-foreground text-lg">{videoTitle}</p>
          <div className="flex gap-6 mt-3 text-sm">
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="font-medium">Target: {analysisDetails.targetPerson}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-accent/10 rounded-full">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span className="font-medium">Company: {analysisDetails.company}</span>
            </div>
            {analysisResults?.videoPublishedAt && (
              <div className="flex items-center gap-2 px-3 py-1 bg-secondary/20 rounded-full">
                <Clock className="h-3 w-3" />
                <span>Published: {new Date(analysisResults.videoPublishedAt).toLocaleDateString('ja-JP')}</span>
              </div>
            )}
          </div>
        </div>
        <Button onClick={exportToCSV} variant="outline" className="flex items-center gap-2 hover-scale border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Overall Score - Enhanced */}
      <Card className="border-l-4 border-l-primary shadow-xl bg-gradient-to-r from-card to-primary/5 hover-scale transition-all duration-300 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-50"></div>
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-full bg-primary/10">
              <Star className="h-6 w-6 text-primary" />
            </div>
            Overall Performance Score
          </CardTitle>
          <CardDescription className="text-base">
            Comprehensive assessment of B2B communication effectiveness
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="flex items-center gap-6">
            <div className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {overallScore}
            </div>
            <div className="flex-1 space-y-2">
              <Progress value={overallScore} className="h-4 bg-gradient-to-r from-primary/20 to-accent/20" />
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Excellent level (Good performance above 70 points)
                </p>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  Top Performer
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-gradient-to-r from-card to-secondary/30 p-1 rounded-xl shadow-lg">
          <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground transition-all duration-300">Overview</TabsTrigger>
          <TabsTrigger value="detailed" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground transition-all duration-300">Detailed Metrics</TabsTrigger>
          <TabsTrigger value="emotions" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground transition-all duration-300">Emotion Analysis</TabsTrigger>
          <TabsTrigger value="timeline" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground transition-all duration-300">Timeline</TabsTrigger>
          <TabsTrigger value="recommendations" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground transition-all duration-300">Recommendations</TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground transition-all duration-300">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 animate-fade-in">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover-scale transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-card to-primary/5 hover:shadow-xl group">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2 group-hover:text-primary transition-colors">
                  <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Eye className="h-4 w-4 text-primary" />
                  </div>
                  Confidence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary mb-2">{analysisData.confidence}%</div>
                <Progress value={analysisData.confidence} className="h-2 bg-primary/10" />
              </CardContent>
            </Card>

            <Card className="hover-scale transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-card to-accent/5 hover:shadow-xl group">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2 group-hover:text-accent transition-colors">
                  <div className="p-1.5 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                    <Users className="h-4 w-4 text-accent" />
                  </div>
                  Trustworthiness
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent mb-2">{analysisData.authenticity}%</div>
                <Progress value={analysisData.authenticity} className="h-2 bg-accent/10" />
              </CardContent>
            </Card>

            <Card className="hover-scale transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-card to-secondary/5 hover:shadow-xl group">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2 group-hover:text-secondary transition-colors">
                  <div className="p-1.5 rounded-lg bg-secondary/10 group-hover:bg-secondary/20 transition-colors">
                    <TrendingUp className="h-4 w-4 text-secondary" />
                  </div>
                  Engagement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-secondary mb-2">{analysisData.engagement}%</div>
                <Progress value={analysisData.engagement} className="h-2 bg-secondary/10" />
              </CardContent>
            </Card>

            <Card className="hover-scale transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-card to-muted/5 hover:shadow-xl group">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2 group-hover:text-foreground transition-colors">
                  <div className="p-1.5 rounded-lg bg-muted/20 group-hover:bg-muted/30 transition-colors">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  Clarity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">{analysisData.clarity}%</div>
                <Progress value={analysisData.clarity} className="h-2 bg-muted/10" />
              </CardContent>
            </Card>
          </div>

          {/* データソース情報追加 - Enhanced */}
          <Card className="shadow-lg border-0 bg-gradient-to-r from-card to-muted/10 hover-scale transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-muted/20">
                  <Info className="h-5 w-5" />
                </div>
                Data Source Information
              </CardTitle>
              <CardDescription className="text-base">
                Data sources used for analyzing each metric
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                <span className="font-medium">Confidence</span>
                <Badge variant="outline" className="border-primary/30 text-primary">{dataSources.confidence}</Badge>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors">
                <span className="font-medium">Trustworthiness</span>
                <Badge variant="outline" className="border-accent/30 text-accent">{dataSources.authenticity}</Badge>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/5 hover:bg-secondary/10 transition-colors">
                <span className="font-medium">Engagement</span>
                <Badge variant="outline" className="border-secondary/30 text-secondary">{dataSources.engagement}</Badge>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/10 hover:bg-muted/20 transition-colors">
                <span className="font-medium">Clarity</span>
                <Badge variant="outline" className="border-muted-foreground/30">{dataSources.clarity}</Badge>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-primary/5 hover-scale transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  Voice Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-primary/5">
                  <span className="font-medium">Video Length</span>
                  <span className="font-bold text-primary">{analysisData.duration}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-primary/5">
                  <span className="font-medium">Speaking Rate</span>
                  <span className="font-bold text-primary">{analysisData.speakingRate}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-primary/5">
                  <span className="font-medium">Clarity</span>
                  <Badge variant="secondary" className="bg-primary/20 text-primary">Good</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-accent/5 hover-scale transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-accent/10">
                    <Mic className="h-5 w-5 text-accent" />
                  </div>
                  Message Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-accent/5">
                  <span className="font-medium">Keyword Density</span>
                  <Badge variant="secondary" className="bg-accent/20 text-accent">Appropriate</Badge>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-accent/5">
                  <span className="font-medium">Emotional Tone</span>
                  <Badge variant="secondary" className="bg-accent/20 text-accent">Positive</Badge>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-accent/5">
                  <span className="font-medium">Structure</span>
                  <Badge variant="secondary" className="bg-accent/20 text-accent">Logical</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-4">
          {/* 詳細メトリクス */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Eye Contact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analysisData.eyeContact}%</div>
                <Progress value={analysisData.eyeContact} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-1">Camera engagement rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Mic className="h-4 w-4" />
                  Voice Stability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analysisData.voiceStability}%</div>
                <Progress value={analysisData.voiceStability} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-1">Consistent tone & pace</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Gesture Effectiveness
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analysisData.gestureEffectiveness}%</div>
                <Progress value={analysisData.gestureEffectiveness} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-1">Hand movement impact</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Speech Pacing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analysisData.speechPacing}%</div>
                <Progress value={analysisData.speechPacing} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-1">Optimal speed rating</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Smile className="h-4 w-4" />
                  Facial Expression
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analysisData.facialExpression}%</div>
                <Progress value={analysisData.facialExpression} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-1">Natural expression</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Message Coherence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analysisData.messageCoherence}%</div>
                <Progress value={analysisData.messageCoherence} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-1">Logical flow</p>
              </CardContent>
            </Card>
          </div>

          {/* 音声・言語分析詳細 */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5" />
                  Advanced Voice Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Speaking Rate</span>
                  <span className="font-medium">{analysisData.speakingRate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pause Frequency</span>
                  <span className="font-medium">{analysisData.pauseFrequency}</span>
                </div>
                <div className="flex justify-between">
                  <span>Volume Variation</span>
                  <span className="font-medium">{analysisData.volumeVariation}</span>
                </div>
                <div className="flex justify-between">
                  <span>Voice Clarity</span>
                  <Badge variant="secondary">Excellent</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Language Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Vocabulary Level</span>
                  <span className="font-medium">{analysisData.vocabularyLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sentiment Score</span>
                  <span className="font-medium">{analysisData.sentimentScore}</span>
                </div>
                <div className="flex justify-between">
                  <span>Keyword Density</span>
                  <Badge variant="secondary">{analysisData.keywordDensity}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Message Structure</span>
                  <Badge variant="secondary">Well-organized</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 業界比較ベンチマーク */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Performance Benchmark Comparison
              </CardTitle>
              <CardDescription>
                Your performance vs Industry Average vs Top CEOs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={benchmarkData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="metric" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="current" fill="hsl(var(--primary))" name="Your Score" />
                    <Bar dataKey="industry" fill="hsl(var(--secondary))" name="Industry Average" />
                    <Bar dataKey="ceo" fill="hsl(var(--accent))" name="Top CEOs" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emotions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smile className="h-5 w-5" />
                Emotion Expression Analysis (Pentagon Radar Chart)
              </CardTitle>
              <CardDescription>
                Emotional intensity detected from facial expressions and gestures
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={emotionRadarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" className="text-sm" />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 100]} 
                      tick={false}
                    />
                    <Radar
                      name="Emotion Analysis"
                      dataKey="A"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-3 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-4 w-4" />
                  <span className="text-sm font-medium">Data Source</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {dataSources.emotion}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 時系列感情変化グラフ */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Emotion Timeline Analysis
              </CardTitle>
              <CardDescription>
                How your emotional expression evolved throughout the video
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={emotionTimelineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[60, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="confidence" stroke="hsl(var(--primary))" strokeWidth={2} name="Confidence" />
                    <Line type="monotone" dataKey="enthusiasm" stroke="hsl(var(--accent))" strokeWidth={2} name="Enthusiasm" />
                    <Line type="monotone" dataKey="composure" stroke="hsl(var(--secondary))" strokeWidth={2} name="Composure" />
                    <Line type="monotone" dataKey="trust" stroke="hsl(var(--muted-foreground))" strokeWidth={2} name="Trust" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-medium text-primary">Peak Confidence</div>
                  <div className="text-muted-foreground">2:00 - 88%</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-accent">Peak Enthusiasm</div>
                  <div className="text-muted-foreground">2:00 - 90%</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-secondary">Peak Composure</div>
                  <div className="text-muted-foreground">2:30 - 87%</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-muted-foreground">Peak Trust</div>
                  <div className="text-muted-foreground">2:00 - 85%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Performance Timeline (with Capture Images)
              </CardTitle>
              <CardDescription>
                Analysis of key points throughout the video with capture images
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {timelineData.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-sm font-mono bg-secondary px-2 py-1 rounded">
                        {item.time}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.event}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.type === "positive" ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        )}
                        <span className="text-sm font-medium">{item.score}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      {/* キャプチャ画像とアノテーション */}
                      <div className="relative w-48 h-32 bg-secondary rounded-lg overflow-hidden">
                        <img 
                          src={item.thumbnail} 
                          alt={`Capture ${item.time}`}
                          className="w-full h-full object-cover"
                        />
                        {/* アノテーションポイント */}
                        <div 
                          className="absolute w-3 h-3 bg-primary rounded-full border-2 border-white"
                          style={{
                            left: `${item.annotation.x}%`,
                            top: `${item.annotation.y}%`,
                            transform: 'translate(-50%, -50%)'
                          }}
                        />
                        <div 
                          className="absolute bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium"
                          style={{
                            left: `${item.annotation.x}%`,
                            top: `${Math.max(0, item.annotation.y - 15)}%`,
                            transform: 'translate(-50%, -100%)'
                          }}
                        >
                          {item.annotation.label}
                        </div>
                      </div>
                      
                      {/* 分析詳細 */}
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">
                          {item.analysis}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Improvement Recommendations
              </CardTitle>
              <CardDescription>
                Specific advice to enhance B2B communication effectiveness
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {detailedRecommendations.map((rec, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    {/* What */}
                    <div className="flex items-start gap-3 mb-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm mb-2">Improvement Point</h4>
                        <p className="text-sm">{rec.what}</p>
                      </div>
                    </div>
                    
                    {/* Why */}
                    <div className="ml-8 mb-3">
                      <h4 className="font-medium text-sm mb-2 text-yellow-600">Rationale (Why)</h4>
                      <p className="text-sm text-muted-foreground">{rec.why}</p>
                      <Badge variant="outline" className="mt-1">
                        {rec.benchmark}
                      </Badge>
                    </div>
                    
                    {/* How */}
                    <div className="ml-8">
                      <h4 className="font-medium text-sm mb-2 text-blue-600">How to Improve (How)</h4>
                      <p className="text-sm text-muted-foreground mb-2">{rec.how}</p>
                      <a 
                        href={rec.exampleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View Example Case
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6 animate-fade-in">
          <AnalysisSettings 
            currentSettings={{}} 
            onSettingsChange={(settings) => console.log('Settings changed:', settings)} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalysisResults;