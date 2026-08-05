import json
import os
import re

os.makedirs("public/quizzes", exist_ok=True)

def generate_quizzes():
    for filename in ["c8_hindi_1to3.txt", "c8_hindi_6to8.txt"]:
        if not os.path.exists(filename):
            continue
        with open(filename, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Split by Chapter
        chapters = re.split(r'अध्याय (\d+): ', content)
        
        for i in range(1, len(chapters), 2):
            chap_num = chapters[i]
            chap_content = chapters[i+1]
            
            header_split = chap_content.split("क्र.स्तरप्रश्नविकल्पउत्तर")
            if len(header_split) < 2:
                continue
                
            questions_text = header_split[1]
            
            formatted = []
            tier_map = {"सरल": "Easy", "मध्यम": "Medium", "कठिन": "Hard"}
            
            lines = questions_text.strip().split('\n')
            for line in lines:
                line = line.strip()
                if not line: continue
                
                m = re.match(r'^(\d+)(सरल|मध्यम|कठिन)(.*?)A\)\s*(.*?)B\)\s*(.*?)C\)\s*(.*?)D\)\s*(.*?)([A-D])$', line)
                if m:
                    q_no, tier, q_text, opt_a, opt_b, opt_c, opt_d, ans = m.groups()
                    
                    formatted.append({
                        "id": str(q_no),
                        "question": q_text.strip(),
                        "options": [
                            {"id": "A", "text": opt_a.strip()},
                            {"id": "B", "text": opt_b.strip()},
                            {"id": "C", "text": opt_c.strip()},
                            {"id": "D", "text": opt_d.strip()}
                        ],
                        "difficulty": tier_map[tier],
                        "correctAnswerId": ans,
                        "explanation": "Please refer to NCERT Hindi Class 8 curriculum."
                    })
                
            filepath = f"public/quizzes/class-8-hindi-chapter-{chap_num}.json"
            with open(filepath, "w", encoding="utf-8") as f:
                json.dump({"questions": formatted}, f, indent=2, ensure_ascii=False)
            print(f"Generated {filepath} with {len(formatted)} questions.")

if __name__ == "__main__":
    generate_quizzes()
    #python gen_c8_hindi.py
    #cd public/quizzes  