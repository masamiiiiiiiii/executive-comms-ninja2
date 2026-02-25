import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, MapPin, Scale, Eye, Info } from "lucide-react";

export default function LegalPage() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans py-24 px-6 relative overflow-hidden">
            <div className="max-w-4xl mx-auto relative z-10 space-y-16">

                {/* Header */}
                <div className="text-center space-y-4">
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Legal & Operations</Badge>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Policies & Disclaimers</h1>
                    <p className="text-slate-500">Last Updated: February 2026</p>
                </div>

                {/* Terms of Service Section */}
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="border-b border-slate-100 bg-slate-50">
                        <CardTitle className="flex items-center gap-2"><Scale className="w-5 h-5 text-emerald-600" /> Terms of Service</CardTitle>
                        <CardDescription>Rules and guidelines for interacting with the Vanguard Intelligence Platform.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 text-sm text-slate-600 space-y-4 leading-relaxed">
                        <h3 className="font-bold text-slate-800">1. Nature of the Service</h3>
                        <p>Executive Comms Ninja (hereinafter "The Service") provides automated, AI-driven analysis of public video content. The insights, scores, and recommendations generated are for educational and entertainment purposes only.</p>

                        <h3 className="font-bold text-slate-800">2. Accuracy and Liability</h3>
                        <p>The Service utilizes advanced Large Language Models (LLMs) to estimate emotional, strategic, and vocal metrics based purely on generated text transcripts and metadata. The Service does not provide psychological diagnosis, nor does it guarantee 100% accuracy of behavioral interpretations. The provider assumes no liability for business, PR, or communication decisions made based on the Service's outputs.</p>

                        <h3 className="font-bold text-slate-800">3. Usage Quotas and Subscriptions</h3>
                        <p>Purchases of "Tactical Deep Dives" are non-refundable and constitute a single, complete analysis of a provided URL. "Executive Pro" subscriptions grant a monthly quota of analyses. Abuse of the system, attempts to reverse-engineer the API, or excessive rate-limiting violations will result in immediate account termination without refund.</p>
                    </CardContent>
                </Card>

                {/* Privacy Policy Section */}
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="border-b border-slate-100 bg-slate-50">
                        <CardTitle className="flex items-center gap-2"><Eye className="w-5 h-5 text-emerald-600" /> Privacy Policy</CardTitle>
                        <CardDescription>How we handle user data and video metadata.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 text-sm text-slate-600 space-y-4 leading-relaxed">
                        <p>We respect your privacy. As a core principle, The Service requires minimal personal data.</p>

                        <h3 className="font-bold text-slate-800">Data Collection</h3>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>We collect standard payment information securely processed through Stripe. We do not store raw credit card details on our servers.</li>
                            <li>We store the YouTube URLs submitted for analysis, along with the generated AI reports, to populate your Dashboard history.</li>
                        </ul>

                        <h3 className="font-bold text-slate-800">Data Usage</h3>
                        <p>Submitted URLs must point to publicly accessible videos. We do not analyze or store videos behind private firewalls or authentication walls. Aggregated, anonymized analysis scores may be used to calibrate our "Industry Average" benchmark metrics periodically.</p>
                    </CardContent>
                </Card>

                {/* FAQ / Support Section */}
                <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-emerald-50 to-teal-50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Info className="w-5 h-5 text-emerald-600" /> Frequently Asked Questions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-2">
                        <div>
                            <h4 className="font-bold text-slate-800 mb-1">Does the AI actually "watch" the video?</h4>
                            <p className="text-sm text-slate-600">Currently, our system performs a highly advanced multimodal text-and-metadata analysis based on the video's transcript. We use Google's Gemini models to infer vocal pacing, tone, and strategic intent from the structure and content of the speech. Future "V3" updates will incorporate direct video-stream processing.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 mb-1">Why did my analysis fail?</h4>
                            <p className="text-sm text-slate-600">The most common reason for failure is submitting a YouTube video that does not have closed captions/transcripts enabled (either manual or auto-generated by YouTube). The video must also be public and embeddable.</p>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
