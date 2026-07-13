const fs = require('fs');
const content = fs.readFileSync('src/lib/data/ncertSyllabus.ts', 'utf-8');
const match = content.match(/export const NCERT_SYLLABUS[\s\S]*?=\s*({[\s\S]*});/);
if (match) {
    const sylString = match[1];
    // Need a safer way to parse TS object to JSON, but we can just regex the chapters
}
