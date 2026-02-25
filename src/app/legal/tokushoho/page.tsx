import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scale, Building2 } from "lucide-react";

export default function TokushohoPage() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans py-24 px-6 relative overflow-hidden">
            <div className="max-w-4xl mx-auto relative z-10 space-y-12">

                {/* Header */}
                <div className="text-center space-y-4">
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Legal Disclosure</Badge>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">特定商取引法に基づく表記</h1>
                    <p className="text-slate-500">Specified Commercial Transactions Act</p>
                </div>

                {/* Disclosure Content */}
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="border-b border-slate-100 bg-slate-50">
                        <CardTitle className="flex items-center gap-2"><Building2 className="w-5 h-5 text-emerald-600" /> 事業者情報及び取引条件</CardTitle>
                        <CardDescription>当サービスにおける特定商取引法に基づく開示事項を以下の通り定めます。</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-slate-600">
                                <tbody className="divide-y divide-slate-100">
                                    <tr className="hover:bg-slate-50/50 transition-colors">
                                        <th className="py-4 pr-4 font-bold text-slate-800 w-1/3 align-top">販売事業者名</th>
                                        <td className="py-4 text-slate-700">【事業者名・会社名を入力してください】</td>
                                    </tr>
                                    <tr className="hover:bg-slate-50/50 transition-colors">
                                        <th className="py-4 pr-4 font-bold text-slate-800 align-top">運営統括責任者</th>
                                        <td className="py-4 text-slate-700">【代表者名 または 責任者名を入力してください】</td>
                                    </tr>
                                    <tr className="hover:bg-slate-50/50 transition-colors">
                                        <th className="py-4 pr-4 font-bold text-slate-800 align-top">所在地</th>
                                        <td className="py-4 text-slate-700">〒【郵便番号】<br />【都道府県・市区町村・番地・建物名などを入力してください】</td>
                                    </tr>
                                    <tr className="hover:bg-slate-50/50 transition-colors">
                                        <th className="py-4 pr-4 font-bold text-slate-800 align-top">電話番号</th>
                                        <td className="py-4 text-slate-700">【電話番号を入力してください】<br /><span className="text-xs text-slate-500">※サービスに関するお問い合わせは、記録を残すため以下のメールアドレスまたは公式XアカウントのDMにて承っております。</span></td>
                                    </tr>
                                    <tr className="hover:bg-slate-50/50 transition-colors">
                                        <th className="py-4 pr-4 font-bold text-slate-800 align-top">メールアドレス</th>
                                        <td className="py-4 text-slate-700">【メールアドレスを入力してください】</td>
                                    </tr>
                                    <tr className="hover:bg-slate-50/50 transition-colors">
                                        <th className="py-4 pr-4 font-bold text-slate-800 align-top">販売価格</th>
                                        <td className="py-4 text-slate-700">
                                            各ご購入ページ（Pricing）にて表示する価格とします。<br />
                                            ・Tactical Deep Dive: $49<br />
                                            ・Executive Pro: $149/月
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-slate-50/50 transition-colors">
                                        <th className="py-4 pr-4 font-bold text-slate-800 align-top">商品代金以外に必要な費用</th>
                                        <td className="py-4 text-slate-700">
                                            インターネット接続料金その他の電気通信回線の通信に関する費用はお客様にてご負担いただく必要があります。
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-slate-50/50 transition-colors">
                                        <th className="py-4 pr-4 font-bold text-slate-800 align-top">支払方法及び支払時期</th>
                                        <td className="py-4 text-slate-700">
                                            クレジットカード決済（Stripe）<br />
                                            【支払時期】<br />
                                            ・都度課金：商品購入時に決済が完了します。<br />
                                            ・定期課金：初回購入時に決済され、以降は毎月同日に自動決済されます。
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-slate-50/50 transition-colors">
                                        <th className="py-4 pr-4 font-bold text-slate-800 align-top">商品の引渡時期・サービス提供時期</th>
                                        <td className="py-4 text-slate-700">
                                            クレジットカード決済完了後、直ちに分析サービス及びシステムをご利用いただけます。
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-slate-50/50 transition-colors">
                                        <th className="py-4 pr-4 font-bold text-slate-800 align-top">返品・キャンセルに関する特約</th>
                                        <td className="py-4 text-slate-700">
                                            ・商品の性質上（デジタルコンテンツ・SaaS）、決済完了後の返品および返金には応じられません。<br />
                                            ・サブスクリプション（定期課金）の解約は、次回決済日の前日までに退会手続き（またはサポートへの連絡）をしていただくことで、次月以降の請求を停止することが可能です。途中で解約された場合でも、当該月の日割り計算による返金はいたしません。
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-slate-50/50 transition-colors">
                                        <th className="py-4 pr-4 font-bold text-slate-800 align-top">動作環境</th>
                                        <td className="py-4 text-slate-700">
                                            本サービスの利用にあたっては、最新のGoogle Chrome、Safari、Edge環境を推奨いたします。推奨環境以外のブラウザにてご利用いただいた場合、一部レイアウトの崩れや機能が正常に動作しない場合がございます。
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
