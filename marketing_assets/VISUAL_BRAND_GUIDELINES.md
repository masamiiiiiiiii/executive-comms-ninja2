# Executive Comms Ninja - Visual Brand Guidelines

This document serves as the source of truth for generating visual assets (illustrations and data graphs) to ensure consistent brand identity across all AI-generated content.

## 1. Core Brand Colors

The visual style relies on a specific, muted, and elegant "pale green and warm grey" palette. **Do not use harsh blacks, bright yellows, or generic blues/reds.**

*   **Background / Canvas:** Very light, warm creamy beige `HEX: #F6F3EC`
*   **Primary Accent:** Soft, muted olive green `HEX: #899B87`
*   **Secondary / Base Text:** Muted medium-dark brownish-grey / light charcoal `HEX: #333333` or `#5B665A`
*   **Highlight / Fill:** Pale, cool grey-green `HEX: #D1D8D2` or `#EBE7DD`

## 2. Illustration Prompts (Image Generation)

When generating new flat-vector illustrations, use the following base prompt structure to guarantee the exact style:

> **Base Prompt Formula:**
> Minimalist flat vector Corporate editorial illustration. Extremely clean, highly elegant. Base background is very light, warm creamy beige (#F6F3EC). Soft olive green (#899B87) is the primary color. NO harsh blacks or dark greys; instead, use a soft, muted medium-dark brownish-grey for the darkest elements. 
> **[Insert Specific Subject Here - e.g., A stylish, sophisticated business professional interacting with a minimalist, tech-driven motif like a clean tablet or simple geometric data chart].**
> Solid flat colors, perfect curves, sharp angles, and lots of elegant negative space. Sophisticated financial or consulting report style. Matches the exact soft, low-contrast pastel/muted tone of a high-end editorial graphic. No intricate webs, messy nodes, or cartoonish faces.

## 3. Data Visualization (Matplotlib / Python)

Graphs must look like they belong in a premium business magazine (e.g., The New Yorker or Monocle), completely stripped of default software aesthetics.

**Matplotlib Styling Rules:**
*   **Font:** Strict Serif only (`Times New Roman`, `Georgia`, `serif`).
*   **Background:** Match the unified `fig.patch` and `ax` background to `#F6F3EC`.
*   **Spines & Grid:** Hide all spines except the bottom axis. No grid lines.
*   **Ticks:** Hide Y-axis ticks and labels completely (rely on annotations for key data points).
*   **Line / Fill:** Use `#899B87` (Green) or `#1A1A1A` (Dark Charcoal) for lines, and an alpha-adjusted fill like `#EBE7DD` for area charts.
*   **Annotations:** Clean, center-aligned text arrows pointing to major data shifts.

## Usage in Future Chats
To perfectly recreate this style in a new AI chat or session, simply ask the AI:
*"Please read `marketing_assets/VISUAL_BRAND_GUIDELINES.md` first and generate the assets based on those exact constraints."*
