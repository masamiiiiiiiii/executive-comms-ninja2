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
            新しい分析を開始
          </Button>
          <AnalysisResults 
            videoTitle="CEO インタビュー - 企業戦略について"
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
            AI Video Analysis
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            YouTube動画からリーダーの表情・感情・メッセージ効果を分析し、B2Bコミュニケーションを最適化
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Main Analysis Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlayCircle className="h-6 w-6 text-primary" />
                動画分析を開始
              </CardTitle>
              <CardDescription>
                YouTube URLを入力して、リーダーのプレゼンテーション分析を開始してください
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
                  {analyzing ? "分析中..." : "分析開始"}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                無料版: 1分まで | 有料版: 無制限の動画分析
              </p>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Brain className="h-5 w-5 text-primary" />
                  表情・感情分析
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  AI技術により表情、視線、ジェスチャーから自信度・信頼性を数値化
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  メッセージ効果測定
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  音声トーン・話速・一貫性から聴衆への影響力を評価
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5 text-primary" />
                  B2B特化レポート
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  企業コミュニケーションに特化した改善提案とベンチマーク
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
