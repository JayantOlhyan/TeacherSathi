import json

raw_data = [
    (1, "Easy", "Activities that involve directly extracting or utilizing raw materials straight from nature (like farming, forestry, and fishing) belong to which fundamental economic sector?", [
        ("A", "Primary Sector"), ("B", "Secondary Sector"), ("C", "Tertiary Sector"), ("D", "Public Sector")
    ], "A"),
    (2, "Easy", "Activities that involve processing raw materials and transforming them into finished goods (like manufacturing in large factories) belong to which economic sector?", [
        ("A", "Primary Sector"), ("B", "Secondary Sector"), ("C", "Tertiary Sector"), ("D", "Service Sector")
    ], "B"),
    (3, "Easy", "Activities that do not produce goods, but instead provide essential services (like transport, banking, and education) belong to which economic sector?", [
        ("A", "Primary Sector"), ("B", "Secondary Sector"), ("C", "Tertiary Sector"), ("D", "Manufacturing Sector")
    ], "C"),
    (4, "Easy", "The act of growing crops such as wheat, rice, and vegetables on a farm is a classic example of an activity in the:", [
        ("A", "Tertiary Sector"), ("B", "Secondary Sector"), ("C", "Primary Sector"), ("D", "Technology Sector")
    ], "C"),
    (5, "Easy", "The act of making finely crafted furniture out of raw wood in a workshop is a classic example of an activity in the:", [
        ("A", "Primary Sector"), ("B", "Secondary Sector"), ("C", "Tertiary Sector"), ("D", "Forest Sector")
    ], "B"),
    (6, "Easy", "A truck driver who spends his days transporting fresh vegetables from the farm to the city market works in the:", [
        ("A", "Primary Sector"), ("B", "Secondary Sector"), ("C", "Tertiary Sector"), ("D", "Agricultural Sector")
    ], "C"),
    (7, "Easy", "Which of the following is strictly a Primary Sector economic activity?", [
        ("A", "Deep-shaft mining for coal"), ("B", "Teaching mathematics in a high school"), ("C", "Baking bread in a commercial oven"), ("D", "Stitching clothes in a tailor shop")
    ], "A"),
    (8, "Easy", "Which of the following is strictly a Tertiary Sector economic activity?", [
        ("A", "Catching fish in the deep ocean"), ("B", "Weaving raw cotton into fine cloth"), ("C", "Treating sick patients in a modern hospital (Healthcare)"), ("D", "Raising a herd of cows for fresh milk")
    ], "C"),
    (9, "Easy", "A specific group of people who voluntarily come together to collectively meet their economic needs, such as a group of dairy farmers forming a shared enterprise, is called a:", [
        ("A", "Heavy Factory"), ("B", "Cooperative"), ("C", "Central Bank"), ("D", "Commercial Warehouse")
    ], "B"),
    (10, "Easy", "Massive, secure buildings used specifically for storing vast quantities of products safely before they are sold or transported to shops are called:", [
        ("A", "Manufacturing Factories"), ("B", "Dairies"), ("C", "Warehouses"), ("D", "Medical Clinics")
    ], "C"),
    (11, "Medium", "How are the three main economic sectors (Primary, Secondary, Tertiary) functionally related to each other in a real-world economy?", [
        ("A", "They operate in total isolation and do not interact at all"), ("B", "They aggressively compete to destroy each other"), ("C", "They are highly interdependent; every single sector relies heavily on the output and services of the others to function"), ("D", "Only the Primary sector actually matters to survival")
    ], "C"),
    (12, "Medium", "If a farmer sells raw milk, a massive factory pasteurizes and turns it into cheese, and a local shopkeeper sells the cheese, which specific sector does the factory belong to?", [
        ("A", "Primary"), ("B", "Secondary"), ("C", "Tertiary"), ("D", "None of the above")
    ], "B"),
    (13, "Medium", "Why is the Secondary Sector frequently referred to by economists as the \"industrial\" or \"manufacturing\" sector?", [
        ("A", "Because it only involves planting trees"), ("B", "Because it bridges the critical gap between raw natural materials and consumers by using heavy industries and machinery to process and manufacture finished goods"), ("C", "Because it provides financial services like banking"), ("D", "Because it only operates within mega-cities")
    ], "B"),
    (14, "Medium", "Which world-famous, highly successful cooperative in Gujarat fundamentally transformed the lives of millions of rural dairy farmers?", [
        ("A", "BHEL"), ("B", "AMUL"), ("C", "Reliance"), ("D", "Tata")
    ], "B"),
    (15, "Medium", "What vital, sustaining role does the Tertiary Sector play for the other two production-based sectors?", [
        ("A", "It systematically destroys their products to keep prices high"), ("B", "It provides absolutely essential support services like massive transportation networks, fast communication, and global trade to help them physically operate and sell their goods"), ("C", "It grows the raw materials for them in fields"), ("D", "It physically manufactures heavy machines for them")
    ], "B"),
    (16, "Medium", "In the complex, multi-stage process of making a school textbook, cutting down forest trees for wood pulp is a ________ activity, while utilizing complex machines to print the book is a ________ activity.", [
        ("A", "Primary; Secondary"), ("B", "Secondary; Tertiary"), ("C", "Primary; Tertiary"), ("D", "Tertiary; Secondary")
    ], "A"),
    (17, "Medium", "A large national bank providing a heavy financial loan to a rural farmer so he can buy a modern tractor is a prime example of which sector actively supporting the Primary sector?", [
        ("A", "Primary Sector"), ("B", "Secondary Sector"), ("C", "Tertiary Sector"), ("D", "Manufacturing Sector")
    ], "C"),
    (18, "Medium", "In the context of the vast dairy industry, what exactly is 'pasteurisation'?", [
        ("A", "A new process of making clothes from milk"), ("B", "A critical scientific process of rapidly heating milk to a specific high temperature to kill harmful bacteria and preserve it for transport"), ("C", "A way to transport milk in pipes"), ("D", "A specific, high-yield breed of cow")
    ], "B"),
    (19, "Medium", "The economic act of selling finished goods in small, individual quantities directly to the final end consumer is called:", [
        ("A", "International Export"), ("B", "Bulk Wholesale"), ("C", "Retail"), ("D", "Deep Earth Mining")
    ], "C"),
    (20, "Medium", "Why do massive secondary sector factories desperately depend on tertiary communication and banking services?", [
        ("A", "To catch fish in the nearby rivers"), ("B", "To securely process massive financial payments, secure corporate loans, and instantly communicate with global suppliers and buyers"), ("C", "To grow crops inside the factory"), ("D", "To physically mine iron ore")
    ], "B"),
    (21, "Hard", "\"The root of prosperity is economic activity...\" What would catastrophically happen to the secondary and tertiary sectors if all primary activities globally suddenly ceased to exist?", [
        ("A", "They would thrive independently using synthetic materials"), ("B", "They would face total systemic collapse, as the primary sector provides the absolute foundational raw materials required for any manufacturing and the physical goods needed for any trade"), ("C", "They would seamlessly turn into primary sectors themselves"), ("D", "Only massive digital banks would survive")
    ], "B"),
    (22, "Hard", "How does a massive cooperative structure like AMUL fundamentally empower primary sector workers (poor rural farmers) against economic exploitation?", [
        ("A", "By forcing them to work long hours in dangerous factories"), ("B", "By entirely eliminating exploitative, profit-hoarding middlemen, pooling their resources, and giving the farmers direct collective ownership and fair, massive profits from the processing (secondary) and nationwide sale (tertiary) of their own milk"), ("C", "By legally stopping them from producing any milk"), ("D", "By replacing biological cows with synthetic machines")
    ], "B"),
    (23, "Hard", "Consider the complex economic journey of a simple cotton shirt: 1. Growing the raw cotton, 2. Spinning the yarn and weaving the cloth in a mill, 3. Selling it in a luxury mall. This accurately represents the sequential economic flow of:", [
        ("A", "Tertiary -> Secondary -> Primary"), ("B", "Primary -> Secondary -> Tertiary"), ("C", "Secondary -> Primary -> Tertiary"), ("D", "Tertiary -> Primary -> Secondary")
    ], "B"),
    (24, "Hard", "Which of the following complex industrial activities adds the highest exponential 'value' to a raw material through intense, skilled processing?", [
        ("A", "Simply plucking an apple from a tree"), ("B", "Catching a fish with a basic net"), ("C", "Transforming raw iron ore and basic steel into a highly advanced, computerized automobile"), ("D", "Digging a shallow well for water")
    ], "C"),
    (25, "Hard", "A highly educated architect designing the complex blueprints for a massive new factory building is engaged in which economic sector?", [
        ("A", "Primary"), ("B", "Secondary"), ("C", "Tertiary"), ("D", "Quaternary (Note: While advanced macroeconomic models use Quaternary, the Class 6 NCERT framework aligns all professional intellectual services firmly within the Tertiary sector).")
    ], "C"),
    (26, "Hard", "Why are the specific tertiary sub-sectors of massive transportation and warehousing considered the absolute, crucial 'links' in any global economy?", [
        ("A", "Because they magically manufacture new goods out of thin air"), ("B", "Because they physically and logistically connect the isolated primary producers to the secondary factories, and the factories to the final retail consumers, ensuring the delicate supply chain does not break"), ("C", "Because they extract resources from the earth"), ("D", "Because they operate entirely for free")
    ], "B"),
    (27, "Hard", "If India successfully exports thousands of manufactured garments to another nation, what does the economic term 'export' precisely mean?", [
        ("A", "High-quality goods that are produced in one country and profitably sold to buyers or consumers in another sovereign country"), ("B", "Cheap goods aggressively bought from another country"), ("C", "Defective goods thrown away into the ocean"), ("D", "Stolen goods hidden secretly in a warehouse")
    ], "A"),
    (28, "Hard", "The massive, generational shift of a developing country's workforce from basic subsistence farming to factory labor, and eventually to high-tech IT services, represents a macroeconomic transition from:", [
        ("A", "Tertiary to Primary"), ("B", "Primary to Secondary to Tertiary"), ("C", "Secondary to Tertiary to Primary"), ("D", "Primary to Primary")
    ], "B"),
    (29, "Hard", "A skilled mobile phone repair technician provides a diagnostic service. However, the complex microchip spare parts he installs are manufactured goods. This common scenario best illustrates:", [
        ("A", "That the primary sector is utterly useless in the modern world"), ("B", "The incredibly deep, unavoidable interdependence between the secondary sector (manufacturing the parts) and the tertiary sector (providing the repair service)"), ("C", "That repairing electronics is actually a primary agricultural activity"), ("D", "That microchips grow organically on trees")
    ], "B"),
    (30, "Hard", "Beyond just moving physical goods, how does the tertiary sector directly and profoundly improve the fundamental quality of life and build 'human capital' within a nation?", [
        ("A", "By aggressively mining more coal"), ("B", "Through vital, life-altering services like advanced education (schools/universities) and expert healthcare (hospitals) which structurally build a highly skilled, intelligent, and healthy population capable of extreme innovation"), ("C", "By rapidly cutting down ancient forests"), ("D", "By creating massive amounts of industrial pollution")
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

output_path = "/Users/jayantolhyan/Desktop/my projects/deployed/teacher sathi final/public/quizzes/class-6-social-science-chapter-14.json"

with open(output_path, "w", encoding="utf-8") as f:
    json.dump(quiz_data, f, indent=2, ensure_ascii=False)

print(f"Successfully generated {output_path} with {len(quiz_data['questions'])} questions.")
