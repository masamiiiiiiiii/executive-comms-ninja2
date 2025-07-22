import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowLeft, Download, Globe, Users, BarChart3, Brain, Target, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Proposal = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <Link to="/">
          <Button variant="ghost" className="mb-6 hover:bg-secondary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Analysis
          </Button>
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Executive Comms Ninja
          </h1>
          <h2 className="text-3xl font-semibold mb-4">Global Deployment Proposal</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            AI-powered video analysis platform for optimizing B2B executive communications and leadership presence
          </p>
        </div>

        {/* Executive Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-6 w-6 text-primary" />
              Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p className="text-lg leading-relaxed">
              Executive Comms Ninja revolutionizes how global organizations assess and enhance their leadership communication effectiveness. 
              By leveraging advanced AI technologies including facial expression analysis, voice pattern recognition, and natural language processing, 
              our platform provides actionable insights for C-suite executives and senior leadership teams.
            </p>
            <p className="text-lg leading-relaxed mt-4">
              The platform addresses the critical need for objective, data-driven feedback on executive presence, 
              enabling organizations to optimize their leadership communications for maximum impact in B2B environments.
            </p>
          </CardContent>
        </Card>

        {/* Key Features */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              Core Features & Capabilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">YouTube Video Analysis</h4>
                    <p className="text-sm text-muted-foreground">Direct URL input with automated processing and multi-participant identification</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Executive Identification System</h4>
                    <p className="text-sm text-muted-foreground">Specify company, role, and individual for targeted analysis in multi-person videos</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Comprehensive Analytics Dashboard</h4>
                    <p className="text-sm text-muted-foreground">Overview metrics, 5-point emotion radar charts, timeline analysis, and actionable recommendations</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Performance Benchmarking</h4>
                    <p className="text-sm text-muted-foreground">Compare against Fortune 500 CEO communication standards and industry best practices</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">What-Why-How Recommendations</h4>
                    <p className="text-sm text-muted-foreground">Specific improvement points with scientific rationale and executive exemplars</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Data Export Capabilities</h4>
                    <p className="text-sm text-muted-foreground">CSV export for analysis results, metrics tracking, and reporting integration</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Enterprise-Grade Security</h4>
                    <p className="text-sm text-muted-foreground">SOC 2 compliant infrastructure with role-based access controls</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Global Deployment Ready</h4>
                    <p className="text-sm text-muted-foreground">Multi-language support and regional compliance frameworks</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Plans */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary" />
              Investment & Pricing Structure
            </CardTitle>
            <CardDescription>
              Flexible pricing models designed for global enterprise deployment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Free Tier */}
              <Card className="border-2 border-secondary">
                <CardHeader>
                  <CardTitle className="text-lg">Pilot Program</CardTitle>
                  <div className="text-3xl font-bold">Free</div>
                  <CardDescription>Perfect for initial evaluation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Up to 1-minute video analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Basic emotion analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Summary recommendations</span>
                  </div>
                </CardContent>
              </Card>

              {/* Pro Plan */}
              <Card className="border-2 border-primary shadow-lg scale-105">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">Professional</CardTitle>
                    <Badge className="bg-primary">Recommended</Badge>
                  </div>
                  <div className="text-3xl font-bold">$79<span className="text-lg font-normal text-muted-foreground">/month</span></div>
                  <CardDescription>Ideal for executive teams</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">100 minutes monthly analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Full feature access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">CSV export capabilities</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">12-month data retention</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Email support</span>
                  </div>
                </CardContent>
              </Card>

              {/* Enterprise Plan */}
              <Card className="border-2 border-secondary">
                <CardHeader>
                  <CardTitle className="text-lg">Enterprise</CardTitle>
                  <div className="text-3xl font-bold">$199<span className="text-lg font-normal text-muted-foreground">/month</span></div>
                  <CardDescription>For global organizations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">300 minutes monthly analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Up to 10 team members</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">API integration access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Priority support (chat/phone)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Custom reporting</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Technical Architecture */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              Technical Architecture & Implementation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-3">Frontend Technologies</h4>
                <ul className="space-y-2 text-sm">
                  <li>• React 18 with TypeScript for type safety</li>
                  <li>• Tailwind CSS for responsive design</li>
                  <li>• Progressive Web App capabilities</li>
                  <li>• Real-time dashboard updates</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Backend Infrastructure</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Supabase for authentication & data management</li>
                  <li>• Edge Functions for serverless processing</li>
                  <li>• PostgreSQL for enterprise data storage</li>
                  <li>• Row-level security implementation</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">AI & Analytics APIs</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Google Cloud Video Intelligence API</li>
                  <li>• Speech-to-Text with emotion detection</li>
                  <li>• Natural Language Processing</li>
                  <li>• YouTube Data API v3 integration</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Security & Compliance</h4>
                <ul className="space-y-2 text-sm">
                  <li>• SOC 2 Type II compliance ready</li>
                  <li>• GDPR & CCPA data protection</li>
                  <li>• End-to-end encryption</li>
                  <li>• Regular security audits</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Implementation Timeline */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-6 w-6 text-primary" />
              Global Deployment Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">1</div>
                <div>
                  <h4 className="font-semibold">Infrastructure Setup (Week 1-2)</h4>
                  <p className="text-sm text-muted-foreground">Supabase integration, Google Cloud API setup, authentication system</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">2</div>
                <div>
                  <h4 className="font-semibold">Core Features Implementation (Week 3-4)</h4>
                  <p className="text-sm text-muted-foreground">Video analysis engine, person identification, dashboard development</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">3</div>
                <div>
                  <h4 className="font-semibold">Billing & Export Systems (Week 5-6)</h4>
                  <p className="text-sm text-muted-foreground">Stripe integration, usage tracking, CSV export functionality</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">4</div>
                <div>
                  <h4 className="font-semibold">Testing & Deployment (Week 7-8)</h4>
                  <p className="text-sm text-muted-foreground">Comprehensive testing, security audit, production deployment</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ROI Calculation */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              Return on Investment Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-4">Cost Analysis (Monthly 100 minutes)</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Google Cloud APIs</span>
                    <span className="font-medium">$23</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Infrastructure & Hosting</span>
                    <span className="font-medium">$15</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Development & Maintenance</span>
                    <span className="font-medium">$25</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Support & Operations</span>
                    <span className="font-medium">$16</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total Operational Cost</span>
                    <span>$79</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Value Proposition</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Equivalent to 1 hour of executive coaching ($150-300)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>24/7 availability for instant analysis</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Objective, data-driven feedback</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Competitive benchmarking capabilities</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="text-center">
          <CardContent className="pt-6">
            <h3 className="text-2xl font-bold mb-4">Ready to Transform Executive Communications?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join leading global organizations in leveraging AI-powered insights to enhance leadership presence and communication effectiveness.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/">
                <Button size="lg">
                  Start Free Trial
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                <Download className="h-4 w-4 mr-2" />
                Download Proposal PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Proposal;