import { describe, it, expect } from 'vitest';
import { contentValidator } from '@/lib/services/contentValidator';
import { MindMapContentSchema } from '@/lib/validations/resources';

describe('NCERT Mind Map Engine & Topology Validation (Section 3, 7)', () => {
  it('validates a connected mind map graph topology', () => {
    const validMindMap = {
      title: 'NCERT Photosynthesis Concept Map',
      central_node_id: 'node-root',
      nodes: [
        { id: 'node-root', label: 'Photosynthesis', type: 'CONCEPT' as const, color: '#059669' },
        { id: 'node-light', label: 'Light Reaction', type: 'SUB_CONCEPT' as const, parent_id: 'node-root' },
        { id: 'node-dark', label: 'Dark Reaction (Calvin Cycle)', type: 'SUB_CONCEPT' as const, parent_id: 'node-root' },
        { id: 'node-chlorophyll', label: 'Chloroplast & Thylakoid', type: 'EXAMPLE' as const, parent_id: 'node-light' },
      ],
      edges: [
        { id: 'e1', source: 'node-root', target: 'node-light', label: 'requires photons' },
        { id: 'e2', source: 'node-root', target: 'node-dark', label: 'fixes CO2' },
        { id: 'e3', source: 'node-light', target: 'node-chlorophyll', label: 'takes place in' },
      ],
    };

    const parsed = MindMapContentSchema.safeParse(validMindMap);
    expect(parsed.success).toBe(true);

    const report = contentValidator.validateContent('MIND_MAP', validMindMap, 'en');
    expect(report.status).toBe('PASSED');
    expect(report.score).toBe(100);
    expect(report.errors).toHaveLength(0);
  });

  it('detects disconnected / orphan nodes in the concept graph', () => {
    const orphanMindMap = {
      title: 'Mind Map with Orphan Node',
      central_node_id: 'node-root',
      nodes: [
        { id: 'node-root', label: 'Root Concept', type: 'CONCEPT' as const },
        { id: 'node-connected', label: 'Connected Concept', type: 'SUB_CONCEPT' as const },
        { id: 'node-orphan', label: 'Floating Orphan Concept', type: 'SUB_CONCEPT' as const }, // No edge references this
      ],
      edges: [
        { id: 'e1', source: 'node-root', target: 'node-connected' },
      ],
    };

    const report = contentValidator.validateContent('MIND_MAP', orphanMindMap, 'en');
    expect(report.warnings.some((w) => w.code === 'ORPHAN_NODE')).toBe(true);
    expect(report.score).toBeLessThan(100);
  });

  it('flags self-referencing loop edges as errors', () => {
    const loopMindMap = {
      title: 'Looping Mind Map',
      central_node_id: 'node-root',
      nodes: [
        { id: 'node-root', label: 'Root Concept', type: 'CONCEPT' as const },
        { id: 'node-loop', label: 'Looping Node', type: 'SUB_CONCEPT' as const },
      ],
      edges: [
        { id: 'e1', source: 'node-root', target: 'node-loop' },
        { id: 'e-bad', source: 'node-loop', target: 'node-loop' }, // Self loop!
      ],
    };

    const report = contentValidator.validateContent('MIND_MAP', loopMindMap, 'en');
    expect(report.errors.some((e) => e.code === 'SELF_LOOP')).toBe(true);
    expect(report.status).toBe('FAILED');
  });

  it('detects invalid edges referencing non-existent nodes', () => {
    const brokenEdges = {
      title: 'Broken Edges Map',
      central_node_id: 'node-root',
      nodes: [
        { id: 'node-root', label: 'Root Concept', type: 'CONCEPT' as const },
      ],
      edges: [
        { id: 'e-ghost', source: 'node-root', target: 'ghost-node-999' },
      ],
    };

    const report = contentValidator.validateContent('MIND_MAP', brokenEdges, 'en');
    expect(report.errors.some((e) => e.code === 'INVALID_EDGE')).toBe(true);
    expect(report.status).toBe('FAILED');
  });
});
