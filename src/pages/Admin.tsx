import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ProtectedRoute } from '@/components/ProtectedRoute';

interface AccessRequest {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  approved_at?: string;
  expires_at?: string;
}

const Admin = () => {
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { toast } = useToast();

  const loadRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('access_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests((data || []) as AccessRequest[]);
    } catch (error: any) {
      console.error('Error loading requests:', error);
      toast({
        variant: "destructive",
        title: "データ読み込みエラー",
        description: "申請データの読み込みに失敗しました。",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (requestId: string, action: 'approved' | 'rejected') => {
    setProcessingId(requestId);
    
    try {
      const request = requests.find(r => r.id === requestId);
      if (!request) throw new Error('Request not found');

      const updateData: any = {
        status: action,
        updated_at: new Date().toISOString(),
      };

      if (action === 'approved') {
        const approvedAt = new Date();
        const expiresAt = new Date(approvedAt.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
        updateData.approved_at = approvedAt.toISOString();
        updateData.expires_at = expiresAt.toISOString();
      }

      const { error: updateError } = await supabase
        .from('access_requests')
        .update(updateData)
        .eq('id', requestId);

      if (updateError) throw updateError;

      // Send notification email
      const { error: emailError } = await supabase.functions.invoke('send-access-notification', {
        body: {
          name: request.name,
          email: request.email,
          type: action === 'approved' ? 'approval' : 'rejection',
          accessUrl: action === 'approved' ? window.location.origin : undefined,
        }
      });

      if (emailError) {
        console.error('Email sending error:', emailError);
      }

      await loadRequests();
      
      toast({
        title: action === 'approved' ? "承認しました" : "却下しました",
        description: `${request.name}さんの申請を${action === 'approved' ? '承認' : '却下'}し、メールを送信しました。`,
      });
    } catch (error: any) {
      console.error('Error processing request:', error);
      toast({
        variant: "destructive",
        title: "処理エラー",
        description: error.message || "申請の処理中にエラーが発生しました。",
      });
    } finally {
      setProcessingId(null);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600"><Clock className="w-3 h-3 mr-1" />保留中</Badge>;
      case 'approved':
        return <Badge variant="outline" className="text-green-600"><CheckCircle className="w-3 h-3 mr-1" />承認済み</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-red-600"><XCircle className="w-3 h-3 mr-1" />却下済み</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                アクセス申請管理
              </CardTitle>
              <CardDescription>
                Executive Comms Ninjaへのアクセス申請を管理します
              </CardDescription>
            </CardHeader>
          </Card>

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {requests.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">申請はありません</p>
                  </CardContent>
                </Card>
              ) : (
                requests.map((request) => (
                  <Card key={request.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{request.name}</h3>
                            {getStatusBadge(request.status)}
                          </div>
                          <p className="text-muted-foreground mb-1">{request.email}</p>
                          <p className="text-sm text-muted-foreground">
                            申請日時: {new Date(request.created_at).toLocaleString('ja-JP')}
                          </p>
                          {request.approved_at && (
                            <p className="text-sm text-muted-foreground">
                              承認日時: {new Date(request.approved_at).toLocaleString('ja-JP')}
                            </p>
                          )}
                          {request.expires_at && (
                            <p className="text-sm text-muted-foreground">
                              有効期限: {new Date(request.expires_at).toLocaleString('ja-JP')}
                            </p>
                          )}
                        </div>
                        {request.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleApproval(request.id, 'approved')}
                              disabled={processingId === request.id}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {processingId === request.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  承認
                                </>
                              )}
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleApproval(request.id, 'rejected')}
                              disabled={processingId === request.id}
                            >
                              {processingId === request.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <XCircle className="w-4 h-4 mr-1" />
                                  却下
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Admin;