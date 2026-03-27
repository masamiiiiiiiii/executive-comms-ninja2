import { toast } from "sonner";

// ─── PDF Export ─────────────────────────────────────────────────────────────
/**
 * Generates a PDF by opening the browser print dialog on a formatted snapshot
 * of the analysis results. Works without any server-side dependencies.
 */
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

        const metricsHtml = Object.entries(metrics)
            .map(([k, v]: [string, any]) =>
                `<tr><td>${v?.label || k}</td><td>${v?.score ?? "N/A"}</td></tr>`)
            .join("");

        const radarHtml = Object.entries(radar)
            .map(([k, v]) => `<tr><td style="text-transform:capitalize">${k}</td><td>${v}</td></tr>`)
            .join("");

        const recsHtml = (recommendations as any[])
            .map((r, i) => `<div class="rec">
                <h4>${i + 1}. ${r.title || ""}</h4>
                <p>${r.rationale || ""}</p>
                <p><strong>Strategy:</strong> ${r.strategy || ""}</p>
                <p><em>Timeframe: ${r.timeframe || ""} | Expected Impact: +${r.expected_impact || ""}</em></p>
            </div>`).join("");

        const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>${title}</title>
<style>
  body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 32px; color: #1e293b; font-size: 13px; }
  h1 { font-size: 22px; margin-bottom: 4px; }
  h2 { font-size: 16px; margin: 24px 0 8px; border-bottom: 2px solid #10b981; padding-bottom: 4px; color: #065f46; }
  h4 { margin: 0 0 4px; }
  .meta { color: #64748b; margin-bottom: 24px; font-size: 12px; }
  .score { font-size: 72px; font-weight: 900; color: #10b981; line-height: 1; }
  table { width: 100%; border-collapse: collapse; margin: 12px 0; }
  th, td { text-align: left; padding: 6px 10px; border-bottom: 1px solid #e2e8f0; }
  th { background: #f1f5f9; font-weight: 700; }
  .rec { border: 1px solid #d1fae5; border-radius: 8px; padding: 12px; margin: 10px 0; background: #f0fdf4; }
  .summary { background: #f8fafc; border-left: 4px solid #10b981; padding: 12px 16px; margin: 12px 0; line-height: 1.7; }
  @media print { body { padding: 20px; } }
</style>
</head>
<body>
  <h1>${title}</h1>
  <div class="meta">
    Target: ${target} &nbsp;|&nbsp; Generated: ${new Date().toLocaleDateString()}
  </div>
  <h2>Overall Score</h2>
  <div class="score">${score}</div>
  <p>${results?.overall_performance?.level || ""}</p>

  <h2>Executive Summary</h2>
  <div class="summary">${summary}</div>

  <h2>High-Level Metrics</h2>
  <table><tr><th>Metric</th><th>Score</th></tr>${metricsHtml}</table>

  <h2>Emotional Radar</h2>
  <table><tr><th>Dimension</th><th>Score</th></tr>${radarHtml}</table>

  <h2>Recommendations</h2>
  ${recsHtml}
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
/**
 * Builds a structured CSV from analysis data and triggers a file download.
 */
export const generateCSVExport = async (analysisData: any) => {
    try {
        const results = analysisData?.analysis_results || {};
        const title = analysisData?.video_title || "analysis";
        const safe = (v: any) => `"${String(v ?? "").replace(/"/g, '""')}"`;

        const rows: string[][] = [
            ["Category", "Metric", "Value", "Score"],
        ];

        // Overall
        rows.push(["Overall", "Score", "", results?.overall_performance?.score ?? ""]);
        rows.push(["Overall", "Level", results?.overall_performance?.level ?? "", ""]);
        rows.push(["Overall", "Summary", results?.summary ?? "", ""]);

        // High-level metrics
        const metrics = results?.high_level_metrics || {};
        for (const [k, v] of Object.entries(metrics) as any[]) {
            rows.push(["Metrics", v?.label || k, "", v?.score ?? ""]);
        }

        // Emotional radar
        const radar = results?.emotion_radar || {};
        for (const [k, v] of Object.entries(radar)) {
            rows.push(["Radar", k, "", String(v)]);
        }

        // Voice analysis
        const voice = results?.detailed_analysis?.voice_analysis || {};
        rows.push(["Voice", "Speaking Rate", voice.speaking_rate ?? "", ""]);
        rows.push(["Voice", "Volume Variation", voice.volume_variation ?? "", ""]);
        rows.push(["Voice", "Clarity", voice.clarity_rating ?? "", ""]);

        // Recommendations
        const recs = results?.recommendations || [];
        (recs as any[]).forEach((r, i) => {
            rows.push(["Recommendation", `${i + 1}. ${r.title || ""}`, r.strategy ?? "", r.expected_impact ?? ""]);
        });

        const csv = rows.map(r => r.map(safe).join(",")).join("\n");
        const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" }); // BOM for Excel
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
