const fs = require('fs');
const ts = fs.readFileSync('src/lib/data/ncertSyllabus.ts', 'utf-8');

const regex = /export const NCERT_SYLLABUS: ClassSyllabus = (\{[\s\S]*?\n\});/;
const match = ts.match(regex);
if (match) {
  const jsonStr = match[1]
    .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":') // Quote keys
    .replace(/'/g, '"') // Replace single quotes with double quotes
    .replace(/,\s*}/g, '}') // Remove trailing commas
    .replace(/,\s*]/g, ']');

  try {
    // Evaluate the object using Function to avoid strict JSON parse issues
    const syllabus = new Function('return ' + match[1])();
    
    for (const className in syllabus) {
      console.log(`\n${className}`);
      for (const subject in syllabus[className]) {
        console.log(`  ${subject}: ${syllabus[className][subject].length}`);
      }
    }
  } catch (e) {
    console.error("Parse error:", e);
  }
}
