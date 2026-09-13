# Phase 7 — Presentation Engine & Smartboard Delivery

The Presentation Engine powers interactive, high-impact instruction optimized for physical 75" interactive smartboards in Indian classrooms.

---

## 1. Supported Slide Archetypes

| Archetype | Pedagogical Purpose | Smartboard Layout |
|:---|:---|:---|
| `TITLE` | Chapter, topic, and learning objective orientation | Bold 48pt+ typography, grade/subject badge, speaker subtitle |
| `CONTENT` | Core conceptual explanation | 2-column or bulleted layout, strictly capped at 60 words |
| `IMAGE` | High-resolution visual aids, diagrams, and maps | Media-first layout with explanatory side-panel |
| `DIAGRAM` | Structural or procedural diagrams (flowcharts, anatomical) | Centered SVG or media rendering with interactive labels |
| `QUESTION` | Formative check-for-understanding | Interactive multiple-choice card with hidden answer toggle |
| `ACTIVITY` | Student-led group work or paired discussion | Prominent countdown timer and step-by-step student instructions |
| `SUMMARY` | Chapter recap and key takeaway consolidation | Highlighted takeaway list and homework prompt |

---

## 2. 75" Smartboard Readability Constraints

Classrooms with 40–60 students require content legible from 30+ feet away. The engine enforces the following deterministic rules:

1. **Word Ceiling**:
   - Maximum recommended words per slide: **60 words**.
   - Absolute hard penalty limit: **100 words** (triggers content validation failure).
2. **Bullet Ceiling**:
   - Maximum recommended bullet points: **5 bullets**.
   - Overflow causes visual clutter and attention fatigue on large panels.
3. **Contrast & Typography**:
   - Contrast ratio $\ge 7:1$ against dark or light themes.
   - Base font size on 75" kiosk displays scales to 24pt–36pt minimum.
4. **Speaker Notes Isolation**:
   - Teacher private speaker notes are kept out of the student viewport.
   - In paired classroom sessions, notes stream exclusively to the teacher's mobile/laptop co-pilot device.

---

## 3. Realtime Classroom Session Synchronization

Presentations integrate directly with Phase 3 classroom pairing:

```
[Teacher Mobile Co-Pilot]              [Smartboard Kiosk]
        |                                       |
        |--- PRESENTATION_SLIDE_CHANGED ------->| (Advances to Slide index N)
        |--- PRESENTATION_REVEAL_ANSWER ------->| (Reveals answer card)
        |--- CLASSROOM_TIMER_START ------------>| (Starts countdown on panel)
        |<-- ACK_RENDERED ----------------------|
```

The presentation is loaded into the smartboard using an immutable snapshot version to guarantee zero layout shift or network stalls during live delivery.
