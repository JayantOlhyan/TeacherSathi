import re
import json

with open("c8_social_science.txt", "r") as f:
    text = f.read()

chapters_raw = re.split(r"Thematic Evaluation: ", text)[1:]
chapter_titles = []

for idx, chap_raw in enumerate(chapters_raw, 1):
    lines = chap_raw.split('\n')
    title = lines[0].strip()
    chapter_titles.append(title)
    
    questions = []
    
    # regex updated to use (?<![a-zA-Z]) before A), B), C), D) to prevent matching parts of words like ISA)
    pattern = r"(Easy|Medium|Hard)(\d+)\.\s*(.*?)\s*(?<![a-zA-Z])A\)\s*(.*?)\s*(?<![a-zA-Z])B\)\s*(.*?)\s*(?<![a-zA-Z])C\)\s*(.*?)\s*(?<![a-zA-Z])D\)\s*(.*?)\s*([A-D]):\s*(.*?)(?=(?:Easy|Medium|Hard)\d+\.|\Z)"
    matches = re.finditer(pattern, chap_raw, re.DOTALL)
    
    for match in matches:
        tier, q_no_str, q_text, optA, optB, optC, optD, ans_letter, rationale = match.groups()
        
        q_no = int(q_no_str)
        options = [optA.strip(), optB.strip(), optC.strip(), optD.strip()]
        ans_idx = ord(ans_letter) - ord('A')
        difficulty = tier.lower()
        
        questions.append({
            "id": q_no,
            "question": q_text.strip(),
            "options": options,
            "answer": ans_idx,
            "difficulty": difficulty,
            "rationale": rationale.strip()
        })
        
    out_filename = f"public/quizzes/class-8-social-science-chapter-{idx}.json"
    with open(out_filename, "w") as f:
        json.dump(questions, f, indent=2, ensure_ascii=False)
        
    print(f"Chapter {idx} ({title[:50]}...): extracted {len(questions)} questions")

print("Finished processing")
