import json

raw_data = [
    (1, "Easy", "What is the collective term for the local government structures operating in cities and towns?", [
        ("A", "Gram Panchayats"), ("B", "Urban Local Bodies"), ("C", "Zila Parishads"), ("D", "National Parliaments")
    ], "B"),
    (2, "Easy", "Which powerful urban local body is established to manage very large, densely populated cities with a population exceeding 10 lakhs (1 million)?", [
        ("A", "Municipal Council"), ("B", "Nagar Panchayat"), ("C", "Municipal Corporation (Mahanagar Nigam)"), ("D", "Gram Sabha")
    ], "C"),
    (3, "Easy", "Which urban local body is designed to manage smaller towns with a population ranging between 1 lakh and 10 lakhs?", [
        ("A", "Municipal Corporation"), ("B", "Municipal Council (Nagar Palika)"), ("C", "Zila Parishad"), ("D", "Ward Committee")
    ], "B"),
    (4, "Easy", "What type of local body governs a 'transitional area'—a place that is rapidly changing from a rural village into an urban town?", [
        ("A", "Municipal Corporation"), ("B", "Nagar Panchayat"), ("C", "Village Panchayat"), ("D", "State Assembly")
    ], "B"),
    (5, "Easy", "For the purpose of elections and efficient administration, large cities and towns are divided into much smaller units. What are these units called?", [
        ("A", "Blocks"), ("B", "States"), ("C", "Wards"), ("D", "Districts")
    ], "C"),
    (6, "Easy", "The individuals who are democratically elected by the people to represent a specific ward are called:", [
        ("A", "Ward Councillors"), ("B", "Sarpanches"), ("C", "Patwaris"), ("D", "Chief Ministers")
    ], "A"),
    (7, "Easy", "Which of the following is a key, daily duty of an urban local body?", [
        ("A", "Printing national currency"), ("B", "Efficient garbage collection and comprehensive waste management"), ("C", "Defending the country's borders"), ("D", "Running the national railways")
    ], "B"),
    (8, "Easy", "What is the urban equivalent of the rural Gram Sabha, where local citizens can directly participate and raise hyper-local issues?", [
        ("A", "The Supreme Court"), ("B", "The National Parliament"), ("C", "People of the Ward / Mohalla Sabha"), ("D", "The Mayor's private office")
    ], "C"),
    (9, "Easy", "If you reside in a city, what primary financial contribution do you make to the urban local body to help them run essential civic services?", [
        ("A", "National Income tax"), ("B", "Local taxes (like property, sewage, or water tax)"), ("C", "International Import duty"), ("D", "None, services are free")
    ], "B"),
    (10, "Easy", "Which specific constitutional amendment officially established and empowered the urban local bodies across India?", [
        ("A", "73rd Amendment"), ("B", "74th Amendment"), ("C", "1st Amendment"), ("D", "100th Amendment")
    ], "B"),
    (11, "Medium", "Why does a massive metropolis like Mumbai have a Municipal Corporation, while a smaller town is governed by a Municipal Council?", [
        ("A", "Because Mumbai is a much older city"), ("B", "Because the administrative structure strictly depends on population size; vastly larger populations require much bigger, more complex administrative bodies and larger budgets"), ("C", "Because Mumbai has more wealthy residents"), ("D", "Because small towns don't require any form of government")
    ], "B"),
    (12, "Medium", "What is the practical, day-to-day function of a Ward Committee?", [
        ("A", "To unilaterally elect the Prime Minister"), ("B", "To facilitate localized civic activities (like health camps) and diligently report micro-problems (like blocked drains) to the higher authorities"), ("C", "To build massive national highways"), ("D", "To collect all national income tax")
    ], "B"),
    (13, "Medium", "How is the democratic concept of 'decentralisation' practically applied in urban governance?", [
        ("A", "All power is hoarded by the Prime Minister in the capital"), ("B", "Power is deliberately shifted down so local city communities have a direct, legal say in managing their immediate areas and solving hyper-local issues"), ("C", "The national military is given control to run the city"), ("D", "Power is handed over to neighboring countries")
    ], "B"),
    (14, "Medium", "If there is a massive water leak or a dangerously broken streetlight in your ward, what is your primary duty as an active citizen in a participatory democracy?", [
        ("A", "Ignore it and hope someone else acts"), ("B", "Wait indefinitely for the Mayor to personally notice it"), ("C", "Promptly report the exact problem to the municipal authorities"), ("D", "Immediately move to another city")
    ], "C"),
    (15, "Medium", "Why is rigorous waste segregation by citizens at home so critically important for urban local bodies?", [
        ("A", "It makes large-scale garbage collection, recycling, and disposal vastly easier and more efficient for the municipality"), ("B", "It is merely a fun game for children"), ("C", "The municipality pays citizens large sums of cash for doing it"), ("D", "It makes the garbage smell significantly better")
    ], "A"),
    (16, "Medium", "While Ward Councillors make the decisions, who is responsible for carrying out the complex administrative work and actually implementing those decisions?", [
        ("A", "The President of India"), ("B", "The appointed administrative staff led by the Municipal Commissioner"), ("C", "The local city police"), ("D", "The High Court judges")
    ], "B"),
    (17, "Medium", "Maintaining public burial grounds, manicuring city parks, and verifying the implementation of government welfare schemes are core functions of:", [
        ("A", "The State Police Force"), ("B", "Urban Local Bodies"), ("C", "The Central Government"), ("D", "The Indian Army")
    ], "B"),
    (18, "Medium", "What does the acronym CRM stand for in the context of advanced services offered by modern, high-tech municipal corporations like Indore?", [
        ("A", "Central Railway Management"), ("B", "Citizen Relationship Management (a system for handling public grievances and swift service requests)"), ("C", "City Road Maintenance"), ("D", "Council Resource Money")
    ], "B"),
    (19, "Medium", "Which of the following is emphatically NOT a duty of a responsible citizen residing in a crowded urban area?", [
        ("A", "Paying local property and water taxes honestly"), ("B", "Not littering in shared public spaces"), ("C", "Illegally encroaching on public footpaths to expand a shop"), ("D", "Actively planting trees in the neighborhood")
    ], "C"),
    (20, "Medium", "In the practical example provided in the textbook, how did the citizens Sameer and Anita successfully participate in grassroots democracy in their city?", [
        ("A", "They voted directly for the President"), ("B", "They spotted a dangerously low-hanging electricity wire, reported it to their local member, and successfully got the electric post shifted"), ("C", "They acted as vigilantes and arrested a criminal"), ("D", "They personally built a new paved road")
    ], "B"),
    (21, "Hard", "Why is urban governance generally considered vastly more complex and difficult to manage than rural governance?", [
        ("A", "Because cities have significantly smaller populations"), ("B", "Because urban areas are characterized by massive, incredibly dense populations, highly diverse and demanding infrastructure needs (like mass transit and massive sanitation systems), and highly complex economies"), ("C", "Because there are absolutely no wards in cities"), ("D", "Because villages possess infinitely more financial wealth")
    ], "B"),
    (22, "Hard", "\"Participatory democracy\" in a bustling urban setting demands going far beyond just voting in elections every few years. Which action best illustrates this advanced civic concept?", [
        ("A", "Passively watching political news on television"), ("B", "Actively attending local ward meetings, diligently participating in at-home waste segregation, and persistently reporting civic infrastructural issues"), ("C", "Grudgingly paying taxes and completely avoiding all interaction with the local council"), ("D", "Constantly complaining to friends about terrible city traffic without taking action")
    ], "B"),
    (23, "Hard", "The formal, legal transition from a rural Gram Panchayat to an urban Nagar Panchayat is triggered when:", [
        ("A", "A village population drastically decreases"), ("B", "A rural area starts rapidly developing urban economic features (like markets and non-agricultural jobs) and its population crosses a specific constitutional threshold, officially becoming a 'transitional area'"), ("C", "The city is completely destroyed by a disaster"), ("D", "The state government simply runs out of rural funding")
    ], "B"),
    (24, "Hard", "How do the elected Ward Councillors and the appointed Municipal Commissioner strategically balance power within a Municipal Corporation?", [
        ("A", "Councillors execute the laws on the ground, while the Commissioner makes the laws"), ("B", "Elected Councillors make high-level policies and budget decisions representing the people's will, while the appointed Commissioner and their trained staff execute and administer these complex decisions"), ("C", "They fight violently until one side establishes total dominance"), ("D", "The Commissioner is elected by the people, and Councillors are appointed by the state")
    ], "B"),
    (25, "Hard", "When rigorously comparing the rural Panchayati Raj and urban municipal systems, what is the core structural and philosophical similarity between them?", [
        ("A", "Both are exclusively headed by a Mayor"), ("B", "Both are constitutionally mandated, three-tiered decentralised systems relying on elected local representatives and anchored by a grassroots participatory unit (Gram Sabha / People of the Ward)"), ("C", "Both deal exclusively with regulating agricultural output"), ("D", "Both are directly managed and funded entirely by the Central Government")
    ], "B"),
    (26, "Hard", "If a powerful Municipal Corporation utterly fails to provide clean, safe drinking water to its residents, which fundamental aspect of its constitutional duty is being egregiously neglected?", [
        ("A", "Maintaining public burial grounds"), ("B", "Taking care of essential, life-sustaining civic infrastructure and protecting public health services"), ("C", "Managing high schools"), ("D", "Collecting local taxes")
    ], "B"),
    (27, "Hard", "Why was the passage of the 74th Amendment Act deemed historically and administratively necessary by the Indian Parliament?", [
        ("A", "Because urban areas were expanding rapidly and desperately needed a uniformly recognized, deeply democratic, and highly accountable local governance structure to handle complex city problems"), ("B", "Because rural villages suddenly wanted to become massive cities overnight"), ("C", "Because the Prime Minister could no longer physically visit every city"), ("D", "Because major cities wanted to secede and become independent states")
    ], "A"),
    (28, "Hard", "Why does illegally encroaching on public footpaths directly violate the core duties of an urban citizen?", [
        ("A", "Simply because it makes the city look aesthetically ugly"), ("B", "Because it selfishly disrupts shared civic infrastructure, creating severe safety hazards and demonstrating a total lack of care for the community's fundamental right to safe public spaces"), ("C", "Because the municipality desperately wants to sell the footpath to corporations"), ("D", "Because it is technically illegal to walk in a city")
    ], "B"),
    (29, "Hard", "The highly acclaimed Indore Municipal Corporation offers rapid services like mobile toilets and ambulance dispatch through its digital CRM system. What does this indicate about the evolution of urban governance?", [
        ("A", "That urban local bodies only exist to ruthlessly collect taxes"), ("B", "That modern, effective urban governance aggressively leverages digital technology for highly efficient service delivery and direct, accountable citizen engagement"), ("C", "That Indore is actually a highly rural, underdeveloped area"), ("D", "That modern citizens have absolutely no responsibilities left")
    ], "B"),
    (30, "Hard", "If a sprawling, massive metropolis is meticulously divided into 100 distinct wards, how does this extensive division practically benefit the concept of governance?", [
        ("A", "It deliberately divides the people so they constantly fight against each other"), ("B", "It ensures high-resolution, micro-level representation, making it vastly easier for average citizens to reach their specific Ward Councillor with their hyper-local grievances"), ("C", "It essentially means the city has 100 different Mayors"), ("D", "It drastically reduces the overall amount of taxes collected by the city")
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

output_path = "/Users/jayantolhyan/Desktop/my projects/deployed/teacher sathi final/public/quizzes/class-6-social-science-chapter-12.json"

with open(output_path, "w", encoding="utf-8") as f:
    json.dump(quiz_data, f, indent=2, ensure_ascii=False)

print(f"Successfully generated {output_path} with {len(quiz_data['questions'])} questions.")
