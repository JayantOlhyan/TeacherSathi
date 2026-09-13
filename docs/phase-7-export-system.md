# Phase 7 — Multi-Channel Export & Print System

TeacherSathi provides deterministic, high-fidelity export formats ensuring content is usable both on digital displays and in paper-first classrooms across India.

---

## 1. Export Formats & Use Cases

| Format | Target Resource Type | Primary Delivery Medium | Technology / Standard |
|:---|:---|:---|:---|
| **Widescreen Slide Deck (PDF/HTML)** | Presentations | Physical smartboards, projectors, teacher handouts | 16:9 Landscape `@page` CSS print layout |
| **A4 Worksheet (PDF/HTML)** | Activities, Worksheets | Student desk work, physical printouts, homework | A4 Portrait `@page` CSS print layout |
| **Vector Graphic (SVG)** | Mind Maps, Diagrams | High-resolution board projection, textbook insertions | Standalone XML SVG with inline styling |
| **Machine-Readable (JSON)** | All Resource Types | Backup, school LMS migration, bulk ingestion | Normalized TeacherSathi JSON schema |

---

## 2. Print-Ready Layout Specifications

The export engine utilizes CSS Paged Media standards (`@media print`) for pixel-perfect document rendering:

### 2.1 16:9 Widescreen Presentation Rules
```css
@page {
  size: 16in 9in landscape;
  margin: 0;
}
.slide {
  width: 16in;
  height: 9in;
  page-break-after: always;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
```

### 2.2 A4 Printable Worksheet Rules
```css
@page {
  size: A4 portrait;
  margin: 1.5cm;
}
.page-break {
  page-break-after: always;
}
```

---

## 3. Security & Rendering Safety

- **No Remote Script Execution**: Export templates contain zero client-side JavaScript (`<script>` tags are strictly stripped).
- **Sanitized HTML**: All text, equations, and tables are HTML-escaped to prevent Cross-Site Scripting (XSS) when printing or converting to PDF.
- **Embedded Fonts & Assets**: Critical fonts (Devanagari and serif typography) are specified via reliable fallback stacks to ensure consistent rendering across printer drivers.
