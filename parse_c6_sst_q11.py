import json

raw_data = [
    (1, "Easy", "What does the traditional Indian term 'Panchayat' originally translate to in its historical context?", [
        ("A", "A group of five respected elders or leaders"), ("B", "A massive, sprawling city"), ("C", "A busy commercial marketplace"), ("D", "A king's royal court")
    ], "A"),
    (2, "Easy", "The highly structured system of local self-government designed specifically for rural areas in India is formally known as:", [
        ("A", "The Municipal Corporation"), ("B", "The Panchayati Raj"), ("C", "The Supreme Court"), ("D", "The National Parliament")
    ], "B"),
    (3, "Easy", "Forming the absolute base of the Panchayati Raj system is the powerful assembly of all adult voting villagers. What is this assembly called?", [
        ("A", "The Lok Sabha"), ("B", "The Zila Parishad"), ("C", "The Gram Sabha"), ("D", "The State Assembly")
    ], "C"),
    (4, "Easy", "Who holds the direct democratic power to elect the working members of the Gram Panchayat?", [
        ("A", "The Prime Minister"), ("B", "The members of the Gram Sabha"), ("C", "The Local Police"), ("D", "The District Collector")
    ], "B"),
    (5, "Easy", "What is the elected head or president of the village Gram Panchayat formally called?", [
        ("A", "The Mayor"), ("B", "The Chief Minister"), ("C", "The Sarpanch or Pradhan"), ("D", "The State Governor")
    ], "C"),
    (6, "Easy", "Which of the following tasks is a primary, everyday function of the Gram Panchayat?", [
        ("A", "Negotiating foreign policy"), ("B", "Constructing and maintaining village roads, drainage, and water sources"), ("C", "Printing the national currency"), ("D", "Running commercial airplanes")
    ], "B"),
    (7, "Easy", "What is the intermediate, second tier (operating at the block level) of the Panchayati Raj system called?", [
        ("A", "The Gram Panchayat"), ("B", "The Panchayat Samiti (or Janpad Panchayat)"), ("C", "The Zila Parishad"), ("D", "The Municipal Council")
    ], "B"),
    (8, "Easy", "What is the highest, top tier (operating at the district level) of the Panchayati Raj system called?", [
        ("A", "The Zila Parishad"), ("B", "The Gram Sabha"), ("C", "The Ward Committee"), ("D", "The Vidhan Sabha")
    ], "A"),
    (9, "Easy", "To constitutionally ensure that women have a powerful voice in rural governance, what exact fraction of total seats is legally reserved for them in Panchayats?", [
        ("A", "One-fourth"), ("B", "One-third (1/3)"), ("C", "Exactly Half"), ("D", "None")
    ], "B"),
    (10, "Easy", "What progressive, modern initiative actively encourages young children to express their ideas and opinions in village governance?", [
        ("A", "Child-Friendly Panchayat (Bal Sabhas/Bal Panchayats)"), ("B", "The Kids' National Parliament"), ("C", "The Youth Supreme Court"), ("D", "The Local School Board")
    ], "A"),
    (11, "Medium", "How does the Gram Sabha effectively ensure that the elected Gram Panchayat remains honest and accountable?", [
        ("A", "By physically arresting the Sarpanch if they disagree"), ("B", "By regularly reviewing the Panchayat's work, heavily discussing financial budgets, and aggressively raising issues like water shortages or poor roads"), ("C", "By completely ignoring the Panchayat"), ("D", "By bypassing them and paying taxes directly to the President")
    ], "B"),
    (12, "Medium", "Who is the specific, government-appointed administrative official that assists the Gram Panchayat by calling formal meetings, recording minutes, and keeping financial records?", [
        ("A", "The Patwari"), ("B", "The Sarpanch"), ("C", "The Panchayat Secretary"), ("D", "The Ward Member")
    ], "C"),
    (13, "Medium", "Which monumental constitutional amendments served as the legal landmarks for permanently establishing the Panchayati Raj and urban local bodies across India?", [
        ("A", "The 1st and 2nd Amendments"), ("B", "The 42nd and 44th Amendments"), ("C", "The 73rd and 74th Amendments"), ("D", "The 100th Amendment")
    ], "C"),
    (14, "Medium", "What is the critical administrative role of the Panchayat Samiti?", [
        ("A", "It rules the entire state with absolute power"), ("B", "It coordinates complex development plans across multiple Gram Panchayats in a block and formally presents them to the higher district level"), ("C", "It collects all national income taxes"), ("D", "It holds the power to elect the Prime Minister")
    ], "B"),
    (15, "Medium", "Why is the Panchayati Raj system proudly considered the ultimate example of \"Grassroots Democracy\"?", [
        ("A", "Because it is only implemented in grassy, agricultural areas"), ("B", "Because it brings actual decision-making power and financial control directly down to the local people at the foundational village level"), ("C", "Because farmers grow grass as a primary crop"), ("D", "Because it is the oldest, unchanged system in the world")
    ], "B"),
    (16, "Medium", "The highly successful PMGSY (Pradhan Mantri Gram Sadak Yojana) is a massive government scheme primarily related to:", [
        ("A", "Building luxury village schools"), ("B", "Constructing high-tech village hospitals"), ("C", "Connecting isolated villages with durable, all-weather roads to boost the rural economy"), ("D", "Providing free satellite internet to farmers")
    ], "C"),
    (17, "Medium", "In rural Indian administration, who is the local official that usually surveys agricultural fields and meticulously manages the vital land records?", [
        ("A", "The Sarpanch"), ("B", "The Patwari"), ("C", "The Prime Minister"), ("D", "The Police Inspector")
    ], "B"),
    (18, "Medium", "If a village desperately needs a new communal well, who holds the primary authority to take the decision and allocate funds to build it?", [
        ("A", "The State Governor acting alone"), ("B", "The Gram Panchayat, but only after open discussion and approval from the Gram Sabha"), ("C", "The Supreme Court of India"), ("D", "The Zila Parishad")
    ], "B"),
    (19, "Medium", "Which specific level of the three-tier Panchayati Raj system is responsible for creating comprehensive, large-scale development planning for the entire district?", [
        ("A", "The Gram Panchayat"), ("B", "The Panchayat Samiti"), ("C", "The Zila Parishad"), ("D", "The Gram Sabha")
    ], "C"),
    (20, "Medium", "In recent years, innovative programs involving night schools and 'parliament-like' mock elections for children in villages have proven highly effective in teaching them about:", [
        ("A", "Advanced Geography"), ("B", "Practical democracy, civic leadership, and profound social responsibility"), ("C", "Computer science algorithms"), ("D", "Translating foreign languages")
    ], "B"),
    (21, "Hard", "The strict constitutional reservation of seats for disadvantaged, marginalized sections (SC/ST) and women in Panchayats is a powerful mandate primarily aimed at:", [
        ("A", "Making the voting and election process deliberately more complicated"), ("B", "Addressing deep-rooted, historical social inequalities by legally ensuring diverse representation and highly inclusive decision-making at the ground level"), ("C", "Saving the central government money"), ("D", "Drastically reducing the democratic power of the Gram Sabha")
    ], "B"),
    (22, "Hard", "How do innovative Child-Friendly Panchayats (Bal Panchayats) effectively bridge the traditional generational gap between youth and governance?", [
        ("A", "They unconstitutionally allow children to pass official, binding state laws"), ("B", "They provide a structured, respected platform for children aged 8-14 to advocate for their specific needs (like better education and sanitation) directly to village elders, who then act on them"), ("C", "They forcefully draft children to work in agricultural fields"), ("D", "They entirely replace the adult voting system")
    ], "B"),
    (23, "Hard", "Why is the Gram Sabha accurately described by political scientists as the ultimate foundation of grassroots democracy?", [
        ("A", "Because it includes every single adult voter in the village, allowing for pure, direct democratic participation, debate, and absolute oversight of the elected Panchayat"), ("B", "Because it is a massive building made of ancient stone"), ("C", "Because it holds absolute control over the regional military"), ("D", "Because it illegally collects all the money in the village")
    ], "A"),
    (24, "Hard", "The strategic decentralisation of political and financial power to the Zila Parishad, Panchayat Samiti, and Gram Panchayat actively ensures that:", [
        ("A", "The Central Government maintains absolute, dictatorial control over every village"), ("B", "Development plans and resource allocations are tailored to highly specific local needs, rather than imposing an ineffective \"one size fits all\" policy from a distant capital"), ("C", "Villages become completely independent, sovereign countries"), ("D", "All forms of taxation are permanently abolished")
    ], "B"),
    (25, "Hard", "If a bitter dispute arises over the accuracy of the official list of people living below the poverty line (BPL) in a village, which specific democratic body has the immediate authority to openly discuss and rectify this list?", [
        ("A", "The Gram Sabha"), ("B", "The Zila Parishad"), ("C", "The High Court"), ("D", "The State Legislature")
    ], "A"),
    (26, "Hard", "While the overarching structure of Panchayati Raj is generally three-tiered across India, why might the exact rules, powers, and composition of a Panchayat Samiti differ notably from state to state?", [
        ("A", "Because the Central government arbitrarily changes the rules daily"), ("B", "Because local government is constitutionally a 'State subject', giving individual State governments the legal authority to adapt the structure to their specific regional, cultural, and demographic needs"), ("C", "Because villagers routinely refuse to follow any established rules"), ("D", "Because the Indian Constitution is entirely silent on this matter")
    ], "B"),
    (27, "Hard", "The Panchayat Secretary is officially appointed by the state government, whereas the Sarpanch is democratically elected by the people. What is the critical administrative purpose of having an appointed official working within the elected Panchayat?", [
        ("A", "To act as a secret spy for the Prime Minister"), ("B", "To ensure seamless administrative continuity, maintain complex official records, and handle government funds strictly according to complex legal rules"), ("C", "To permanently overrule and veto the villagers' democratic votes"), ("D", "To possess the power to arrest local criminals")
    ], "B"),
    (28, "Hard", "How does the historic 73rd Constitutional Amendment Act truly embody the democratic spirit of \"Power to the People\"?", [
        ("A", "By making the act of voting optional rather than mandatory"), ("B", "By legally and permanently mandating the establishment of local self-government institutions, thereby giving rural citizens guaranteed constitutional authority and funds over their own local development"), ("C", "By putting all absolute power in the hands of the unelected District Collector"), ("D", "By strictly banning all national political parties from operating in villages")
    ], "B"),
    (29, "Hard", "A Gram Panchayat decides it is crucial to build a new high school, but it requires significant additional funding and complex coordination with several neighboring villages. Which specific body within the three-tier system would it logically approach next?", [
        ("A", "The United Nations"), ("B", "The Panchayat Samiti (at the Block level)"), ("C", "The Supreme Court"), ("D", "The Urban Municipal Corporation")
    ], "B"),
    (30, "Hard", "Ultimately, the true success, transparency, and efficiency of an elected Gram Panchayat heavily relies upon:", [
        ("A", "The sheer physical strength and wealth of the Sarpanch"), ("B", "The continuous active participation, relentless vigilance, and civic cooperation of the Gram Sabha members"), ("C", "The physical distance of the village from the nearest large city"), ("D", "The total number of mechanized tractors owned in the village")
    ], "B")
]

quiz_data = {"questions": []}

for q_id, diff, q_text, opts, ans in raw_data:
    question_obj = {
        "id": str(q_id),
        "question": q_text,
        "options": [
            {"id": opt_id, "text": opt_text} for opt_id, opt_text in opts
        ],
        "difficulty": diff,
        "correctAnswerId": ans,
        "explanation": f"The correct answer is {ans}."
    }
    quiz_data["questions"].append(question_obj)

output_path = "/Users/jayantolhyan/Desktop/my projects/deployed/teacher sathi final/public/quizzes/class-6-social-science-chapter-11.json"

with open(output_path, "w", encoding="utf-8") as f:
    json.dump(quiz_data, f, indent=2, ensure_ascii=False)

print(f"Successfully generated {output_path} with {len(quiz_data['questions'])} questions.")
