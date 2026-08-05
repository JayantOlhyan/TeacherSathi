import json, re

with open('src/lib/data/ncertSyllabus.ts', 'r') as f:
    content = f.read()

# very rough extraction
match = re.search(r'export const NCERT_SYLLABUS.*=\s*({.*});', content, re.DOTALL)
if match:
    syl = match.group(1)
    # This is TS, not strict JSON (keys might not be quoted, etc)
    # Let's just parse it via node
    pass

