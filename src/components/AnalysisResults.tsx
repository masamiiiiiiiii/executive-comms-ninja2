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
  CheckCircle 
} from "lucide-react";

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

  const emotionData = [
    { emotion: "自信", score: 82, color: "bg-green-500" },
    { emotion: "信頼性", score: 75, color: "bg-blue-500" },
    { emotion: "熱意", score: 88, color: "bg-orange-500" },
    { emotion: "落ち着き", score: 71, color: "bg-purple-500" }
  ];

  const timelineData = [
    { time: "0:15", event: "強い視線接触", score: 85, type: "positive" },
    { time: "0:45", event: "ジェスチャー効果的", score: 78, type: "positive" },
    { time: "1:20", event: "話速やや速い", score: 65, type: "warning" },
    { time: "2:10", event: "表情豊か", score: 90, type: "positive" }
  ];

  const recommendations = [
    "視線をカメラにより集中させることで信頼感が向上します",
    "話速を10-15%下げることで理解しやすくなります", 
    "手のジェスチャーの使用頻度を20%増やすことを推奨",
    "笑顔の持続時間を延ばすことで親しみやすさが向上"
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
                感情表現分析
              </CardTitle>
              <CardDescription>
                表情・ジェスチャーから読み取られた感情の強度
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {emotionData.map((emotion, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{emotion.emotion}</span>
                    <span className="text-sm text-muted-foreground">{emotion.score}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${emotion.color}`}
                      style={{ width: `${emotion.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                パフォーマンス・タイムライン
              </CardTitle>
              <CardDescription>
                動画全体を通じた重要なポイントの分析
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timelineData.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="text-sm font-mono bg-secondary px-2 py-1 rounded">
                      {item.time}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{item.event}</p>
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
              <div className="space-y-3">
                {recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{rec}</p>
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