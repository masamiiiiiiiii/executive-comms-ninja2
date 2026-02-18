import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, Clock, Search, Filter, ArrowUpRight, ArrowDownRight, Calendar, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface AnalysisRecord {
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

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");
  
  useEffect(() => {
    if (user) {
      loadAnalyses();
    }
  }, [user]);

  const loadAnalyses = async () => {
    try {
      const { data, error } = await supabase
        .from('video_analyses')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading analyses:', error);
        toast({
          title: "Error",
          description: "Failed to load analysis history. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setAnalyses(data || []);
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewAnalysis = (analysis: AnalysisRecord) => {
    // Navigate to individual analysis page with unique URL
    navigate(`/analysis/${analysis.id}`);
  };

  const deleteAnalysis = async (analysisId: string, videoTitle: string) => {
    try {
      const { error } = await supabase
        .from('video_analyses')
        .delete()
        .eq('id', analysisId)
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error deleting analysis:', error);
        toast({
          title: "Error",
          description: "Failed to delete analysis. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Update local state
      setAnalyses(prev => prev.filter(analysis => analysis.id !== analysisId));
      
      toast({
        title: "Analysis Deleted",
        description: `Successfully deleted analysis for "${videoTitle}".`,
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredAnalyses = analyses.filter(analysis => {
    const matchesSearch = 
      analysis.video_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      analysis.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      analysis.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCompany = companyFilter === "all" || analysis.company === companyFilter;
    
    return matchesSearch && matchesCompany;
  });

  const uniqueCompanies = [...new Set(analyses.map(a => a.company))];

  const totalAnalyses = analyses.length;
  const averageScore = analyses.length > 0 
    ? analyses.reduce((sum, a) => sum + (a.analysis_results?.overallScore || 0), 0) / analyses.length 
    : 0;
  
  const totalHoursAnalyzed = analyses.reduce((sum, a) => sum + a.video_duration_hours, 0);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreTrend = (score: number, prevScore?: number) => {
    if (!prevScore) return null;
    if (score > prevScore) return <ArrowUpRight className="h-4 w-4 text-green-600" />;
    if (score < prevScore) return <ArrowDownRight className="h-4 w-4 text-red-600" />;
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">
            Analyze your performance trends and track improvement over time
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAnalyses}</div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getScoreColor(averageScore)}`}>
                {averageScore.toFixed(1)}
              </div>
              <p className="text-xs text-muted-foreground">
                +5.2% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hours Analyzed</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalHoursAnalyzed.toFixed(1)}h</div>
              <p className="text-xs text-muted-foreground">
                Video content analyzed
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="list" className="space-y-6">
          <TabsList>
            <TabsTrigger value="list">Analysis History</TabsTrigger>
            <TabsTrigger value="trends">Score Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filter & Search</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by title, company, or role..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={companyFilter} onValueChange={setCompanyFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Companies</SelectItem>
                      {uniqueCompanies.map(company => (
                        <SelectItem key={company} value={company}>{company}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Analysis List */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Analyses</CardTitle>
                <CardDescription>
                  {filteredAnalyses.length} of {totalAnalyses} analyses
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredAnalyses.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No analyses found matching your criteria.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Video</TableHead>
                        <TableHead>Company/Role</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAnalyses.map((analysis, index) => {
                        const prevScore = index < filteredAnalyses.length - 1 
                          ? filteredAnalyses[index + 1].analysis_results?.overallScore 
                          : undefined;
                        
                        return (
                          <TableRow key={analysis.id}>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="font-medium truncate max-w-48">
                                  {analysis.video_title || `${analysis.company} Interview`}
                                </div>
                                 {analysis.analysis_results?.videoPublishedAt && (
                                   <div className="text-xs text-muted-foreground flex items-center gap-1">
                                     <Calendar className="h-3 w-3" />
                                     Published: {new Date(analysis.analysis_results.videoPublishedAt).toLocaleDateString('en-US')}
                                   </div>
                                 )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <Badge variant="outline">{analysis.company}</Badge>
                                <div className="text-sm text-muted-foreground">
                                  {analysis.role}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className={`font-bold ${getScoreColor(analysis.analysis_results?.overallScore || 0)}`}>
                                  {analysis.analysis_results?.overallScore || 0}
                                </span>
                                {getScoreTrend(analysis.analysis_results?.overallScore || 0, prevScore)}
                              </div>
                            </TableCell>
                            <TableCell>
                              {(analysis.video_duration_hours * 60).toFixed(0)}min
                            </TableCell>
                            <TableCell>
                              {new Date(analysis.created_at).toLocaleDateString('en-US')}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button 
                                  variant="default" 
                                  size="sm"
                                  onClick={() => viewAnalysis(analysis)}
                                >
                                  View Analysis
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => window.open(analysis.youtube_url, '_blank')}
                                >
                                  View Video
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => deleteAnalysis(analysis.id, analysis.video_title || `${analysis.company} Interview`)}
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends">
            <Card>
              <CardHeader>
                <CardTitle>Score Trends</CardTitle>
                <CardDescription>
                  Track your performance improvement over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  Chart visualization coming soon...
                  <br />
                  Will show score trends over time with interactive graphs
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;