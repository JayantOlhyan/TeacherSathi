import json

raw_data = [
    (1, "Easy", "Work that is specifically performed to earn a livelihood, profit, or money is formally classified as an:", [
        ("A", "Entertaining activity"), ("B", "Economic activity"), ("C", "Non-economic activity"), ("D", "Illegal activity")
    ], "B"),
    (2, "Easy", "Conversely, work that is done out of love, care, profound respect, or civic duty, without expecting any financial payment, is called a:", [
        ("A", "Economic activity"), ("B", "Non-economic activity"), ("C", "Profitable activity"), ("D", "Corporate business")
    ], "B"),
    (3, "Easy", "Which of the following scenarios is a clear, standard example of an economic activity?", [
        ("A", "A mother lovingly cooking food for her children"), ("B", "A highly trained doctor treating patients in a hospital for a professional fee"), ("C", "Friends playing a friendly game of cricket"), ("D", "A teenager helping a blind person cross a busy street")
    ], "B"),
    (4, "Easy", "Which of the following scenarios is a clear, standard example of a non-economic activity?", [
        ("A", "A commercial farmer selling bulk wheat in the wholesale market"), ("B", "A professional tailor stitching clothes for paying customers"), ("C", "Parents patiently helping their children with their daily schoolwork"), ("D", "A commercial pilot flying a passenger airplane")
    ], "C"),
    (5, "Easy", "The regular, fixed monthly payment made to permanent employees (like teachers or office workers) for their continued work is called a:", [
        ("A", "Wage"), ("B", "Salary"), ("C", "Fee"), ("D", "Profit")
    ], "B"),
    (6, "Easy", "Payment that is calculated strictly based on hours worked or daily physical tasks completed (such as a daily construction worker) is called a:", [
        ("A", "Salary"), ("B", "Wage"), ("C", "Fee"), ("D", "Rent")
    ], "B"),
    (7, "Easy", "What is the specific financial term for the payment made to a highly trained professional, like a lawyer or a specialized doctor, in exchange for their expert advice or service?", [
        ("A", "Wage"), ("B", "Fee"), ("C", "Rent"), ("D", "Profit")
    ], "B"),
    (8, "Easy", "If a rural farm labourer receives a large basket of mangoes instead of physical cash for his hard day of work, what is this traditional form of payment called?", [
        ("A", "Salary"), ("B", "Fee"), ("C", "Payment in kind"), ("D", "Corporate commission")
    ], "C"),
    (9, "Easy", "A physical or digital place where people actively engage in the economic exchange of goods and services is called a:", [
        ("A", "Market"), ("B", "Museum"), ("C", "Public Park"), ("D", "Library")
    ], "A"),
    (10, "Easy", "Massive community service activities, such as serving free food to thousands at a Gurudwara (Langar), are shining examples of:", [
        ("A", "Purely Economic activities"), ("B", "Non-economic activities"), ("C", "Commercial Farming"), ("D", "Industrial Manufacturing")
    ], "B"),
    (11, "Medium", "How does engaging in a sequential economic activity result in \"value addition\"?", [
        ("A", "It simply adds extra physical weight to the product"), ("B", "It transforms a basic raw material into a refined, finished product, actively increasing its monetary worth at each progressive stage of production"), ("C", "It legally makes all things free"), ("D", "It permanently destroys the original raw material")
    ], "B"),
    (12, "Medium", "If Rajesh the carpenter buys raw wood for ₹600 and skillfully uses his tools and time to make a beautiful chair which he sells for ₹1000, what is the exact financial \"value addition\"?", [
        ("A", "₹600"), ("B", "₹1000"), ("C", "₹400"), ("D", "₹1600")
    ], "C"),
    (13, "Medium", "Which of the following complex activities actively creates 'Monetary Value' in the economy?", [
        ("A", "A brilliant scientist conducting laboratory research and earning a monthly salary"), ("B", "A devoted person taking full-time care of a sick, bedridden grandparent"), ("C", "A group of volunteers spending their weekend cleaning a public park"), ("D", "A family organizing a massive festival for their relatives")
    ], "A"),
    (14, "Medium", "A highly qualified teacher teaching students in a private school for a salary is performing an ________ activity. The exact same teacher teaching her own son at home for free in the evening is performing a ________ activity.", [
        ("A", "Economic; Non-economic"), ("B", "Non-economic; Economic"), ("C", "Economic; Economic"), ("D", "Non-economic; Non-economic")
    ], "A"),
    (15, "Medium", "If there is no money involved, why do millions of people still willingly engage in grueling non-economic activities?", [
        ("A", "Simply to eventually become secretly rich"), ("B", "For deep personal satisfaction, boundless love, a strong sense of social responsibility, or profound cultural bonding"), ("C", "Because they are physically forced by the central government"), ("D", "Simply as a complicated way to pay taxes")
    ], "B"),
    (16, "Medium", "In the strict realm of commerce, what is the primary, driving aim of engaging in an economic activity?", [
        ("A", "To achieve deep mental peace and spiritual satisfaction"), ("B", "Earning a sustainable livelihood or generating financial profit"), ("C", "Doing widespread, selfless charity"), ("D", "Getting physical exercise")
    ], "B"),
    (17, "Medium", "Massive corporate companies running complex international businesses primarily aim to generate:", [
        ("A", "Daily Wages"), ("B", "Consultation Fees"), ("C", "Land Rent"), ("D", "Financial Profits")
    ], "D"),
    (18, "Medium", "Which prominent, national community program specifically helps combat severe deforestation and promotes long-term environmental sustainability through non-economic mass volunteering?", [
        ("A", "Diwali"), ("B", "Van Mahotsav (National Tree planting drive)"), ("C", "Langar"), ("D", "The National Election")
    ], "B"),
    (19, "Medium", "How do unpaid, non-economic activities like grueling daily household chores meaningfully contribute to the broader society?", [
        ("A", "They directly generate massive amounts of national tax revenue"), ("B", "They critically provide a safe, nurturing environment, vital emotional support, and maintain family/community well-being, forming the very backbone of a stable society"), ("C", "They produce high-tech goods for international export"), ("D", "Economists agree they have absolutely no value whatsoever")
    ], "B"),
    (20, "Medium", "If Kabir's grandfather, a highly decorated retired army officer, spends his evenings teaching local impoverished children for absolutely free, what is this a textbook example of?", [
        ("A", "An illegal economic activity"), ("B", "Selfless community service (a high-value non-economic activity)"), ("C", "A highly profitable corporate business"), ("D", "Industrial manufacturing")
    ], "B"),
    (21, "Hard", "The profound social concept of the \"Dignity of Labour\" heavily emphasized in this chapter practically implies that:", [
        ("A", "Only highly educated, mental work is valuable to a nation"), ("B", "Only incredibly high-paying corporate jobs are respectable"), ("C", "All forms of honest, hard work—whether gruelingly physical or intensely mental, paid or unpaid—deserve absolute, equal respect and contribute indispensably to society"), ("D", "Unpaid volunteer work should be legally banned")
    ], "C"),
    (22, "Hard", "How does the economic concept of \"value addition\" mathematically and philosophically represent human effort?", [
        ("A", "It shows that raw materials magically change form on their own"), ("B", "The monetary difference in price between the base raw materials and the final finished product represents the exact financial compensation for the human labor, time, intense creativity, and specialized skill applied during the process"), ("C", "It proves that all money is fundamentally useless"), ("D", "It shows that all carpenters inherently overcharge")
    ], "B"),
    (23, "Hard", "Why is it an urgent sociological necessity to recognize and validate the immense value of \"invisible\" or \"unpaid\" work, such as the relentless caregiving and domestic labor predominantly performed by women at home?", [
        ("A", "Because it is actually a highly taxed economic activity"), ("B", "Because while it is unjustly ignored in formal GDP measurements, it is the absolute foundational bedrock that ensures the daily survival, physical health, and social stability of the entire paid workforce and society as a whole"), ("C", "Merely so the government can begin taxing it"), ("D", "Because women should be legally forced to be paid by the central government for it")
    ], "B"),
    (24, "Hard", "A highly skilled software engineer works for a massive tech company (earning a massive salary) and then volunteers on weekends to teach those exact same computer skills at an impoverished orphanage for free. Which analytical statement is true?", [
        ("A", "Both actions are strictly economic activities"), ("B", "Both actions are strictly non-economic activities"), ("C", "The exact same highly specialized skill can underlie both an economic and a non-economic activity, distinguished entirely by the presence or absence of monetary exchange and intent"), ("D", "Volunteering completely ruins his economic value to the tech company")
    ], "C"),
    (25, "Hard", "What profound social value is actively demonstrated by massive, unpaid community practices like Swachh Bharat Abhiyan (Clean India Mission) or the Sikh tradition of Langar?", [
        ("A", "Maximizing and earning corporate profits"), ("B", "Fostering a deep sense of radical equality, shared humanity, profound civic responsibility, and environmental care entirely devoid of any financial motives"), ("C", "Artificially inflating local property values"), ("D", "Creating aggressive corporate monopolies")
    ], "B"),
    (26, "Hard", "If wealthy landowners legally allow someone to use their fertile agricultural land or a commercial building, the specific economic payment they receive in return is called:", [
        ("A", "Salary"), ("B", "Wage"), ("C", "Fee"), ("D", "Rent")
    ], "D"),
    (27, "Hard", "A person who strategically buys products in bulk from primary producers and sells them at a markup to end consumers, charging a fee for this logistical and sales service, is acting as a:", [
        ("A", "Manufacturer"), ("B", "Middleman"), ("C", "Volunteer"), ("D", "Farmer")
    ], "B"),
    (28, "Hard", "Which of the following complex situations most effectively blurs the strict, traditional line between economic and non-economic activities?", [
        ("A", "A factory worker assembling cars for a wage"), ("B", "A commercial baker selling bread for profit"), ("C", "A subsistence farmer growing vegetables, keeping half to feed his starving family (non-economic survival) and selling the remaining half in the local market to buy tools (economic)"), ("D", "A highly paid doctor performing surgery in a luxury private hospital")
    ], "C"),
    (29, "Hard", "\"When you are doing any work, do not think of anything beyond. Do it as worship...\" This profound quote by Swami Vivekananda highlights:", [
        ("A", "That all work must only be done for massive amounts of money"), ("B", "The intrinsic spiritual value, total dedication, and deep mindfulness one should apply to any task, elevating it far beyond just a mundane chore into an act of supreme devotion"), ("C", "That strictly religious work is the only real work worth doing"), ("D", "That people should be forced to work 24 hours a day without rest")
    ], "B"),
    (30, "Hard", "In the broader scope of macroeconomics, why are economic activities considered the absolute \"root of prosperity\" as famously stated in Kautilya's ancient Arthashastra?", [
        ("A", "Because they systematically generate vast wealth, provide essential livelihoods, continuously produce the necessary goods/services for survival, and actively prevent widespread material distress and societal collapse"), ("B", "Simply because they make ruling kings infinitely powerful"), ("C", "Because they completely replace the need for loving families"), ("D", "Because they intentionally cause hyper-inflation")
    ], "A")
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

output_path = "/Users/jayantolhyan/Desktop/my projects/deployed/teacher sathi final/public/quizzes/class-6-social-science-chapter-13.json"

with open(output_path, "w", encoding="utf-8") as f:
    json.dump(quiz_data, f, indent=2, ensure_ascii=False)

print(f"Successfully generated {output_path} with {len(quiz_data['questions'])} questions.")
