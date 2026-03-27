import { toast } from "sonner";

// ─── PDF Export ─────────────────────────────────────────────────────────────
export const generatePDFExport = async (analysisData: any, _domElementId?: string) => {
    try {
        const results = analysisData?.analysis_results || {};
        const title = analysisData?.video_title || "Executive Analysis";
        const target = analysisData?.target_person || "Speaker";
        const score = results?.overall_performance?.score || 0;
        const summary = results?.summary || "";
        const metrics = results?.high_level_metrics || {};
        const recommendations = results?.recommendations || [];
        const radar = results?.emotion_radar || {};
        const voice = results?.detailed_analysis?.voice_analysis || {};
        const message = results?.detailed_analysis?.message_analysis || {};
        const timeline = results?.timeline_analysis || [];
        const benchmark = results?.benchmark_comparison || {};

        const safe = (v: any) => String(v ?? "—").replace(/</g, "&lt;").replace(/>/g, "&gt;");

        const metricsHtml = Object.entries(metrics)
            .map(([k, v]: [string, any]) =>
                `<tr><td>${safe(v?.label || k)}</td><td><strong>${v?.score ?? "N/A"}</strong></td></tr>`)
            .join("");

        const radarHtml = Object.entries(radar)
            .map(([k, v]) =>
                `<tr><td style="text-transform:capitalize">${safe(k)}</td><td><strong>${v}</strong> / 100</td></tr>`)
            .join("");

        const voiceHtml = [
            ["Speaking Rate", voice.speaking_rate, voice.observation],
            ["Pause Frequency", voice.pause_frequency, ""],
            ["Volume Variation", voice.volume_variation, ""],
            ["Clarity", voice.clarity_rating, ""],
        ].map(([label, val, obs]) => `
            <tr>
                <td><strong>${safe(label)}</strong></td>
                <td>${safe(val)}</td>
                <td style="color:#475569">${safe(obs)}</td>
            </tr>`).join("");

        const messageHtml = [
            ["Keyword Density", message.keyword_density, ""],
            ["Emotional Tone", message.emotional_tone, message.observation],
            ["Structure", message.structure_rating, ""],
            ["Logic Flow", message.logic_flow, ""],
        ].map(([label, val, obs]) => `
            <tr>
                <td><strong>${safe(label)}</strong></td>
                <td>${safe(val)}</td>
                <td style="color:#475569">${safe(obs)}</td>
            </tr>`).join("");

        const timelineHtml = Array.isArray(timeline) && timeline.length > 0
            ? timeline.map((t: any) => `
            <tr>
                <td>${safe(t.timestamp ?? t.time ?? "")}</td>
                <td>${safe(t.label ?? t.phase ?? t.event ?? "")}</td>
                <td>${safe(t.description ?? t.observation ?? "")}</td>
                <td>${t.score ?? ""}</td>
            </tr>`).join("")
            : "<tr><td colspan='4' style='color:#94a3b8'>No timeline data available</td></tr>";

        const benchmarkHtml = Object.entries(benchmark)
            .filter(([k]) => k !== "emotion_radar_benchmark")
            .map(([k, v]) =>
                `<tr><td style="text-transform:capitalize">${safe(k.replace(/_/g, " "))}</td><td>${safe(v as any)}</td></tr>`)
            .join("");

        const recsHtml = (recommendations as any[])
            .map((r, i) => `
            <div class="rec">
                <h4>${i + 1}. ${safe(r.title)}</h4>
                <p><strong>Rationale:</strong> ${safe(r.rationale)}</p>
                <p><strong>Strategy:</strong> ${safe(r.strategy)}</p>
                <div class="rec-meta">
                    <span>⏱ ${safe(r.timeframe)}</span>
                    <span>📈 Expected Impact: +${safe(r.expected_impact)}</span>
                    <span>Priority: ${safe(r.priority)}</span>
                </div>
            </div>`).join("");

        const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>${safe(title)} — Executive Analysis Report</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 36px; color: #1e293b; font-size: 13px; line-height: 1.6; }
  h1 { font-size: 22px; margin: 0 0 4px; }
  h2 { font-size: 15px; margin: 28px 0 10px; border-bottom: 2px solid #10b981; padding-bottom: 4px; color: #065f46; text-transform: uppercase; letter-spacing: .05em; }
  h3 { font-size: 13px; margin: 16px 0 6px; color: #334155; }
  h4 { margin: 0 0 6px; font-size: 13px; }
  .meta { color: #64748b; font-size: 12px; margin-bottom: 24px; }
  .score-block { display: flex; align-items: flex-end; gap: 16px; margin: 8px 0 16px; }
  .score { font-size: 72px; font-weight: 900; color: #10b981; line-height: 1; }
  .level { background: #10b981; color: #fff; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: .05em; }
  table { width: 100%; border-collapse: collapse; margin: 8px 0 16px; }
  th, td { text-align: left; padding: 6px 10px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
  th { background: #f1f5f9; font-weight: 700; font-size: 11px; text-transform: uppercase; color: #64748b; }
  tr:hover td { background: #f8fafc; }
  .summary { background: #f0fdf4; border-left: 4px solid #10b981; padding: 14px 18px; margin: 10px 0 20px; line-height: 1.8; border-radius: 0 6px 6px 0; }
  .rec { border: 1px solid #d1fae5; border-radius: 8px; padding: 14px 16px; margin: 10px 0; background: #f0fdf4; }
  .rec-meta { display: flex; gap: 16px; margin-top: 8px; font-size: 11px; color: #059669; font-weight: 600; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 32px; }
  .page-break { page-break-before: always; }
  @media print {
    body { padding: 20px; font-size: 11px; }
    .score { font-size: 56px; }
    h2 { margin-top: 20px; }
  }
</style>
</head>
<body>

<h1>${safe(title)}</h1>
<div class="meta">
  Analyzed Subject: <strong>${safe(target)}</strong> &nbsp;|&nbsp; Report Generated: ${new Date().toLocaleString()}
</div>

<h2>Overall Executive Presence Score</h2>
<div class="score-block">
  <span class="score">${score}</span>
  <span class="level">${safe(results?.overall_performance?.level)}</span>
</div>
<p>${safe(results?.overall_performance?.summary)}</p>

<h2>Executive Coach Summary</h2>
<div class="summary">${safe(summary)}</div>

<h2>High-Level Performance Metrics</h2>
<table><tr><th>Metric</th><th>Score</th></tr>${metricsHtml}</table>

<div class="grid">
<div>
<h2>Emotional Radar</h2>
<table><tr><th>Dimension</th><th>Score</th></tr>${radarHtml}</table>
${benchmarkHtml ? `<h3>Benchmark Comparison</h3><table><tr><th>Metric</th><th>Value</th></tr>${benchmarkHtml}</table>` : ""}
</div>
<div>
<h2>Key Takeaways</h2>
${(results?.key_takeaways || []).map((t: string, i: number) => `<p><strong>${i + 1}.</strong> ${safe(t)}</p>`).join("") || "<p>—</p>"}
</div>
</div>

<div class="page-break"></div>

<h2>Detailed Analysis — Voice & Delivery</h2>
<table>
  <tr><th>Metric</th><th>Value</th><th>Observation</th></tr>
  ${voiceHtml}
</table>

<h2>Detailed Analysis — Message & Narrative</h2>
<table>
  <tr><th>Metric</th><th>Value</th><th>Observation</th></tr>
  ${messageHtml}
</table>

<h2>Timeline Analysis</h2>
<table>
  <tr><th>Timestamp</th><th>Phase / Event</th><th>Description</th><th>Score</th></tr>
  ${timelineHtml}
</table>

<div class="page-break"></div>

<h2>Strategic Recommendations</h2>
${recsHtml || "<p>No recommendations available.</p>"}

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
        const safe = (v: any) => `"${String(v ?? "").replace(/"/g, '""')}"`;

        const rows: string[][] = [
            ["Section", "Category", "Metric", "Value", "Score", "Notes"],
        ];

        // Overall
        rows.push(["Overall", "Performance", "Score", "", String(results?.overall_performance?.score ?? ""), ""]);
        rows.push(["Overall", "Performance", "Level", results?.overall_performance?.level ?? "", "", ""]);
        rows.push(["Overall", "Summary", "Executive Coach Note", results?.summary ?? "", "", ""]);

        // High-level metrics
        const metrics = results?.high_level_metrics || {};
        for (const [k, v] of Object.entries(metrics) as any[]) {
            rows.push(["Metrics", "High-Level", v?.label || k, "", String(v?.score ?? ""), v?.definition ?? ""]);
        }

        // Emotional radar
        const radar = results?.emotion_radar || {};
        for (const [k, v] of Object.entries(radar)) {
            rows.push(["Radar", "Emotional Dimension", k, "", String(v), ""]);
        }

        // Benchmark comparison
        const benchmark = results?.benchmark_comparison || {};
        for (const [k, v] of Object.entries(benchmark)) {
            if (k === "emotion_radar_benchmark") continue;
            rows.push(["Benchmark", "Comparison", k.replace(/_/g, " "), String(v), "", ""]);
        }

        // Voice analysis
        const voice = results?.detailed_analysis?.voice_analysis || {};
        rows.push(["Detailed", "Voice", "Speaking Rate", voice.speaking_rate ?? "", "", voice.observation ?? ""]);
        rows.push(["Detailed", "Voice", "Pause Frequency", voice.pause_frequency ?? "", "", ""]);
        rows.push(["Detailed", "Voice", "Volume Variation", voice.volume_variation ?? "", "", ""]);
        rows.push(["Detailed", "Voice", "Clarity Rating", voice.clarity_rating ?? "", "", ""]);

        // Message analysis
        const message = results?.detailed_analysis?.message_analysis || {};
        rows.push(["Detailed", "Message", "Keyword Density", message.keyword_density ?? "", "", ""]);
        rows.push(["Detailed", "Message", "Emotional Tone", message.emotional_tone ?? "", "", message.observation ?? ""]);
        rows.push(["Detailed", "Message", "Structure", message.structure_rating ?? "", "", ""]);
        rows.push(["Detailed", "Message", "Logic Flow", message.logic_flow ?? "", "", ""]);

        // Timeline analysis
        const timeline = results?.timeline_analysis || [];
        if (Array.isArray(timeline)) {
            (timeline as any[]).forEach((t, i) => {
                rows.push([
                    "Timeline",
                    `Event ${i + 1}`,
                    t.label ?? t.phase ?? t.event ?? "",
                    t.description ?? t.observation ?? "",
                    String(t.score ?? ""),
                    t.timestamp ?? t.time ?? "",
                ]);
            });
        }

        // Key takeaways
        const takeaways = results?.key_takeaways || [];
        (takeaways as string[]).forEach((t, i) => {
            rows.push(["Takeaways", `#${i + 1}`, t, "", "", ""]);
        });

        // Recommendations
        const recs = results?.recommendations || [];
        (recs as any[]).forEach((r, i) => {
            rows.push([
                "Recommendations",
                `#${i + 1} — ${r.title ?? ""}`,
                r.priority ?? "",
                r.strategy ?? "",
                r.expected_impact ?? "",
                r.rationale ?? "",
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
