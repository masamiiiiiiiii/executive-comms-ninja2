import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AccessRequest = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Insert access request to database
      const { error: dbError } = await supabase
        .from('access_requests')
        .insert([
          {
            name: name.trim(),
            email: email.trim().toLowerCase(),
          }
        ]);

      if (dbError) {
        throw dbError;
      }

      // Send notification email to admin
      const { error: emailError } = await supabase.functions.invoke('send-access-notification', {
        body: {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          type: 'request'
        }
      });

      if (emailError) {
        console.error('Email sending error:', emailError);
        // Don't fail the whole process if email fails
      }

      setSubmitted(true);
      toast({
        title: "申請を送信いたしました",
        description: "管理者による審査後、メールでご連絡いたします。",
      });
    } catch (error: any) {
      console.error('Access request error:', error);
      toast({
        variant: "destructive",
        title: "申請送信エラー",
        description: error.message || "申請の送信中にエラーが発生しました。もう一度お試しください。",
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              申請を受け付けました
            </CardTitle>
            <CardDescription>
              管理者による審査後、メールでご連絡いたします。しばらくお待ちください。
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Executive Comms Ninja
          </CardTitle>
          <CardDescription>
            アクセス申請フォーム
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">お名前（本名）</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="山田太郎"
                minLength={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your.email@company.com"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  申請送信中...
                </>
              ) : (
                'アクセス申請を送信'
              )}
            </Button>
          </form>
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground text-center">
              申請後、管理者による審査を経てアクセス権限が付与されます。<br/>
              承認されたアクセス権限の有効期間は1ヶ月間です。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessRequest;