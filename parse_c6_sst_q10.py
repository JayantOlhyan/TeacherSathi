import json

raw_data = [
    (1, "Easy", "What does the critical political term 'governance' essentially mean?", [
        ("A", "The act of cooking community food"), ("B", "The complex process of taking decisions, organizing society, and ensuring rules are followed"), ("C", "Playing organized team sports"), ("D", "Building large residential houses")
    ], "B"),
    (2, "Easy", "The specific group of individuals or the formal system that holds the authority to make rules for a country is called the:", [
        ("A", "Free Market"), ("B", "Government"), ("C", "Public School"), ("D", "General Hospital")
    ], "B"),
    (3, "Easy", "The most important, formal rules that everyone in a country is legally required to follow are known as:", [
        ("A", "Recreational Games"), ("B", "Helpful Suggestions"), ("C", "Laws"), ("D", "Personal Opinions")
    ], "C"),
    (4, "Easy", "What is the fundamental, literal meaning of the word 'Democracy'?", [
        ("A", "Rule by a single powerful king"), ("B", "Rule exclusively by the wealthy elite"), ("C", "Rule by the armed military"), ("D", "Rule by the people")
    ], "D"),
    (5, "Easy", "The word 'Democracy' originates from two ancient Greek words: 'demos' and 'kratos'. What does the root 'demos' specifically mean?", [
        ("A", "Absolute Power"), ("B", "The People"), ("C", "Strict Law"), ("D", "Divine Justice")
    ], "B"),
    (6, "Easy", "Which specific organ of the modern government is primarily responsible for debating and making new laws?", [
        ("A", "The Legislature"), ("B", "The Executive"), ("C", "The Judiciary"), ("D", "The Mass Media")
    ], "A"),
    (7, "Easy", "Which specific organ of the government is tasked with implementing, enforcing, and executing the laws?", [
        ("A", "The Legislature"), ("B", "The Executive"), ("C", "The Judiciary"), ("D", "The Central Banks")
    ], "B"),
    (8, "Easy", "Which specific organ of the government has the authority to decide if a law has been broken and to punish the guilty?", [
        ("A", "The Legislature"), ("B", "The Executive"), ("C", "The Judiciary"), ("D", "The Military")
    ], "C"),
    (9, "Easy", "What is the universally recognized legal voting age for citizens in India to participate in elections?", [
        ("A", "15 years"), ("B", "18 years"), ("C", "21 years"), ("D", "25 years")
    ], "B"),
    (10, "Easy", "How many distinct levels or 'tiers' of government does the massive administrative structure of India have?", [
        ("A", "One"), ("B", "Two"), ("C", "Three"), ("D", "Four")
    ], "C"),
    (11, "Medium", "Fundamentally, why is it absolutely necessary to have established rules and laws in any human society?", [
        ("A", "Merely to make people unhappy and restricted"), ("B", "To maintain social order, systematically prevent chaos, and ensure fairness, safety, and justice for all"), ("C", "Just so the police force has something to do"), ("D", "To prevent people from working hard")
    ], "B"),
    (12, "Medium", "In a system of 'Direct Democracy', how are political decisions legally made?", [
        ("A", "The people elect one strong leader to decide everything"), ("B", "Every single citizen votes directly on every major issue or proposed law"), ("C", "A hereditary king decides everything independently"), ("D", "Only the appointed judges make decisions")
    ], "B"),
    (13, "Medium", "India follows a practical system where millions of people elect specific leaders (like MLAs and MPs) to debate and make decisions on their behalf. This system is technically called:", [
        ("A", "Direct Democracy"), ("B", "Totalitarian Dictatorship"), ("C", "Representative Democracy"), ("D", "Absolute Monarchy")
    ], "C"),
    (14, "Medium", "At the highest national level, which tier of government handles vital nationwide issues like border defence and foreign affairs?", [
        ("A", "The State Government"), ("B", "The Local Village Government"), ("C", "The Central (Union) Government"), ("D", "The Municipal Corporation")
    ], "C"),
    (15, "Medium", "What is the primary, essential role of the local government (the third tier)?", [
        ("A", "Defending the country's international borders against invasion"), ("B", "Printing and regulating national currency"), ("C", "Handling immediate local civic problems like garbage collection, local sanitation, and street lighting"), ("D", "Negotiating complex foreign trade treaties")
    ], "C"),
    (16, "Medium", "If a completely new law is drafted and passed to stop the rise of cybercrime, which specific organ of government performed this action?", [
        ("A", "The Judiciary"), ("B", "The Legislature"), ("C", "The Executive"), ("D", "The Local Police")
    ], "B"),
    (17, "Medium", "When the police actively track down and arrest a dangerous cybercriminal, which organ of the government are they acting as an operational part of?", [
        ("A", "The Legislature"), ("B", "The Judiciary"), ("C", "The Executive"), ("D", "The National Parliament")
    ], "C"),
    (18, "Medium", "Why is 'Education' considered a uniquely shared subject in India's complex governance structure?", [
        ("A", "Only the Central government has the funds to handle it"), ("B", "Only the State government has the local knowledge to handle it"), ("C", "It is a concurrent responsibility handled collaboratively by both the Central and State governments"), ("D", "The government strictly does not handle education; only private businesses do")
    ], "C"),
    (19, "Medium", "What would likely be the disastrous outcome if all three organs of government (Legislature, Executive, Judiciary) were totally controlled by the exact same small group of people?", [
        ("A", "Absolute, perfect societal peace"), ("B", "Severe abuse of power, lack of fairness, and the destruction of democratic checks"), ("C", "Everyone in the country would become instantly wealthy"), ("D", "The government would simply stop working due to boredom")
    ], "B"),
    (20, "Medium", "What is a foundational, non-negotiable principle of a true democracy regarding its treatment of citizens?", [
        ("A", "Only a wealthy few people have actual legal rights"), ("B", "All citizens have strictly equal rights, the freedom of expression, and possess the power to hold their elected leaders accountable"), ("C", "Citizens are legally forbidden to question the government"), ("D", "Citizens must blindly follow the commands of a king")
    ], "B"),
    (21, "Hard", "The strict constitutional separation of powers between the Legislature, Executive, and Judiciary is absolutely essential to a healthy democracy because:", [
        ("A", "It saves the government a massive amount of money"), ("B", "It creates a robust, self-regulating system of 'checks and balances', ensuring that no single organ becomes overwhelmingly powerful and abuses its authority"), ("C", "It allows the Prime Minister to act exactly like an unchecked king"), ("D", "It makes the complex process of lawmaking much faster")
    ], "B"),
    (22, "Hard", "During the severe COVID-19 pandemic, the central legislature passed emergency guidelines, state police enforced curfews, and courts actively ensured citizens' rights to healthcare were not violated. What crucial democratic concept does this vividly demonstrate?", [
        ("A", "That only the Executive branch actually matters in a crisis"), ("B", "That all three organs and all three tiers of government must work synergistically and simultaneously to manage massive national crises"), ("C", "That the local tier of government was entirely unnecessary"), ("D", "That democratic systems completely fail during emergencies")
    ], "B"),
    (23, "Hard", "The ancient, profound quote from the epic Mahabharata, \"The ruler protects dharma and dharma protects those who protect it,\" analytically implies what about the nature of governance?", [
        ("A", "Rulers possess divine right and can do whatever they want without consequence"), ("B", "Governance is based on a strict reciprocal duty; leaders must rule justly and ethically (protect dharma) in order to maintain their own legitimacy and societal stability"), ("C", "Written laws are completely unnecessary if a population is highly religious"), ("D", "Only trained warriors have the inherent right to rule")
    ], "B"),
    (24, "Hard", "In a representative democracy, the vital political concept of 'accountability' explicitly means that:", [
        ("A", "Citizens must constantly account for all their personal money to the king"), ("B", "Elected leaders are held strictly responsible for their official actions, decisions, and failures, and must constantly answer to the people who voted them into power"), ("C", "The Judiciary entirely controls the outcome of all local elections"), ("D", "The police have the unaccountable power to arrest anyone without cause")
    ], "B"),
    (25, "Hard", "Why was a complex, three-tier system of government (Central, State, Local) strategically adopted in a vast, diverse country like India?", [
        ("A", "Because the Central government building is physically too small"), ("B", "To effectively decentralize administrative power, ensuring that highly specific local issues can be addressed rapidly and efficiently by local people who understand them best"), ("C", "Solely to create millions of more jobs for aspiring politicians"), ("D", "Because the modern Constitution was mindlessly copied from ancient texts")
    ], "B"),
    (26, "Hard", "If the Legislature uses its majority to pass a law that is blatantly unfair or directly violates the foundational rights guaranteed by the Constitution, which specific organ has the ultimate constitutional power to check or strike down this illegal law?", [
        ("A", "The Executive Cabinet"), ("B", "The National Police Force"), ("C", "The Judiciary (The Supreme Court)"), ("D", "The Local Village Panchayat")
    ], "C"),
    (27, "Hard", "The advanced civic concept of 'Participatory Democracy' goes a significant step further than basic representative democracy by heavily emphasizing:", [
        ("A", "That people only need to vote once every five years and then ignore politics"), ("B", "The continuous, active, and direct involvement of everyday citizens in day-to-day civic decision-making, planning, and community governance"), ("C", "That every single citizen must become a full-time, paid politician"), ("D", "That the act of voting is legally mandatory under threat of prison")
    ], "B"),
    (28, "Hard", "Which of the following analytical distinctions best differentiates a general 'rule' from a formal 'law'?", [
        ("A", "Rules are exclusively for adults; laws are exclusively for children"), ("B", "Rules organically guide general behavior in specific settings like homes or schools, while laws are highly specific, codified rules formally debated, enacted, and strictly enforced by the government for the entire society under threat of penalty"), ("C", "Laws are easily breakable without consequence; rules are not"), ("D", "There is absolutely no sociological or legal difference between the two")
    ], "B"),
    (29, "Hard", "How does the fundamental mechanism of a democracy actively promote and enforce equality among vastly different citizens?", [
        ("A", "By ensuring the government gives everyone the exact same amount of money"), ("B", "By granting every single adult citizen exactly one, equal vote—regardless of their immense wealth, social caste, gender, or religion—making everyone politically equal"), ("C", "By legally giving more voting power to highly educated people"), ("D", "By enforcing a law that everyone must wear the exact same uniform clothes")
    ], "B"),
    (30, "Hard", "The cyber police successfully tracking down and arresting criminals is a clear example of the Executive branch enforcing laws. What is the mandatory next step in the democratic process to ensure justice?", [
        ("A", "The police instantly and independently decide the punishment for the criminal"), ("B", "The Legislature convenes to write a brand new law specifically for that one criminal"), ("C", "The Judiciary conducts a fair, impartial trial based on evidence to determine legal guilt and assign the appropriate, legal punishment"), ("D", "The criminal is automatically let go if they sign a promise not to do it again")
    ], "C")
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

output_path = "/Users/jayantolhyan/Desktop/my projects/deployed/teacher sathi final/public/quizzes/class-6-social-science-chapter-10.json"

with open(output_path, "w", encoding="utf-8") as f:
    json.dump(quiz_data, f, indent=2, ensure_ascii=False)

print(f"Successfully generated {output_path} with {len(quiz_data['questions'])} questions.")
