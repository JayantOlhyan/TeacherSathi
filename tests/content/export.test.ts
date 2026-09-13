import { describe, it, expect } from 'vitest';
import { exportService } from '@/lib/export/exportService';

describe('Export System: 16:9 PDF, Vector SVG & Printables (Section 15)', () => {
  it('exports presentation to 16:9 widescreen printable HTML with page breaks', () => {
    const presentation = {
      title: 'Solar System Exploration',
      slides: [
        {
          type: 'TITLE' as const,
          title: 'The Solar System',
          subtitle: 'NCERT Class 8 Astronomy',
        },
        {
          type: 'CONTENT' as const,
          title: 'Terrestrial Planets',
          bullets: ['Mercury', 'Venus', 'Earth', 'Mars'],
          speaker_notes: 'Remind students that Pluto is classified as a dwarf planet.',
        },
        {
          type: 'QUESTION' as const,
          title: 'Quick Check',
          question_text: 'Which is the largest planet?',
          question_options: ['Mars', 'Jupiter', 'Saturn', 'Earth'],
          correct_option_index: 1,
        },
      ],
    };

    const { html, title } = exportService.exportPresentationToPdf(presentation);

    expect(title).toBe('Solar System Exploration');
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('page-break-after: always');
    expect(html).toContain('16in 9in landscape');
    expect(html).toContain('Terrestrial Planets');
    expect(html).toContain('Jupiter');
    expect(html).toContain('Teacher Notes:');
  });

  it('sanitizes user text in presentation export to prevent XSS injection', () => {
    const dangerousPresentation = {
      title: '<script>alert("XSS")</script>',
      slides: [
        {
          type: 'CONTENT' as const,
          title: '<img src=x onerror=alert(1)>',
          body: 'Plain body with & ampersand',
        },
      ],
    };

    const { html } = exportService.exportPresentationToPdf(dangerousPresentation);
    expect(html).not.toContain('<script>alert');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('&amp; ampersand');
  });

  it('exports concept mind map to valid vector SVG', () => {
    const mindMap = {
      title: 'Force and Pressure',
      central_node_id: 'root',
      nodes: [
        { id: 'root', label: 'Force', type: 'CONCEPT' as const, color: '#059669' },
        { id: 'contact', label: 'Contact Force', type: 'SUB_CONCEPT' as const },
        { id: 'noncontact', label: 'Non-contact Force', type: 'SUB_CONCEPT' as const },
      ],
      edges: [
        { id: 'e1', source: 'root', target: 'contact', label: 'classified as' },
        { id: 'e2', source: 'root', target: 'noncontact', label: 'classified as' },
      ],
    };

    const { svg, title } = exportService.exportMindMapToSvg(mindMap);

    expect(title).toBe('Force and Pressure');
    expect(svg).toContain('<svg xmlns="http://www.w3.org/2000/svg"');
    expect(svg).toContain('<g id="edges">');
    expect(svg).toContain('<g id="nodes">');
    expect(svg).toContain('Force');
    expect(svg).toContain('Contact Force');
  });

  it('exports resource to printable A4 HTML view', () => {
    const resource = {
      title: 'Class 8 Friction Worksheet',
      resource_type: 'TEACHING_ACTIVITY',
      content: { key: 'Friction value' },
    };

    const { html } = exportService.exportResourceToPrintable(resource);
    expect(html).toContain('size: A4');
    expect(html).toContain('Class 8 Friction Worksheet');
  });
});
