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
  Info
} from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

interface AnalysisResultsProps {
  videoTitle: string;
  videoUrl: string;
}

const AnalysisResults = ({ videoTitle, videoUrl }: AnalysisResultsProps) => {
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
    { subject: "自信", A: 82, fullMark: 100 },
    { subject: "信頼性", A: 75, fullMark: 100 },
    { subject: "熱意", A: 88, fullMark: 100 },
    { subject: "落ち着き", A: 71, fullMark: 100 },
    { subject: "親しみやすさ", A: 79, fullMark: 100 }
  ];

  // データソース情報
  const dataSources = {
    confidence: "Google Cloud Video Intelligence API",
    authenticity: "Facial Expression Analysis Engine",
    engagement: "Speech Pattern Recognition",
    clarity: "Natural Language Processing",
    emotion: "Microsoft Face API + 自社感情分析モデル"
  };

  // タイムラインデータ（キャプチャ画像付き）
  const timelineData = [
    { 
      time: "0:15", 
      event: "強い視線接触", 
      score: 85, 
      type: "positive",
      thumbnail: "/placeholder.svg",
      analysis: "カメラとの視線接触が3.2秒持続。信頼感を醸成する理想的な長さ。",
      annotation: { x: 45, y: 32, label: "視線" }
    },
    { 
      time: "0:45", 
      event: "ジェスチャー効果的", 
      score: 78, 
      type: "positive",
      thumbnail: "/placeholder.svg",
      analysis: "手のジェスチャーがメッセージを強調。オープンハンドで信頼性向上。",
      annotation: { x: 65, y: 55, label: "手の動き" }
    },
    { 
      time: "1:20", 
      event: "話速やや速い", 
      score: 65, 
      type: "warning",
      thumbnail: "/placeholder.svg",
      analysis: "話速が180wpm。理想的な140-160wpmを上回っている。",
      annotation: { x: 50, y: 25, label: "口の動き" }
    },
    { 
      time: "2:10", 
      event: "表情豊か", 
      score: 90, 
      type: "positive",
      thumbnail: "/placeholder.svg",
      analysis: "自然な笑顔が1.8秒継続。聴衆との親近感を構築。",
      annotation: { x: 48, y: 38, label: "表情" }
    }
  ];

  // 詳細な改善提案（What, Why, How）
  const detailedRecommendations = [
    {
      what: "視線をカメラにより集中させることで信頼感が向上します",
      why: "現在の視線接触時間は平均2.1秒ですが、B2Bプレゼン平均3.5秒を下回っています（Fortune 500 CEO分析データより）",
      how: "IBM CEO Arvind Krishna氏の決算説明会では4.2秒の視線接触を維持",
      exampleUrl: "https://youtube.com/example-ceo-presentation",
      benchmark: "決算説明会分析"
    },
    {
      what: "話速を10-15%下げることで理解しやすくなります",
      why: "現在180wpmですが、技術プレゼンテーション最適値140-160wpmを超過（MIT研究データ）",
      how: "Microsoft CEO Satya Nadella氏は複雑な技術説明で155wpmを維持",
      exampleUrl: "https://youtube.com/example-tech-presentation",
      benchmark: "技術プレゼンテーション分析"
    },
    {
      what: "手のジェスチャーの使用頻度を20%増やすことを推奨",
      why: "現在分間2.3回ですが、エンゲージメント向上には分間3-4回が理想（Harvard Business Review研究）",
      how: "Salesforce CEO Marc Benioff氏は分間3.8回の効果的なジェスチャーを使用",
      exampleUrl: "https://youtube.com/example-engaging-presentation",
      benchmark: "エンゲージメント分析"
    },
    {
      what: "笑顔の持続時間を延ばすことで親しみやすさが向上",
      why: "現在1.2秒の笑顔持続ですが、親近感構築には2-3秒が効果的（心理学研究データ）",
      how: "Adobe CEO Shantanu Narayen氏は自然な2.5秒笑顔で親しみやすさを演出",
      exampleUrl: "https://youtube.com/example-approachable-ceo",
      benchmark: "親近感分析"
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ヘッダー */}
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold">分析結果</h2>
        <p className="text-muted-foreground mt-1">{videoTitle}</p>
      </div>

      {/* 総合スコア */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            総合評価スコア
          </CardTitle>
          <CardDescription>
            B2Bコミュニケーション効果の総合評価
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-primary">{overallScore}</div>
            <div className="flex-1">
              <Progress value={overallScore} className="h-3" />
              <p className="text-sm text-muted-foreground mt-1">
                優秀なレベル (70点以上で良好)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">概要</TabsTrigger>
          <TabsTrigger value="emotions">感情分析</TabsTrigger>
          <TabsTrigger value="timeline">タイムライン</TabsTrigger>
          <TabsTrigger value="recommendations">改善提案</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  自信度
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
                  信頼性
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
                  エンゲージメント
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
                  明瞭性
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
                データソース情報
              </CardTitle>
              <CardDescription>
                各指標の分析に使用されたデータソース
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span>自信度</span>
                <Badge variant="outline">{dataSources.confidence}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>信頼性</span>
                <Badge variant="outline">{dataSources.authenticity}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>エンゲージメント</span>
                <Badge variant="outline">{dataSources.engagement}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>明瞭性</span>
                <Badge variant="outline">{dataSources.clarity}</Badge>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  音声分析
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>動画長</span>
                  <span className="font-medium">{analysisData.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span>話速</span>
                  <span className="font-medium">{analysisData.speakingRate}</span>
                </div>
                <div className="flex justify-between">
                  <span>明瞭度</span>
                  <Badge variant="secondary">良好</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5" />
                  メッセージ分析
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>キーワード密度</span>
                  <Badge variant="secondary">適切</Badge>
                </div>
                <div className="flex justify-between">
                  <span>感情トーン</span>
                  <Badge variant="secondary">ポジティブ</Badge>
                </div>
                <div className="flex justify-between">
                  <span>構造</span>
                  <Badge variant="secondary">論理的</Badge>
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
                感情表現分析（5角形レーダーチャート）
              </CardTitle>
              <CardDescription>
                表情・ジェスチャーから読み取られた感情の強度
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
                      name="感情分析"
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
                  <span className="text-sm font-medium">データソース</span>
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
                パフォーマンス・タイムライン（キャプチャ画像付き）
              </CardTitle>
              <CardDescription>
                動画全体を通じた重要なポイントの分析とキャプチャ画像
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
                          alt={`キャプチャ ${item.time}`}
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
                改善提案
              </CardTitle>
              <CardDescription>
                B2Bコミュニケーション効果向上のための具体的なアドバイス
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
                        <h4 className="font-medium text-sm mb-2">改善点</h4>
                        <p className="text-sm">{rec.what}</p>
                      </div>
                    </div>
                    
                    {/* Why */}
                    <div className="ml-8 mb-3">
                      <h4 className="font-medium text-sm mb-2 text-yellow-600">根拠（Why）</h4>
                      <p className="text-sm text-muted-foreground">{rec.why}</p>
                      <Badge variant="outline" className="mt-1">
                        {rec.benchmark}
                      </Badge>
                    </div>
                    
                    {/* How */}
                    <div className="ml-8">
                      <h4 className="font-medium text-sm mb-2 text-blue-600">改善方法（How）</h4>
                      <p className="text-sm text-muted-foreground mb-2">{rec.how}</p>
                      <a 
                        href={rec.exampleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        参考事例を見る
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