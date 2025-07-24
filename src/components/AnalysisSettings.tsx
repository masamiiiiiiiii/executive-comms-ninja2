import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { 
  Settings, 
  Target, 
  Zap, 
  Eye, 
  Mic, 
  Users, 
  Clock,
  RotateCcw,
  Save,
  Download,
  Upload
} from "lucide-react";

interface AnalysisSettingsProps {
  onSettingsChange: (settings: any) => void;
  currentSettings: any;
}

const AnalysisSettings = ({ onSettingsChange, currentSettings }: AnalysisSettingsProps) => {
  const [settings, setSettings] = useState({
    // 分析感度設定
    confidenceThreshold: currentSettings?.confidenceThreshold || 75,
    voiceAnalysisDepth: currentSettings?.voiceAnalysisDepth || 'standard',
    emotionSensitivity: currentSettings?.emotionSensitivity || 80,
    gestureDetection: currentSettings?.gestureDetection || true,
    
    // 業界比較設定
    industryBenchmark: currentSettings?.industryBenchmark || 'technology',
    executiveLevel: currentSettings?.executiveLevel || 'ceo',
    companySize: currentSettings?.companySize || 'large',
    
    // 表示設定
    showDetailedMetrics: currentSettings?.showDetailedMetrics || true,
    showEmotionTimeline: currentSettings?.showEmotionTimeline || true,
    showBenchmarkComparison: currentSettings?.showBenchmarkComparison || true,
    showRecommendations: currentSettings?.showRecommendations || true,
    
    // レポート設定
    reportLanguage: currentSettings?.reportLanguage || 'japanese',
    reportDetail: currentSettings?.reportDetail || 'comprehensive',
    exportFormat: currentSettings?.exportFormat || 'csv'
  });

  const handleSettingChange = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const resetToDefaults = () => {
    const defaultSettings = {
      confidenceThreshold: 75,
      voiceAnalysisDepth: 'standard',
      emotionSensitivity: 80,
      gestureDetection: true,
      industryBenchmark: 'technology',
      executiveLevel: 'ceo',
      companySize: 'large',
      showDetailedMetrics: true,
      showEmotionTimeline: true,
      showBenchmarkComparison: true,
      showRecommendations: true,
      reportLanguage: 'japanese',
      reportDetail: 'comprehensive',
      exportFormat: 'csv'
    };
    setSettings(defaultSettings);
    onSettingsChange(defaultSettings);
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'analysis-settings.json';
    link.click();
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string);
          setSettings(importedSettings);
          onSettingsChange(importedSettings);
        } catch (error) {
          console.error('設定ファイルの読み込みに失敗しました:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-background to-secondary/20 min-h-screen">
      {/* Header */}
      <div className="border-b border-gradient-to-r from-primary/20 to-accent/20 pb-6 bg-card/50 backdrop-blur-sm rounded-xl p-6 shadow-lg">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Settings className="h-6 w-6 text-primary" />
              </div>
              Analysis Settings
            </h2>
            <p className="text-muted-foreground text-lg">
              Customize analysis parameters and display preferences
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept=".json"
              onChange={importSettings}
              className="hidden"
              id="import-settings"
            />
            <label htmlFor="import-settings">
              <Button variant="outline" className="flex items-center gap-2 cursor-pointer" asChild>
                <span>
                  <Upload className="h-4 w-4" />
                  Import
                </span>
              </Button>
            </label>
            
            <Button onClick={exportSettings} variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            
            <Button onClick={resetToDefaults} variant="outline" className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="analysis" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-card to-secondary/30 p-1 rounded-xl shadow-lg">
          <TabsTrigger value="analysis" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground">Analysis</TabsTrigger>
          <TabsTrigger value="benchmark" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground">Benchmark</TabsTrigger>
          <TabsTrigger value="display" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground">Display</TabsTrigger>
          <TabsTrigger value="export" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground">Export</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-6 animate-fade-in">
          {/* 分析感度設定 */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-primary/5 hover-scale transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                Analysis Sensitivity
              </CardTitle>
              <CardDescription>
                Adjust the sensitivity and depth of analysis algorithms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Confidence Detection Threshold
                  </Label>
                  <Badge variant="secondary">{settings.confidenceThreshold}%</Badge>
                </div>
                <Slider
                  value={[settings.confidenceThreshold]}
                  onValueChange={(value) => handleSettingChange('confidenceThreshold', value[0])}
                  max={100}
                  min={50}
                  step={5}
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground">
                  Higher values make confidence detection more strict
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Mic className="h-4 w-4" />
                    Voice Analysis Depth
                  </Label>
                  <Badge variant="secondary">{settings.voiceAnalysisDepth}</Badge>
                </div>
                <Select value={settings.voiceAnalysisDepth} onValueChange={(value) => handleSettingChange('voiceAnalysisDepth', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Professional analysis includes pitch, tone, and micro-expressions
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Emotion Detection Sensitivity
                  </Label>
                  <Badge variant="secondary">{settings.emotionSensitivity}%</Badge>
                </div>
                <Slider
                  value={[settings.emotionSensitivity]}
                  onValueChange={(value) => handleSettingChange('emotionSensitivity', value[0])}
                  max={100}
                  min={30}
                  step={10}
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
                <div className="space-y-1">
                  <Label className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Gesture Detection
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Analyze hand movements and body language
                  </p>
                </div>
                <Switch
                  checked={settings.gestureDetection}
                  onCheckedChange={(checked) => handleSettingChange('gestureDetection', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benchmark" className="space-y-6 animate-fade-in">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-accent/5 hover-scale transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-accent/10">
                  <Target className="h-5 w-5 text-accent" />
                </div>
                Benchmark Comparison Settings
              </CardTitle>
              <CardDescription>
                Configure industry standards and comparison targets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Industry Benchmark</Label>
                <Select value={settings.industryBenchmark} onValueChange={(value) => handleSettingChange('industryBenchmark', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Executive Level</Label>
                <Select value={settings.executiveLevel} onValueChange={(value) => handleSettingChange('executiveLevel', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ceo">CEO</SelectItem>
                    <SelectItem value="cto">CTO</SelectItem>
                    <SelectItem value="cfo">CFO</SelectItem>
                    <SelectItem value="vp">VP</SelectItem>
                    <SelectItem value="director">Director</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Company Size</Label>
                <Select value={settings.companySize} onValueChange={(value) => handleSettingChange('companySize', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="startup">Startup (1-50)</SelectItem>
                    <SelectItem value="small">Small (51-200)</SelectItem>
                    <SelectItem value="medium">Medium (201-1000)</SelectItem>
                    <SelectItem value="large">Large (1001+)</SelectItem>
                    <SelectItem value="enterprise">Enterprise (10000+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="display" className="space-y-6 animate-fade-in">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-secondary/5 hover-scale transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-secondary/10">
                  <Eye className="h-5 w-5 text-secondary" />
                </div>
                Display Preferences
              </CardTitle>
              <CardDescription>
                Control which analysis sections are shown
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'showDetailedMetrics', label: 'Detailed Metrics', desc: 'Eye contact, voice stability, gestures' },
                { key: 'showEmotionTimeline', label: 'Emotion Timeline', desc: 'Time-series emotion analysis chart' },
                { key: 'showBenchmarkComparison', label: 'Benchmark Comparison', desc: 'Industry vs CEO performance' },
                { key: 'showRecommendations', label: 'Recommendations', desc: 'Actionable improvement suggestions' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 bg-background/50 rounded-lg border">
                  <div className="space-y-1">
                    <Label>{item.label}</Label>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch
                    checked={settings[item.key]}
                    onCheckedChange={(checked) => handleSettingChange(item.key, checked)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-6 animate-fade-in">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-muted/5 hover-scale transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-muted/20">
                  <Download className="h-5 w-5" />
                </div>
                Export Settings
              </CardTitle>
              <CardDescription>
                Configure report generation and export options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Report Language</Label>
                <Select value={settings.reportLanguage} onValueChange={(value) => handleSettingChange('reportLanguage', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="japanese">Japanese</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="bilingual">Bilingual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Report Detail Level</Label>
                <Select value={settings.reportDetail} onValueChange={(value) => handleSettingChange('reportDetail', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="summary">Summary</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="comprehensive">Comprehensive</SelectItem>
                    <SelectItem value="executive">Executive Brief</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Export Format</Label>
                <Select value={settings.exportFormat} onValueChange={(value) => handleSettingChange('exportFormat', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalysisSettings;