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
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

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
  // モックデータ
  const overallScore = 78;
  const analysisData = {
    confidence: 82,
    authenticity: 75,
    engagement: 80,
    clarity: 77,
    duration: "2:34",
    speakingRate: "145 wpm"
  };

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
    <div className="space-y-6 animate-fade-in">
      {/* Header with Export */}
      <div className="border-b pb-4 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">Analysis Results</h2>
          <p className="text-muted-foreground mt-1">{videoTitle}</p>
          <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
            <span>Target: {analysisDetails.targetPerson}</span>
            <span>Company: {analysisDetails.company}</span>
            {analysisResults?.videoPublishedAt && (
              <span>Published: {new Date(analysisResults.videoPublishedAt).toLocaleDateString('ja-JP')}</span>
            )}
          </div>
        </div>
        <Button onClick={exportToCSV} variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Overall Score */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Overall Performance Score
          </CardTitle>
          <CardDescription>
            Comprehensive assessment of B2B communication effectiveness
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-primary">{overallScore}</div>
            <div className="flex-1">
              <Progress value={overallScore} className="h-3" />
              <p className="text-sm text-muted-foreground mt-1">
                Excellent level (Good performance above 70 points)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="emotions">Emotion Analysis</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Confidence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analysisData.confidence}%</div>
                <Progress value={analysisData.confidence} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Trustworthiness
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analysisData.authenticity}%</div>
                <Progress value={analysisData.authenticity} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Engagement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analysisData.engagement}%</div>
                <Progress value={analysisData.engagement} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Clarity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analysisData.clarity}%</div>
                <Progress value={analysisData.clarity} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* データソース情報追加 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Data Source Information
              </CardTitle>
              <CardDescription>
                Data sources used for analyzing each metric
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Confidence</span>
                <Badge variant="outline">{dataSources.confidence}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Trustworthiness</span>
                <Badge variant="outline">{dataSources.authenticity}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Engagement</span>
                <Badge variant="outline">{dataSources.engagement}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Clarity</span>
                <Badge variant="outline">{dataSources.clarity}</Badge>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Voice Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Video Length</span>
                  <span className="font-medium">{analysisData.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span>Speaking Rate</span>
                  <span className="font-medium">{analysisData.speakingRate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Clarity</span>
                  <Badge variant="secondary">Good</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5" />
                  Message Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Keyword Density</span>
                  <Badge variant="secondary">Appropriate</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Emotional Tone</span>
                  <Badge variant="secondary">Positive</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Structure</span>
                  <Badge variant="secondary">Logical</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
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
      </Tabs>
    </div>
  );
};

export default AnalysisResults;