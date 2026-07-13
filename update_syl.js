const fs = require('fs');
const ts = fs.readFileSync('src/lib/data/ncertSyllabus.ts', 'utf-8');

const newMath8 = `    "Mathematics": [
      {"id": 1, "en": "A Square and A Cube", "hi": "एक वर्ग और एक घन", "descEn": "Understanding squares, square roots, cubes, and cube roots.", "descHi": "वर्ग, वर्गमूल, घन और घनमूल को समझना।"},
      {"id": 2, "en": "Power Play", "hi": "घातों का खेल", "descEn": "Working with exponents and powers.", "descHi": "घातांक और घात के साथ कार्य करना।"},
      {"id": 3, "en": "A Story of Numbers", "hi": "संख्याओं की कहानी", "descEn": "Exploring properties and history of numbers.", "descHi": "संख्याओं के गुणों और इतिहास की खोज।"},
      {"id": 4, "en": "Quadrilaterals", "hi": "चतुर्भुज", "descEn": "Properties of different types of quadrilaterals.", "descHi": "विभिन्न प्रकार के चतुर्भुजों के गुण।"},
      {"id": 5, "en": "Number Play", "hi": "संख्याओं का खेल", "descEn": "Fun properties and patterns of numbers.", "descHi": "संख्याओं के मज़ेदार गुण और पैटर्न।"},
      {"id": 6, "en": "We Distribute, Yet Things Multiply", "hi": "हम बाँटते हैं, फिर भी चीज़ें गुणा होती हैं", "descEn": "Understanding algebraic expressions and distribution.", "descHi": "बीजीय व्यंजकों और वितरण को समझना।"},
      {"id": 7, "en": "Proportional Reasoning", "hi": "आनुपातिक तर्क", "descEn": "Direct and inverse proportions.", "descHi": "प्रत्यक्ष और व्युत्क्रमानुपाती।"},
      {"id": 8, "en": "Fractions in Disguise", "hi": "भेष में भिन्न", "descEn": "Advanced concepts in fractions and decimals.", "descHi": "भिन्न और दशमलव में उन्नत अवधारणाएँ।"},
      {"id": 9, "en": "The Baudhayana–Pythagoras Theorem", "hi": "बौधायन-पाइथागोरस प्रमेय", "descEn": "Understanding right-angled triangles and the theorem.", "descHi": "समकोण त्रिभुज और प्रमेय को समझना।"},
      {"id": 10, "en": "Proportional Reasoning - 2", "hi": "आनुपातिक तर्क - 2", "descEn": "Advanced concepts in direct and inverse proportions.", "descHi": "प्रत्यक्ष और व्युत्क्रमानुपाती में उन्नत अवधारणाएँ।"},
      {"id": 11, "en": "Exploring Some Geometric Themes", "hi": "कुछ ज्यामितीय विषयों की खोज", "descEn": "Exploring geometric concepts like tessellations and fractals.", "descHi": "टैसिलेशन और फ्रैक्टल जैसी ज्यामितीय अवधारणाओं की खोज।"},
      {"id": 12, "en": "Tales by Dots and Lines", "hi": "बिंदुओं और रेखाओं की कहानियाँ", "descEn": "Data handling, representation, and interpretation using graphs.", "descHi": "ग्राफ का उपयोग करके आँकड़ों का प्रबंधन, प्रतिनिधित्व और व्याख्या।"},
      {"id": 13, "en": "Algebra Play", "hi": "बीजगणित का खेल", "descEn": "Introduction to algebraic expressions and equations.", "descHi": "बीजीय व्यंजकों और समीकरणों का परिचय।"},
      {"id": 14, "en": "Area", "hi": "क्षेत्रफल", "descEn": "Calculating areas of different geometric figures.", "descHi": "विभिन्न ज्यामितीय आकृतियों के क्षेत्रफल की गणना।"}
    ],`;

// The regex will find the Class 8 Mathematics array and replace it.
const regex = /"Class 8": \{\s*"Mathematics": \[\s*\{[\s\S]*?\}\s*\],/;
const updatedTs = ts.replace(regex, `"Class 8": {\n${newMath8}`);

fs.writeFileSync('src/lib/data/ncertSyllabus.ts', updatedTs, 'utf-8');
console.log("Updated Class 8 Mathematics in ncertSyllabus.ts");
