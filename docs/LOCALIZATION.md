# TeacherSathi — Localization & Bilingual Standards

> **Status**: Frozen Contract (Phase 0)  
> **Supported Locales**: English (`en`), Hindi (`hi`)  
> **Architecture**: `next-intl` (prefixless routing)

---

## 1. Pedagogical Linguistic Principles

In Indian school education—particularly across CBSE, Kendriya Vidyalaya, and State Boards—instruction is frequently **bilingual (Hinglish/Devanagari)**. Blind machine translation corrupts scientific comprehension and alienates teachers.

TeacherSathi enforces three strict linguistic modes:

### Mode 1: English (`en`)
- High-standard Indian English educational vocabulary aligned with NCERT textbooks.
- Plain, unambiguous phrasing avoiding US or UK cultural idioms (e.g. *"light ray striking a plane mirror"* rather than *"flashlight beam hitting a looking-glass"*).

### Mode 2: Hindi (`hi` — Native Devanagari)
- Clean Unicode Devanagari script using the **Mukta** typography token.
- Grammatically accurate Hindi matching NCERT Hindi-medium textbooks (e.g. *प्रकाश का परावर्तन तथा अपवर्तन*, *फसल उत्पादन एवं प्रबंध*).
- Formal pedagogical tone appropriate for teachers (*आप*, *स्पष्ट कीजिए*, *उत्तर दें*).

### Mode 3: Bilingual (Scientific Hybrid)
- **The Golden Rule**: **"Do not blindly translate established scientific terminology."**
- In modern Indian classrooms, teachers and students utilize recognized English terminology alongside Hindi conceptual explanations.
- **Accepted Standards**:
  - *Correct*: `माइटोकॉन्ड्रिया (Mitochondria) कोशिका का पावरहाउस है।`
  - *Incorrect / Distorted*: `सूत्रकणिका कोशिका का विद्युतगृह है।` (Unnatural literal translation confusing to students).
  - *Correct*: `प्रकाश का परावर्तन (Reflection of Light)`
  - *Correct*: `प्रकाश संश्लेषण (Photosynthesis)`

---

## 2. Technical Architecture & Next-Intl Configuration

### Routing Strategy
- **Prefixless Dynamic Routing**:
  - URLs do NOT force `/en/` or `/hi/` in the user's address bar.
  - File: [`src/i18n/routing.ts`](file:///Users/jayantolhyan/Desktop/my%20projects/deployed/teacher%20sathi%20final/src/i18n/routing.ts#L4-L16)
  - Configured with `localePrefix: 'never'` and `localeDetection: false`.
  - Locale selection is persisted via the `NEXT_LOCALE` cookie.
- **Request Configuration**:
  - File: [`src/i18n/request.ts`](file:///Users/jayantolhyan/Desktop/my%20projects/deployed/teacher%20sathi%20final/src/i18n/request.ts)
  - Dynamically imports localized dictionaries from `messages/${locale}.json`.
- **Dictionary Schema Integrity**:
  - Both [`messages/en.json`](file:///Users/jayantolhyan/Desktop/my%20projects/deployed/teacher%20sathi%20final/messages/en.json) and [`messages/hi.json`](file:///Users/jayantolhyan/Desktop/my%20projects/deployed/teacher%20sathi%20final/messages/hi.json) must maintain 1-to-1 key parity across all namespaces (`Hero`, `Nav`, `Login`, `Signup`, `Pricing`, `HowItWorks`, `Mission`, `Footer`, `Dashboard`).
