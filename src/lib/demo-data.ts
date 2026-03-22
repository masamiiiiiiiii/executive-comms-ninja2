// Static demo data for Jack Welch analysis — used by /[lang]/demo page
// Source: mirrors backend DEMO_MODE data in routers/analysis.py
// YouTube URL: https://www.youtube.com/watch?v=VM0AU-vPNeQ

export const DEMO_YOUTUBE_URL = "https://www.youtube.com/watch?v=VM0AU-vPNeQ";
export const DEMO_VIDEO_TITLE = "Jack Welch Leadership Interview";
export const DEMO_TARGET_PERSON_EN = "Jack Welch";
export const DEMO_TARGET_PERSON_JA = "ジャック・ウェルチ";

export const DEMO_DATA_EN = {
    id: "demo",
    status: "completed",
    youtube_url: DEMO_YOUTUBE_URL,
    video_title: DEMO_VIDEO_TITLE,
    target_person: DEMO_TARGET_PERSON_EN,
    role: "Legendary CEO",
    company: "General Electric",
    analysis_results: {
        analysis_reliability: {
            score: 98,
            notice: "High confidence analysis based on legendary Jack Welch interview footage.",
        },
        video_metadata: {
            duration: "09:12",
            published_date: "2018-05-15",
            extracted_interviewee_name: "Jack Welch",
            channel_title: "Leadership Vault",
        },
        overall_performance: {
            score: 96,
            level: "Legendary",
            summary:
                "A masterclass in executive presence. Jack Welch's communication is defined by extreme candor, high energy, and absolute conviction—translating complex business philosophies into hard-hitting, accessible truths that command the room.",
            badge: "Master Communicator",
        },
        high_level_metrics: {
            confidence: { score: 98, label: "Confidence" },
            trustworthiness: { score: 90, label: "Authenticity" },
            engagement: { score: 95, label: "Engagement" },
            clarity: { score: 94, label: "Clarity" },
        },
        detailed_analysis: {
            voice_analysis: {
                speaking_rate: "Energetic Pace",
                pause_frequency: "Strategic",
                volume_variation: "Highly Dynamic",
                clarity_rating: "Excellent",
                observation:
                    "Speaker maintained an energetic, staccato rhythm throughout. He frequently leaned in and deployed volume shifts to passionately emphasize core principles like 'candor' and 'differentiation'.",
            },
            message_analysis: {
                keyword_density: "Very High",
                emotional_tone: "Assertive",
                structure_rating: "Direct",
                logic_flow: "Anecdote-driven",
                observation:
                    "Utterly void of corporate speak. Messages were delivered with blunt honesty, using personal anecdotes to enforce a strict meritocratic philosophy rooted in decades of operational proof.",
            },
        },
        emotion_radar: {
            confidence: 98,
            empathy: 65,
            authority: 99,
            composure: 90,
            enthusiasm: 96,
            trust: 88,
        },
        timeline_analysis: [
            {
                timestamp: "00:25",
                event: "Blunt Assertion",
                sentiment: "neutral",
                emotion_label: "Authoritative",
                confidence_score: 99,
                engagement_score: 90,
                insight:
                    "Immediately took control of the narrative, establishing dominance with a blunt truth about organizational candor—no preamble, no hedging.",
            },
            {
                timestamp: "02:10",
                event: "Passionate Anecdote",
                sentiment: "positive",
                emotion_label: "Enthusiastic",
                confidence_score: 95,
                engagement_score: 96,
                insight:
                    "Leaned forward, increasing vocal intensity to passionately describe the 20-70-10 differentiation rule. Peak engagement moment of the session.",
            },
            {
                timestamp: "05:40",
                event: "No-Nonsense Rebuttal",
                sentiment: "neutral",
                emotion_label: "Intense",
                confidence_score: 98,
                engagement_score: 92,
                insight:
                    "Swiftly dismissed a flawed premise in the interviewer's question, cutting straight to business reality with surgical precision.",
            },
        ],
        benchmark_comparison: {
            your_score: 96,
            industry_average: 74,
            top_ceos: 91,
            metrics: ["Confidence", "Authority", "Energy", "Clarity"],
            emotion_radar_benchmark: {
                confidence: 85,
                empathy: 80,
                authority: 88,
                composure: 82,
                enthusiasm: 75,
                trust: 85,
            },
        },
        recommendations: [
            {
                title: "Soften Delivery on Sensitive Topics",
                rationale:
                    "Extreme candor drives performance culture but can alienate segments of the modern workforce, particularly in high-empathy environments.",
                strategy:
                    "Incorporate a brief empathetic preamble before delivering hard truths to broaden receptivity without compromising directness.",
                priority: "Low",
                timeframe: "Ongoing",
                expected_impact: "Meaningful improvement in broad stakeholder engagement scores",
            },
        ],
        key_takeaways: [
            "Master-class in conveying absolute conviction and authority through visceral, energetic delivery—presence defined by personality, not polish.",
            "Zero reliance on corporate jargon; language was accessible, blunt, and highly memorable across all audience segments.",
            "A vivid demonstration of executive presence built on force of personality and intellectual certainty rather than rehearsed perfection.",
        ],
        summary:
            "Jack Welch's performance in this interview represents a rare archetype of executive communication: raw, conviction-driven authority that operates entirely outside the conventions of polished corporate messaging. His delivery architecture is built on three pillars—positional certainty, evidence-based argumentation through personal anecdote, and relentless energy maintenance.\n\nVocally, Welch operates in the top percentile of communicators analyzed through this platform. The energetic staccato rhythm he sustains creates a forward-momentum cadence that makes disengagement psychologically difficult. Strategic volume variation—particularly before core philosophical assertions—functions as a natural emphasis mechanism that directs audience attention with remarkable precision.\n\nThe one area warranting calibration is the empathy dimension. For a modern audience navigating complex organizational change, integrating brief empathetic markers before hard-truth delivery would expand audience receptivity without eroding the foundational authority that defines his communication brand. This is a refinement, not a correction—Welch's style remains elite by any measurable standard.",
    },
};

