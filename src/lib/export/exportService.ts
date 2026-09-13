export interface PresentationExportData {
  title?: string;
  theme?: string;
  slides?: Array<{
    type?: string;
    title?: string;
    subtitle?: string;
    body?: string;
    bullets?: string[];
    image_url?: string;
    diagram_code?: string;
    question_text?: string;
    question_options?: string[];
    correct_option_index?: number;
    activity_prompt?: string;
    speaker_notes?: string;
  }>;
}

export interface MindMapExportData {
  title?: string;
  central_node_id?: string;
  nodes?: Array<{
    id: string;
    label: string;
    type?: string;
    color?: string;
  }>;
  edges?: Array<{
    id: string;
    source: string;
    target: string;
    label?: string;
    style?: string;
  }>;
}

export const exportService = {
  /**
   * Generates a 16:9 widescreen printable HTML document for presentations.
   * Uses CSS page-breaks and high-contrast smartboard styling for clean browser "Save to PDF".
   */
  exportPresentationToPdf(presentation: PresentationExportData): { html: string; title: string } {
    const title = presentation.title || 'Presentation';

    const slidesHtml = (presentation.slides || []).map((slide, idx) => {
      const bulletsList = (slide.bullets || [])
        .map((b) => `<li style="margin-bottom: 12px; font-size: 20px; line-height: 1.5;">${escapeHtml(b)}</li>`)
        .join('');

      let extraContent = '';
      if (slide.type === 'QUESTION' && slide.question_options) {
        extraContent = `
          <div style="margin-top: 24px; padding: 20px; background: rgba(0,0,0,0.05); border-radius: 12px;">
            <p style="font-weight: bold; font-size: 22px; margin-bottom: 16px;">${escapeHtml(slide.question_text || '')}</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              ${slide.question_options.map((opt, i) => `
                <div style="padding: 12px 16px; border: 1px solid #ccc; border-radius: 8px; font-size: 18px; ${i === slide.correct_option_index ? 'background: #dcfce7; border-color: #22c55e;' : ''}">
                  <strong>${String.fromCharCode(65 + i)}.</strong> ${escapeHtml(opt)}
                </div>
              `).join('')}
            </div>
          </div>
        `;
      } else if (slide.type === 'ACTIVITY') {
        extraContent = `
          <div style="margin-top: 24px; padding: 20px; background: #fef3c7; border-left: 6px solid #f59e0b; border-radius: 8px;">
            <strong style="color: #92400e; font-size: 18px; text-transform: uppercase;">Classroom Activity</strong>
            <p style="font-size: 20px; color: #1f2937; margin-top: 8px;">${escapeHtml(slide.activity_prompt || slide.body || '')}</p>
          </div>
        `;
      } else if (slide.type === 'DIAGRAM' && slide.diagram_code) {
        extraContent = `
          <div style="margin-top: 24px; padding: 20px; background: #f1f5f9; border-radius: 12px; font-family: monospace; white-space: pre-wrap;">
            ${escapeHtml(slide.diagram_code)}
          </div>
        `;
      }

      const speakerNotesHtml = slide.speaker_notes
        ? `<div style="margin-top: 20px; padding: 12px; border-top: 1px dashed #cbd5e1; font-size: 14px; color: #64748b;">
             <strong>Teacher Notes:</strong> ${escapeHtml(slide.speaker_notes)}
           </div>`
        : '';

      return `
        <div class="slide" style="width: 100%; height: 100vh; max-height: 100vh; page-break-after: always; display: flex; flex-direction: column; justify-content: space-between; padding: 48px; box-sizing: border-box; background: #ffffff; color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #10b981; padding-bottom: 16px; margin-bottom: 32px;">
              <span style="font-size: 14px; font-weight: 800; color: #059669; text-transform: uppercase; letter-spacing: 1px;">TeacherSathi Smartboard</span>
              <span style="font-size: 14px; font-weight: bold; color: #64748b;">Slide ${idx + 1} of ${(presentation.slides || []).length}</span>
            </div>
            
            <h1 style="font-size: 40px; font-weight: 900; margin: 0 0 16px 0; color: #064e3b; line-height: 1.2;">
              ${escapeHtml(slide.title || '')}
            </h1>
            
            ${slide.subtitle ? `<h3 style="font-size: 24px; font-weight: 500; color: #047857; margin: 0 0 24px 0;">${escapeHtml(slide.subtitle)}</h3>` : ''}
            ${slide.body ? `<p style="font-size: 20px; line-height: 1.6; color: #334155; margin-bottom: 24px;">${escapeHtml(slide.body)}</p>` : ''}
            
            ${bulletsList ? `<ul style="padding-left: 28px; margin: 0;">${bulletsList}</ul>` : ''}
            ${extraContent}
          </div>

          <div>
            ${speakerNotesHtml}
            <div style="font-size: 12px; color: #94a3b8; text-align: right; padding-top: 16px;">
              NCERT Curriculum Resource — Generated via TeacherSathi
            </div>
          </div>
        </div>
      `;
    }).join('\n');

    const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>${escapeHtml(title)} — TeacherSathi Export</title>
        <style>
          @page {
            size: 16in 9in landscape;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
            background: #e2e8f0;
          }
          @media print {
            body { background: #ffffff; }
            .slide { page-break-after: always; height: 100vh; }
          }
        </style>
      </head>
      <body>
        ${slidesHtml}
      </body>
      </html>
    `;

    return { html: fullHtml, title };
  },

  /**
   * Generates a vector SVG export of an interactive mind map.
   */
  exportMindMapToSvg(mindMap: MindMapExportData): { svg: string; title: string } {
    const title = mindMap.title || 'Mind Map';
    const width = 1200;
    const height = 800;

    const nodePositions = new Map<string, { x: number; y: number; label: string; color: string }>();

    // Calculate layout coordinates
    const nodes = mindMap.nodes || [];
    const centralNode = nodes.find((n) => n.id === mindMap.central_node_id) || nodes[0];

    const cx = width / 2;
    const cy = height / 2;

    if (centralNode) {
      nodePositions.set(centralNode.id, { x: cx, y: cy, label: centralNode.label, color: '#059669' });
    }

    const otherNodes = nodes.filter((n) => n.id !== centralNode?.id);
    const radius = 280;
    otherNodes.forEach((node, idx) => {
      const angle = (idx / otherNodes.length) * 2 * Math.PI;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      nodePositions.set(node.id, { x, y, label: node.label, color: node.color || '#2563eb' });
    });

    // Generate edges SVG
    const edgesSvg = (mindMap.edges || []).map((edge) => {
      const p1 = nodePositions.get(edge.source);
      const p2 = nodePositions.get(edge.target);
      if (!p1 || !p2) return '';

      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2;

      return `
        <line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="#94a3b8" stroke-width="2.5" stroke-dasharray="${edge.style === 'DASHED' ? '6,6' : '0'}" />
        ${edge.label ? `<text x="${midX}" y="${midY - 6}" font-family="sans-serif" font-size="11" fill="#64748b" text-anchor="middle" background="white">${escapeHtml(edge.label)}</text>` : ''}
      `;
    }).join('\n');

    // Generate nodes SVG
    const nodesSvg = Array.from(nodePositions.values()).map((node) => {
      const isCentral = node.x === cx && node.y === cy;
      const r = isCentral ? 65 : 45;
      const fontSize = isCentral ? 14 : 12;

      return `
        <g transform="translate(${node.x}, ${node.y})">
          <circle r="${r}" fill="${node.color}" opacity="0.15" />
          <circle r="${r - 8}" fill="#ffffff" stroke="${node.color}" stroke-width="3" />
          <text text-anchor="middle" dy="4" font-family="-apple-system, sans-serif" font-weight="bold" font-size="${fontSize}" fill="#0f172a">
            ${escapeHtml(node.label.length > 20 ? node.label.slice(0, 18) + '...' : node.label)}
          </text>
        </g>
      `;
    }).join('\n');

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" style="background: #f8fafc;">
        <text x="40" y="50" font-family="-apple-system, sans-serif" font-size="24" font-weight="900" fill="#064e3b">${escapeHtml(title)}</text>
        <text x="40" y="75" font-family="-apple-system, sans-serif" font-size="14" fill="#64748b">TeacherSathi NCERT Concept Mind Map</text>
        <g id="edges">${edgesSvg}</g>
        <g id="nodes">${nodesSvg}</g>
      </svg>
    `;

    return { svg, title };
  },

  /**
   * Generates printable A4 HTML view for worksheets and lesson plans.
   */
  exportResourceToPrintable(resource: { title: string; content: Record<string, unknown>; resource_type: string }): { html: string; title: string } {
    const title = resource.title;
    const bodyContent = JSON.stringify(resource.content, null, 2);

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>${escapeHtml(title)} — TeacherSathi</title>
        <style>
          @page { size: A4; margin: 20mm; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b; line-height: 1.6; }
          h1 { color: #064e3b; border-bottom: 2px solid #10b981; padding-bottom: 8px; }
          pre { background: #f1f5f9; padding: 16px; border-radius: 8px; font-size: 14px; overflow-x: auto; }
        </style>
      </head>
      <body>
        <h1>${escapeHtml(title)}</h1>
        <p><strong>Resource Type:</strong> ${escapeHtml(resource.resource_type)}</p>
        <pre>${escapeHtml(bodyContent)}</pre>
      </body>
      </html>
    `;

    return { html, title };
  },
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
