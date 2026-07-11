import json
import os
import re

os.makedirs("public/quizzes", exist_ok=True)

def generate_quizzes():
    with open("c8_science_1to5.txt", "r", encoding="utf-8") as f:
        content = f.read()
    
    # Split by Chapter
    chapters = re.split(r'Chapter (\d+): ', content)
    
    for i in range(1, len(chapters), 2):
        chap_num = chapters[i]
        chap_content = chapters[i+1]
        
        header_split = chap_content.split("TierNo.QuestionOptionsAnswer")
        if len(header_split) < 2:
            continue
            
        questions_text = header_split[1]
        
        pattern = re.compile(r'(Easy|Medium|Hard)(\d+)(.*?)\(A\)\s*(.*?)\s*\(B\)\s*(.*?)\s*\(C\)\s*(.*?)\s*\(D\)\s*(.*?)([A-D])(?=(?:Easy|Medium|Hard)\d+|$)', re.DOTALL)
        
        matches = pattern.findall(questions_text)
        
        formatted = []
        for m in matches:
            tier, q_no, q_text, opt_a, opt_b, opt_c, opt_d, ans = m
            
            formatted.append({
                "id": str(q_no),
                "question": q_text.strip(),
                "options": [
                    {"id": "A", "text": opt_a.strip()},
                    {"id": "B", "text": opt_b.strip()},
                    {"id": "C", "text": opt_c.strip()},
                    {"id": "D", "text": opt_d.strip()}
                ],
                "difficulty": tier,
                "correctAnswerId": ans,
                "explanation": "Please refer to NCERT Science Class 8 curriculum."
            })
            
        filepath = f"public/quizzes/class-8-science-chapter-{chap_num}.json"
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump({"questions": formatted}, f, indent=2, ensure_ascii=False)
        print(f"Generated {filepath} with {len(formatted)} questions.")

if __name__ == "__main__":
    generate_quizzes()
