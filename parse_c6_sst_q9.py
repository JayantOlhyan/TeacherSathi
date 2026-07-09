import json

raw_data = [
    (1, "Easy", "According to sociological definitions, what is considered the fundamental and most ancient building block unit of any society?", [
        ("A", "The local school"), ("B", "The family"), ("C", "The central government"), ("D", "The economic market")
    ], "B"),
    (2, "Easy", "A family structure that strictly consists only of parents and their immediate children is officially called a:", [
        ("A", "Joint family"), ("B", "Nuclear family"), ("C", "Extended family"), ("D", "Community group")
    ], "B"),
    (3, "Easy", "A larger family structure where grandparents, parents, children, and sometimes uncles and aunts live together under one roof is called a:", [
        ("A", "Nuclear family"), ("B", "Joint family"), ("C", "Small family"), ("D", "Village council")
    ], "B"),
    (4, "Easy", "What is the defining term for a group of connected people who share social bonds, live near each other, and support each other?", [
        ("A", "A community"), ("B", "A random crowd"), ("C", "A financial market"), ("D", "A corporate business")
    ], "A"),
    (5, "Easy", "The celebrated ancient Tamil poet Tiruvalluvar famously wrote that the \"flower and fruit of family life\" are specifically:", [
        ("A", "Money and political power"), ("B", "Deep love and righteous dharma"), ("C", "Plentiful food and large shelter"), ("D", "Worldly fame and military glory")
    ], "B"),
    (6, "Easy", "Which core Indian cultural value specifically translates to \"service\" to others?", [
        ("A", "Dana"), ("B", "Tyaga"), ("C", "Seva"), ("D", "Ahimsa")
    ], "C"),
    (7, "Easy", "Which core Indian cultural value specifically translates to \"giving\" or \"charity\"?", [
        ("A", "Dana"), ("B", "Seva"), ("C", "Tyaga"), ("D", "Ahimsa")
    ], "A"),
    (8, "Easy", "The textbook metaphorically describes the family as a 'school'. What is the primary thing children learn in this 'school'?", [
        ("A", "How to drive vehicles"), ("B", "Important moral values, cultural traditions, and social responsibilities"), ("C", "Advanced computer programming"), ("D", "Complex mathematics")
    ], "B"),
    (9, "Easy", "What does the vital sociological term \"interdependence\" mean when applied to a community?", [
        ("A", "People relying heavily on each other for mutual support, resources, and survival"), ("B", "People constantly fighting and competing with each other"), ("C", "People living completely isolated and alone"), ("D", "People migrating away to large cities")
    ], "A"),
    (10, "Easy", "Which universally famous, ethical literary text did the poet Tiruvalluvar author?", [
        ("A", "The Mahabharata"), ("B", "The Tirukkural"), ("C", "The Ramayana"), ("D", "The Atharvaveda")
    ], "B"),
    (11, "Medium", "Why do many traditional Indian languages remarkably lack a single, generic word for the English term 'cousin'?", [
        ("A", "Because traditional Indian cultures do not value or recognize extended relatives"), ("B", "Because Indian languages possess a much richer, highly specific kinship vocabulary that describes the exact relationship (e.g., father's younger brother's son)"), ("C", "Because cousins rarely live in India"), ("D", "Because ancient families were extremely small")
    ], "B"),
    (12, "Medium", "What does the profound concept of 'Tyaga' mean in the specific context of sustaining family values?", [
        ("A", "Taking all available resources for oneself"), ("B", "Sacrifice; the act of individuals willingly giving up their own immediate needs or desires for the greater good and needs of the family"), ("C", "Working strictly for monetary gain"), ("D", "Fighting bravely against foreign enemies")
    ], "B"),
    (13, "Medium", "How do traditional rural and tribal communities typically manage shared ecological resources like grazing lands or forest produce?", [
        ("A", "By engaging in constant physical warfare over them"), ("B", "By establishing deeply respected unwritten agreements and traditional rules to ensure everyone has fair, secure access"), ("C", "By surrendering all control to the central government"), ("D", "By selling the resources to foreign countries")
    ], "B"),
    (14, "Medium", "What exactly is the 'Halma' tradition beautifully practiced by the indigenous Bhil community?", [
        ("A", "A competitive dance festival"), ("B", "A deep-rooted tradition of mass volunteering, coming together to support an individual in crisis or to execute large-scale community welfare work"), ("C", "A specific type of nuclear family structure"), ("D", "A unique method of cooking community feasts")
    ], "B"),
    (15, "Medium", "Within the dynamics of a healthy family, the term \"cooperation\" practically means:", [
        ("A", "Constantly arguing over who does household chores"), ("B", "Working together harmoniously, sharing responsibilities, and supporting one another"), ("C", "Forcing one person to do absolutely all the work"), ("D", "Completely ignoring each other's needs")
    ], "B"),
    (16, "Medium", "How has rapid modern urbanization heavily affected traditional family structures across India?", [
        ("A", "It has forced all families to revert to massive joint families"), ("B", "It has led to a significant increase in smaller nuclear families, primarily due to individuals migrating to cities for work and education"), ("C", "It has completely destroyed the sociological concept of family"), ("D", "It has legally stopped people from getting married")
    ], "B"),
    (17, "Medium", "Why is it structurally necessary for families and individuals within any community to have specific duties and responsibilities?", [
        ("A", "Because otherwise, the complex social and economic fabric of the community will fail to function smoothly"), ("B", "Because they are forced to do so under threat of strict police arrest"), ("C", "To earn a high financial salary directly from the community leaders"), ("D", "To win local popularity competitions")
    ], "A"),
    (18, "Medium", "A tribal community coming together in thousands to plant trees and dig massive trenches for rainwater conservation (as beautifully demonstrated by the Bhils) is a prime example of:", [
        ("A", "Capitalist Industrialization"), ("B", "Deep social interdependence and highly effective collective community action"), ("C", "The breakdown of the nuclear family structure"), ("D", "A purely profit-driven economic activity")
    ], "B"),
    (19, "Medium", "Which of the following is sociologically considered a primary, core function of the family unit?", [
        ("A", "Issuing national passports and ID cards"), ("B", "Transmitting foundational moral values, maintaining ancient cultural traditions, and providing vital emotional support"), ("C", "Building national highways and bridges"), ("D", "Regulating the national stock market")
    ], "B"),
    (20, "Medium", "In the specific kinship vocabulary of Hindi, what exact relationship does the term Chacha denote?", [
        ("A", "A mother's older brother"), ("B", "A father's younger brother"), ("C", "An older married sister"), ("D", "A paternal grandfather")
    ], "B"),
    (21, "Hard", "What profound psychological and ethical insight did Tiruvalluvar convey by inextricably linking \"love and dharma\" as the fruit of family life?", [
        ("A", "That family life is merely a strict, joyless set of legal rules"), ("B", "That deep emotional bonds (love) and the fulfillment of righteous duty/responsibility (dharma) are the essential, mutually reinforcing outcomes of successfully living in a family"), ("C", "That love and duty are fundamentally opposing forces"), ("D", "That families should focus exclusively on agriculture")
    ], "B"),
    (22, "Hard", "How does the ongoing structural demographic shift from large joint families to isolated nuclear families impact the transmission of cultural heritage?", [
        ("A", "It completely and instantly stops all transmission of cultural values"), ("B", "It fundamentally alters the dynamics, often reducing the everyday, immersive influence of extended family elders, thus making conscious, deliberate effort necessary by parents to maintain and pass on traditions"), ("C", "It miraculously makes cultural transmission much faster and more efficient"), ("D", "It has absolutely no measurable sociological effect")
    ], "B"),
    (23, "Hard", "In what significant way does the Bhil 'Halma' tradition powerfully reflect the concept of grassroots social and ecological resilience?", [
        ("A", "It shows that local communities must rely entirely on delayed government financial funds"), ("B", "It demonstrates how ancient, traditional communal support systems can successfully mobilize to solve modern, severe ecological and social crises through collective, unpaid volunteer effort"), ("C", "It proves that tribal traditions are outdated and useless in the modern world"), ("D", "It is actually a highly disguised, profit-driven corporate economic activity")
    ], "B"),
    (24, "Hard", "How do modern community support networks often substitute for some of the lost functions of the traditional joint family in dense urban settings?", [
        ("A", "By legally replacing biological parents"), ("B", "Institutions such as close-knit neighborhoods, community centers, and local school networks organically step in to provide the critical social support, childcare assistance, and collective belonging that an extended family traditionally provided"), ("C", "By paying strangers to act as family members"), ("D", "Urban areas are sociologically proven to have zero community structures")
    ], "B"),
    (25, "Hard", "The existence of incredibly detailed kinship terms in Indian languages (such as clearly distinguishing a mother's sister from a father's sister with different words) analytically indicates:", [
        ("A", "A severe lack of general vocabulary in ancient times"), ("B", "The immense, deep sociological significance and highly precise, distinct roles assigned to extended family members in the functioning of traditional Indian society"), ("C", "That everyone historically lived strictly in isolated nuclear families"), ("D", "A historical confusion about genetic relationships")
    ], "B"),
    (26, "Hard", "When individuals actively practice the high value of 'Tyaga' (sacrifice) within a family setting, what are they ethically prioritizing?", [
        ("A", "Their own personal, ruthless ambition over everything else"), ("B", "The long-term collective well-being, harmony, and stability of the family unit over their own immediate, short-term personal desires or comforts"), ("C", "The accumulation of individual financial wealth"), ("D", "Breaking away entirely from community obligations")
    ], "B"),
    (27, "Hard", "Why are unwritten, traditional community rules regarding shared ecological resources so surprisingly effective in many rural and tribal areas?", [
        ("A", "Because the people live in constant fear of brutal police enforcement"), ("B", "Because they are organically based on deep mutual respect, profound economic interdependence, and ancestral traditions that practically ensure the collective survival of the entire group"), ("C", "Because historically, no one in the village knew how to write"), ("D", "Because the rules are arbitrarily changed every single day by a dictator")
    ], "B"),
    (28, "Hard", "Based on sociological principles, which of the following statements best describes the symbiotic relationship between a family and its surrounding community?", [
        ("A", "They are completely independent entities that never interact"), ("B", "A community is organically formed by a network of interconnected families, and the foundational values (like cooperation and respect) learned within the micro-level of the family are what sustain the macro-level of the community"), ("C", "The growth of a community always fundamentally destroys the family unit"), ("D", "True communities only exist in highly populated, modern cities")
    ], "B"),
    (29, "Hard", "How did entrenched social hierarchies (such as the rigid caste system) historically affect the sociology of Indian family and community life?", [
        ("A", "By seamlessly promoting absolute, utopian equality across all regions"), ("B", "By strictly determining traditional occupations, enforcing rigid marriage practices, and cementing unequal social status, leading to deep historical inequalities that modern constitutional policies now actively attempt to address"), ("C", "By completely erasing all regional cultural differences"), ("D", "By legally forcing everyone into small nuclear families")
    ], "B"),
    (30, "Hard", "The Bhil community's massive tree-planting and water-harvesting efforts earned them high national recognition (Padma Shri). What crucial economic and social lesson does this highlight about the nature of 'non-economic' activities?", [
        ("A", "They are a total waste of productive time and resources"), ("B", "Activities purely driven by civic duty, love, and community responsibility can create immense, tangible environmental and social value without any direct monetary exchange or profit motive"), ("C", "Only heavily funded government projects can solve environmental issues"), ("D", "Trees can only be successfully planted if individuals are paid high corporate salaries")
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

output_path = "/Users/jayantolhyan/Desktop/my projects/deployed/teacher sathi final/public/quizzes/class-6-social-science-chapter-9.json"

with open(output_path, "w", encoding="utf-8") as f:
    json.dump(quiz_data, f, indent=2, ensure_ascii=False)

print(f"Successfully generated {output_path} with {len(quiz_data['questions'])} questions.")
