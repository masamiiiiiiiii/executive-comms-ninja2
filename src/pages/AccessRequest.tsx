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
            email: null, // No email required
          }
        ]);

      if (dbError) {
        throw dbError;
      }

      // Send notification email to admin
      const { error: emailError } = await supabase.functions.invoke('send-access-notification', {
        body: {
          name: name.trim(),
          email: null,
          type: 'request'
        }
      });

      if (emailError) {
        console.error('Email sending error:', emailError);
        // Don't fail the whole process if email fails
      }

      setSubmitted(true);
      toast({
        title: "Request Submitted",
        description: "Your access request has been submitted for admin review.",
      });
    } catch (error: any) {
      console.error('Access request error:', error);
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: error.message || "An error occurred while submitting your request. Please try again.",
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
              Request Submitted
            </CardTitle>
            <CardDescription>
              Your access request has been submitted and is pending admin review.
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
            Access Request Form
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="John Doe"
                minLength={2}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Access Request'
              )}
            </Button>
          </form>
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground text-center">
              After submission, your request will be reviewed by an administrator.<br/>
              Approved access is valid for 1 month.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessRequest;