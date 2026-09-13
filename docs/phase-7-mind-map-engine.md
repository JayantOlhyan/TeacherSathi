# Phase 7 — Interactive Mind Map & Concept Graph Engine

The Mind Map Engine allows educators to construct and navigate hierarchical concept maps, demonstrating foundational relationships across NCERT curriculum chapters.

---

## 1. Graph Structure & Data Model

Mind maps are represented as directed node-edge graphs stored in JSONB:

- **Nodes**:
  - `id`: Unique identifier (e.g., `root`, `sub-1`, `leaf-1`).
  - `label`: Concept title.
  - `description`: Detailed definition or classroom explanation.
  - `isCentral`: Boolean marking the core curriculum concept.
  - `x, y`: Coordinate offsets for vector rendering.
  - `color`: Hex code or theme accent.

- **Edges**:
  - `id`: Connection identifier.
  - `source`: Parent node ID.
  - `target`: Child node ID.
  - `label`: Relational predicate (e.g., "caused by", "part of", "leads to").

---

## 2. Deterministic Graph Topology Validation

To prevent broken or confusing visualizations, the Content Validator runs algorithmic graph checks:

1. **Self-Loop Check**:
   - Condition: $Edge.source == Edge.target$.
   - Penalty: Fails validation; self-referential loops are forbidden in concept hierarchies.

2. **Orphan Node Check**:
   - Non-central nodes must have at least one connected incoming or outgoing edge.
   - Any unconnected node is flagged with a warning to the teacher.

3. **Multi-Parent & Cycle Handling**:
   - The renderer supports cross-topic linkages (DAGs) while enforcing readability boundaries.

---

## 3. SVG Vector Rendering & Export

The engine features vector rendering:
- **Zero Pixelation**: Infinitely scalable for classroom projection on high-resolution displays.
- **Standalone Vector Export**: Produces valid, standards-compliant `<svg>` documents with embedded styles, ready for download or integration into school worksheets.
- **Interactive Highlighting**: Clicking any node highlights its connected sub-tree for guided inquiry during smartboard discussions.
