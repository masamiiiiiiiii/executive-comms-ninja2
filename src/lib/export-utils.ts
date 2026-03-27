import { toast } from "sonner";

// ─── PDF Export ─────────────────────────────────────────────────────────────
export const generatePDFExport = async (analysisData: any, _domElementId?: string) => {
    try {
        const results = analysisData?.analysis_results || {};
        const title = analysisData?.video_title || "Executive Analysis";
        const target = results?.video_metadata?.extracted_interviewee_name || analysisData?.target_person || "Speaker";
        const channel = results?.video_metadata?.channel_title || "";
        const published = results?.video_metadata?.published_date || "";
        const duration = results?.video_metadata?.duration || "";
        const score = results?.overall_performance?.score || 0;
        const level = results?.overall_performance?.level || "";
        const overallSummary = results?.overall_performance?.summary || "";
        const coachSummary = results?.summary || "";
        const reliability = results?.analysis_reliability || {};
        const metrics = results?.high_level_metrics || {};
        const radar = results?.emotion_radar || {};
        const benchmark = results?.benchmark_comparison || {};
        const voice = results?.detailed_analysis?.voice_analysis || {};
        const message = results?.detailed_analysis?.message_analysis || {};
        const timeline: any[] = results?.timeline_analysis || [];
        const takeaways: string[] = results?.key_takeaways || [];
        const recommendations: any[] = results?.recommendations || [];

        const safe = (v: any) => String(v ?? "—").replace(/</g, "&lt;").replace(/>/g, "&gt;");

        // Sentiment color
        const sentimentColor = (s: string) => {
            if (s === "positive") return "#10b981";
            if (s === "negative") return "#ef4444";
            return "#64748b";
        };

        const metricsHtml = Object.entries(metrics).map(([k, v]: [string, any]) =>
            `<tr><td>${safe(v?.label || k)}</td><td class="num">${v?.score ?? "—"}</td></tr>`).join("");

        const radarHtml = Object.entries(radar).map(([k, v]) =>
            `<tr><td style="text-transform:capitalize">${safe(k)}</td><td class="num">${v} / 100</td></tr>`).join("");

        const bench = benchmark?.emotion_radar_benchmark || {};
        const benchHtml = Object.entries(bench).map(([k, v]) =>
            `<tr><td style="text-transform:capitalize">${safe(k)}</td><td class="num">${v} / 100</td></tr>`).join("");

        const timelineHtml = timeline.length > 0 ? timeline.map((t) => `
            <tr>
                <td>${safe(t.timestamp)}</td>
                <td>${safe(t.event)}</td>
                <td style="color:${sentimentColor(t.sentiment)};font-weight:600">${safe(t.emotion_label)}</td>
                <td class="num">${t.confidence_score ?? "—"}</td>
                <td class="num">${t.engagement_score ?? "—"}</td>
                <td>${safe(t.insight)}</td>
            </tr>`).join("")
            : "<tr><td colspan='6' style='color:#94a3b8'>タイムラインデータなし</td></tr>";

        const recsHtml = recommendations.map((r, i) => `
            <div class="rec">
                <div class="rec-header">
                    <h4>${i + 1}. ${safe(r.title)}</h4>
                    <span class="badge">${safe(r.priority)}</span>
                </div>
                <p><strong>根拠:</strong> ${safe(r.rationale)}</p>
                <p><strong>戦略:</strong> ${safe(r.strategy)}</p>
                <div class="rec-meta">
                    <span>⏱ ${safe(r.timeframe)}</span>
                    <span>📈 期待効果: +${safe(r.expected_impact)}</span>
                </div>
            </div>`).join("");

        const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>${safe(title)}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Helvetica Neue',Arial,sans-serif;padding:32px;color:#1e293b;font-size:12px;line-height:1.6}
  h1{font-size:20px;font-weight:900;margin-bottom:2px}
  h2{font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:#065f46;border-bottom:2px solid #10b981;padding-bottom:3px;margin:24px 0 10px}
  h3{font-size:12px;font-weight:700;color:#334155;margin:14px 0 6px}
  h4{font-size:12px;font-weight:700;margin-bottom:4px}
  .meta{color:#64748b;font-size:11px;margin:4px 0 20px}
  .score{font-size:64px;font-weight:900;color:#10b981;line-height:1}
  .level{display:inline-block;background:#10b981;color:#fff;font-size:10px;font-weight:800;padding:3px 10px;border-radius:20px;text-transform:uppercase;vertical-align:middle;margin-left:12px}
  .summary{background:#f0fdf4;border-left:4px solid #10b981;padding:12px 16px;border-radius:0 6px 6px 0;margin:10px 0 18px;line-height:1.8}
  .reliability{background:#fef9c3;border:1px solid #fde68a;border-radius:6px;padding:8px 12px;margin-bottom:18px;font-size:11px}
  table{width:100%;border-collapse:collapse;margin:6px 0 16px;font-size:11px}
  th{background:#f1f5f9;font-size:10px;text-transform:uppercase;font-weight:700;color:#64748b;padding:5px 8px;text-align:left}
  td{padding:5px 8px;border-bottom:1px solid #e2e8f0;vertical-align:top}
  .num{text-align:right;font-weight:700}
  .grid2{display:grid;grid-template-columns:1fr 1fr;gap:0 28px}
  .rec{border:1px solid #d1fae5;border-radius:8px;padding:12px 14px;margin:8px 0;background:#f0fdf4}
  .rec-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px}
  .badge{background:#065f46;color:#fff;font-size:9px;font-weight:800;padding:2px 8px;border-radius:10px;white-space:nowrap}
  .rec-meta{display:flex;gap:14px;margin-top:8px;font-size:10px;color:#059669;font-weight:600}
  .page-break{page-break-before:always}
  @media print{body{padding:18px;font-size:11px}.score{font-size:48px}}
</style>
</head>
<body>

<!-- PAGE 1: Overview -->
<h1>${safe(title)}</h1>
<div class="meta">
  対象者: <strong>${safe(target)}</strong>
  ${channel ? ` &nbsp;|&nbsp; ${safe(channel)}` : ""}
  ${published ? ` &nbsp;|&nbsp; 公開日: ${safe(published)}` : ""}
  ${duration ? ` &nbsp;|&nbsp; 尺: ${safe(duration)}` : ""}
  &nbsp;|&nbsp; 出力日時: ${new Date().toLocaleString("ja-JP")}
</div>

${reliability.score ? `<div class="reliability">📊 分析信頼度: <strong>${reliability.score}/100</strong> — ${safe(reliability.notice)}</div>` : ""}

<h2>総合スコア</h2>
<div style="margin:8px 0 12px">
  <span class="score">${score}</span>
  <span class="level">${safe(level)}</span>
</div>
<p style="color:#475569;margin-bottom:12px">${safe(overallSummary)}</p>

<h2>エグゼクティブコーチ総評</h2>
<div class="summary">${safe(coachSummary)}</div>

<div class="grid2">
  <div>
    <h2>ハイレベルメトリクス</h2>
    <table><tr><th>指標</th><th class="num">スコア</th></tr>${metricsHtml}</table>

    <h2>キーテイクアウェイ</h2>
    ${takeaways.map((t, i) => `<p style="margin:6px 0"><strong>${i + 1}.</strong> ${safe(t)}</p>`).join("") || "<p>—</p>"}
  </div>
  <div>
    <h2>感情レーダー</h2>
    <table><tr><th>次元</th><th class="num">スコア</th></tr>${radarHtml}</table>

    ${bench && Object.keys(bench).length > 0 ? `
    <h3>ベンチマーク比較（エリートリーダー基準）</h3>
    <table><tr><th>次元</th><th class="num">エリート基準</th></tr>${benchHtml}</table>
    <p style="font-size:10px;color:#64748b">業界平均: ${benchmark.industry_average ?? "—"} &nbsp;|&nbsp; トップCEO平均: ${benchmark.top_ceos ?? "—"}</p>
    ` : ""}
  </div>
</div>

<!-- PAGE 2: Detailed Analysis + Timeline -->
<div class="page-break"></div>

<h2>詳細分析 — 音声・デリバリー</h2>
<table>
  <tr><th>指標</th><th>値</th><th>観察コメント</th></tr>
  <tr><td>スピーキングレート</td><td>${safe(voice.speaking_rate)}</td><td>${safe(voice.observation)}</td></tr>
  <tr><td>ポーズ頻度</td><td>${safe(voice.pause_frequency)}</td><td>—</td></tr>
  <tr><td>音量変動</td><td>${safe(voice.volume_variation)}</td><td>—</td></tr>
  <tr><td>明瞭度</td><td>${safe(voice.clarity_rating)}</td><td>—</td></tr>
</table>

<h2>詳細分析 — メッセージ・ナラティブ</h2>
<table>
  <tr><th>指標</th><th>値</th><th>観察コメント</th></tr>
  <tr><td>キーワード密度</td><td>${safe(message.keyword_density)}</td><td>—</td></tr>
  <tr><td>感情トーン</td><td>${safe(message.emotional_tone)}</td><td>${safe(message.observation)}</td></tr>
  <tr><td>構成</td><td>${safe(message.structure_rating)}</td><td>—</td></tr>
  <tr><td>論理の流れ</td><td>${safe(message.logic_flow)}</td><td>—</td></tr>
</table>

<h2>タイムライン分析</h2>
<table>
  <tr><th>時刻</th><th>フェーズ</th><th>感情</th><th class="num">自信</th><th class="num">関与度</th><th>インサイト</th></tr>
  ${timelineHtml}
</table>

<!-- PAGE 3: Recommendations -->
<div class="page-break"></div>

<h2>戦略的推奨事項</h2>
${recsHtml || "<p>推奨事項なし</p>"}

</body>
</html>`;

        const win = window.open("", "_blank");
        if (!win) {
            toast.error("ポップアップがブロックされました。ブラウザの設定でポップアップを許可してください。");
            return;
        }
        win.document.write(html);
        win.document.close();
        win.focus();
        setTimeout(() => { win.print(); }, 800);
        toast.success("PDFの印刷ダイアログを開きました。「PDFとして保存」を選択してください。");
    } catch (e) {
        console.error("PDF export error:", e);
        toast.error("PDFの生成に失敗しました。");
    }
};

// ─── CSV Export ─────────────────────────────────────────────────────────────
export const generateCSVExport = async (analysisData: any) => {
    try {
        const results = analysisData?.analysis_results || {};
        const title = analysisData?.video_title || "analysis";
        const target = results?.video_metadata?.extracted_interviewee_name || analysisData?.target_person || "";
        const safe = (v: any) => `"${String(v ?? "").replace(/"/g, '""')}"`;

        const rows: string[][] = [
            ["セクション", "カテゴリ", "指標", "値", "スコア", "コメント"],
        ];

        // Metadata
        const meta = results?.video_metadata || {};
        rows.push(["基本情報", "動画", "タイトル", title, "", ""]);
        rows.push(["基本情報", "動画", "対象者", target, "", ""]);
        rows.push(["基本情報", "動画", "チャンネル", meta.channel_title ?? "", "", ""]);
        rows.push(["基本情報", "動画", "公開日", meta.published_date ?? "", "", ""]);
        rows.push(["基本情報", "動画", "尺", meta.duration ?? "", "", ""]);

        // Overall
        rows.push(["総合評価", "パフォーマンス", "スコア", "", String(results?.overall_performance?.score ?? ""), ""]);
        rows.push(["総合評価", "パフォーマンス", "レベル", results?.overall_performance?.level ?? "", "", ""]);
        rows.push(["総合評価", "信頼度", "分析信頼度スコア", "", String(results?.analysis_reliability?.score ?? ""), results?.analysis_reliability?.notice ?? ""]);
        rows.push(["総合評価", "コーチ総評", "サマリー", results?.summary ?? "", "", ""]);

        // Metrics
        const metrics = results?.high_level_metrics || {};
        for (const [k, v] of Object.entries(metrics) as any[]) {
            rows.push(["ハイレベルメトリクス", "指標", v?.label || k, "", String(v?.score ?? ""), ""]);
        }

        // Emotional radar
        const radar = results?.emotion_radar || {};
        for (const [k, v] of Object.entries(radar)) {
            rows.push(["感情レーダー", "次元", k, "", String(v), ""]);
        }

        // Benchmark
        const bm = results?.benchmark_comparison || {};
        rows.push(["ベンチマーク", "比較", "あなたのスコア", "", String(bm.your_score ?? ""), ""]);
        rows.push(["ベンチマーク", "比較", "業界平均", "", String(bm.industry_average ?? ""), ""]);
        rows.push(["ベンチマーク", "比較", "トップCEO平均", "", String(bm.top_ceos ?? ""), ""]);
        const bench = bm.emotion_radar_benchmark || {};
        for (const [k, v] of Object.entries(bench)) {
            rows.push(["ベンチマーク", "レーダー基準", k, "", String(v), ""]);
        }

        // Voice analysis
        const voice = results?.detailed_analysis?.voice_analysis || {};
        rows.push(["詳細分析", "音声", "スピーキングレート", voice.speaking_rate ?? "", "", voice.observation ?? ""]);
        rows.push(["詳細分析", "音声", "ポーズ頻度", voice.pause_frequency ?? "", "", ""]);
        rows.push(["詳細分析", "音声", "音量変動", voice.volume_variation ?? "", "", ""]);
        rows.push(["詳細分析", "音声", "明瞭度", voice.clarity_rating ?? "", "", ""]);

        // Message analysis
        const message = results?.detailed_analysis?.message_analysis || {};
        rows.push(["詳細分析", "メッセージ", "キーワード密度", message.keyword_density ?? "", "", ""]);
        rows.push(["詳細分析", "メッセージ", "感情トーン", message.emotional_tone ?? "", "", message.observation ?? ""]);
        rows.push(["詳細分析", "メッセージ", "構成", message.structure_rating ?? "", "", ""]);
        rows.push(["詳細分析", "メッセージ", "論理の流れ", message.logic_flow ?? "", "", ""]);

        // Timeline
        const timeline: any[] = results?.timeline_analysis || [];
        timeline.forEach((t, i) => {
            rows.push([
                "タイムライン",
                `${i + 1}. ${t.event ?? ""}`,
                t.emotion_label ?? "",
                t.sentiment ?? "",
                `自信:${t.confidence_score ?? "—"} / 関与:${t.engagement_score ?? "—"}`,
                `[${t.timestamp ?? ""}] ${t.insight ?? ""}`,
            ]);
        });

        // Key takeaways
        const takeaways: string[] = results?.key_takeaways || [];
        takeaways.forEach((t, i) => {
            rows.push(["キーテイクアウェイ", `#${i + 1}`, t, "", "", ""]);
        });

        // Recommendations
        const recs: any[] = results?.recommendations || [];
        recs.forEach((r, i) => {
            rows.push([
                "推奨事項",
                `#${i + 1}`,
                r.title ?? "",
                r.strategy ?? "",
                `期待効果:+${r.expected_impact ?? ""}`,
                `[${r.priority ?? ""}優先度] ${r.rationale ?? ""} | ${r.timeframe ?? ""}`,
            ]);
        });

        const csv = rows.map(r => r.map(safe).join(",")).join("\n");
        const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${title.replace(/[^a-z0-9]/gi, "_").slice(0, 50)}_analysis.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast.success("CSVをダウンロードしました。");
    } catch (e) {
        console.error("CSV export error:", e);
        toast.error("CSVの生成に失敗しました。");
    }
};
