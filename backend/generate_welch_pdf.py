from fpdf import FPDF
import os

pdf = FPDF()
pdf.add_page()

pdf.set_font("Helvetica", style="B", size=16)
pdf.set_text_color(6, 78, 59)
pdf.multi_cell(0, 10, "Executive Comms Ninja - Analysis Report", align="C")
pdf.multi_cell(0, 10, "\n")

pdf.set_font("Helvetica", style="B", size=12)
pdf.set_text_color(15, 23, 42)
pdf.multi_cell(0, 8, "Subject: Jack Welch\nOverall Performance: 96 (Legendary Level)\nDuration: 09:12\n\n")

pdf.set_font("Helvetica", style="B", size=14)
pdf.multi_cell(0, 10, "High Level Metrics")
pdf.set_font("Helvetica", size=12)
text = "  - Confidence: 98\n  - Authenticity: 90\n  - Engagement: 95\n  - Clarity: 94\n\n"
pdf.multi_cell(0, 8, text)

pdf.set_font("Helvetica", style="B", size=14)
pdf.multi_cell(0, 10, "Key Takeaways")
pdf.set_font("Helvetica", size=12)
text_ta = "1. Master-class in conveying absolute conviction and authority through visceral, energetic delivery.\n2. Zero reliance on corporate jargon; language was accessible, blunt, and highly memorable.\n3. A vivid demonstration of 'Executive Presence' defined by sheer force of personality rather than polished perfection.\n\n"
pdf.multi_cell(0, 8, text_ta)

pdf.set_font("Helvetica", style="B", size=14)
pdf.multi_cell(0, 10, "Executive Coach's Note")
pdf.set_font("Helvetica", size=12)
summary = "A masterful display of executive presence and authority. Jack Welch navigated the interview with extreme candor and high energy, translating complex business philosophies into accessible, hard-hitting truths. The primary hallmark of his style is a complete absence of corporate speak, relying instead on pure conviction to command the room."
pdf.multi_cell(0, 8, summary)

out_path = "../frontend/public/exports/Jack_Welch_Executive_Presence_Report.pdf"
os.makedirs(os.path.dirname(out_path), exist_ok=True)
pdf.output(out_path)