export const DEMO_DATA_JA = {
    id: "demo",
    status: "completed",
    youtube_url: DEMO_YOUTUBE_URL,
    video_title: DEMO_VIDEO_TITLE,
    target_person: DEMO_TARGET_PERSON_JA,
    role: "伝説的CEO",
    company: "ゼネラル・エレクトリック",
    analysis_results: {
        analysis_reliability: {
            score: 98,
            notice: "伝説的なジャック・ウェルチ氏のインタビュー映像に基づく、信頼性の高い分析結果です。",
        },
        video_metadata: {
            duration: "09:12",
            published_date: "2018-05-15",
            extracted_interviewee_name: "ジャック・ウェルチ",
            channel_title: "Leadership Vault",
        },
        overall_performance: {
            score: 96,
            level: "卓越",
            summary:
                "極めて高い率直さ、エネルギー、そして揺るぎない確信——ジャック・ウェルチ氏のコミュニケーションは、複雑な経営哲学を万人に響く力強い真実として昇華させた、エグゼクティブ・プレゼンスの到達点を体現しています。",
            badge: "マスター・コミュニケーター",
        },
        high_level_metrics: {
            confidence: { score: 98, label: "自信と確信" },
            trustworthiness: { score: 90, label: "信頼性" },
            engagement: { score: 95, label: "説得力と求心力" },
            clarity: { score: 94, label: "明瞭さ" },
        },
        detailed_analysis: {
            voice_analysis: {
                speaking_rate: "エネルギッシュなペース",
                pause_frequency: "戦略的な間合い",
                volume_variation: "極めてダイナミック",
                clarity_rating: "優秀",
                observation:
                    "歯切れのよいエネルギッシュなリズムを終始維持しています。頻繁に身を乗り出し、声のトーンを巧みに変化させながら、「率直さ」や「差別化」といった核心となる原則を情熱的に強調しています。",
            },
            message_analysis: {
                keyword_density: "非常に高い水準",
                emotional_tone: "断定的かつ力強い",
                structure_rating: "直線的で直感的",
                logic_flow: "エピソード駆動型",
                observation:
                    "無味乾燥な企業用語が一切排除されています。数十年の経営実績に裏打ちされた哲学を、ご自身のエピソードを交えながら飾らない生の言葉で率直に伝えています。",
            },
        },
        emotion_radar: {
            confidence: 98,
            empathy: 65,
            authority: 99,
            composure: 90,
            enthusiasm: 96,
            trust: 88,
        },
        timeline_analysis: [
            {
                timestamp: "00:25",
                event: "率直な主張と主導権の掌握",
                sentiment: "neutral",
                emotion_label: "権威的",
                confidence_score: 99,
                engagement_score: 90,
                insight:
                    "前置きも逃げ道もなく、冒頭から対話の主導権を完全に握り、組織の「率直さ」に関する本質を単刀直入に述べることで圧倒的な存在感を確立しています。",
            },
            {
                timestamp: "02:10",
                event: "情熱的な信念の共有",
                sentiment: "positive",
                emotion_label: "熱狂的",
                confidence_score: 95,
                engagement_score: 96,
                insight:
                    "身を乗り出し、声のトーンを意図的に高めながら「20-70-10の法則」を聴衆の心に訴えかけるように情熱的に語る。このセッション最大の求心力のピークです。",
            },
            {
                timestamp: "05:40",
                event: "断固たる反論と方向転換",
                sentiment: "neutral",
                emotion_label: "理性的かつ情熱的",
                confidence_score: 98,
                engagement_score: 92,
                insight:
                    "インタビュアーの誤った前提を即座に退け、ビジネスの厳しい現実という本質的な議論へと外科的な精度で鋭く切り込んでいます。",
            },
        ],
        benchmark_comparison: {
            your_score: 96,
            industry_average: 74,
            top_ceos: 91,
            metrics: ["自信", "権威と影響力", "熱量", "メッセージの明瞭さ"],
            emotion_radar_benchmark: {
                confidence: 85,
                empathy: 80,
                authority: 88,
                composure: 82,
                enthusiasm: 75,
                trust: 85,
            },
        },
        recommendations: [
            {
                title: "センシティブな話題における表現の緩和",
                rationale:
                    "極端な率直さは強力な推進力を生む一方で、共感を重視する現代の職場環境において、一部の聴衆に警戒心を抱かせるリスクを孕んでいます。",
                strategy:
                    "厳しい事実を伝える直前に、相手の立場を認めるワンクッションとなる共感の言葉を添えることで、直接性を損なうことなく心理的受容性を高めることができます。",
                priority: "Low",
                timeframe: "継続的",
                expected_impact: "幅広いステークホルダーとのエンゲージメント指標の顕著な改善",
            },
        ],
        key_takeaways: [
            "内側から滲み出る圧倒的なエネルギーにより、絶対的な確信と権威の強さを体現する——磨き上げられた完璧さではなく、個性によって定義されるプレゼンスの頂点。",
            "組織特有のコーポレート・スピークに一切依存せず、あらゆる聴衆層に届く、誰もが直感的に理解できる生の言葉選びが記憶に深く刻まれます。",
            "入念に計算された演技ではなく、強烈なカリスマ性と知的確信によって構成される、本物のエグゼクティブ・プレゼンスを見事に実証しています。",
        ],
        summary:
            "このインタビューにおけるジャック・ウェルチ氏のパフォーマンスは、エグゼクティブ・コミュニケーションの稀有な原型を体現しています——磨き上げられたコーポレート・メッセージングの慣習を完全に超越した、生の確信に基づく権威です。彼の話法は三つの柱で構成されています：立場の絶対的な確実性、個人のエピソードを通じた証拠に基づく論証、そして途切れることのないエネルギーの持続。\n\n声のデータという観点では、ウェルチ氏はこのプラットフォームで分析した話者の中でも最上位に位置します。彼が維持するエネルギッシュな話法リズムは、聴衆が心理的に離脱することを困難にする前進力ある勢いを生み出します。核心的な哲学を述べる直前の戦略的な声量の変化は、自然な強調メカニズムとして機能し、卓越した精度で聴衆の注意を誘導します。\n\n唯一調整の余地があるのは共感の次元です。複雑な組織変革を進める現代の聴衆に対して、厳しい真実を伝える前に短い共感のマーカーを組み込むことで、彼のコミュニケーション・ブランドの根幹である権威を損なうことなく、より広い聴衆の受容性を高めることができるでしょう。これは修正ではなく、磨き上げです——ウェルチ氏のスタイルは、あらゆる測定基準においてエリートの域に達しています。",
    },
};
