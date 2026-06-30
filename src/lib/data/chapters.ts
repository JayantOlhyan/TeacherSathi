import { NCERT_SYLLABUS } from "./ncertSyllabus";

export interface ChapterDetails {
  title: string;
  titleHi?: string;
  description: string;
  descriptionHi?: string;
  studyTime: string;
}

/**
 * Helper to fetch chapter details or generate a smart fallback if not found.
 */
export function getChapterDetails(grade: string, subject: string, chapter: string): ChapterDetails {
  // Convert URL slugs to readable format (e.g. 'class-10' -> 'Class 10', 'social-science' -> 'Social Science')
  const cleanGrade = grade.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const cleanSubjectName = subject.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const cleanChapterNum = chapter.replace("chapter-", "");

  const classSyllabus = NCERT_SYLLABUS[cleanGrade] || NCERT_SYLLABUS[grade];
  
  if (classSyllabus) {
    // Find subject matching exact clean name or case-insensitive without hyphens/spaces
    const matchedSubjectKey = Object.keys(classSyllabus).find(
      key => key.toLowerCase().replace(/[-\s]/g, "") === cleanSubjectName.toLowerCase().replace(/[-\s]/g, "")
    );

    if (matchedSubjectKey) {
      const subjectSyllabus = classSyllabus[matchedSubjectKey];
      // Array is 0-indexed, chapterNum is 1-indexed
      const chapterIndex = parseInt(cleanChapterNum, 10) - 1;
      const chapterData = !isNaN(chapterIndex) ? subjectSyllabus[chapterIndex] : undefined;
      
      if (chapterData) {
        return {
          title: chapterData.en,
          titleHi: chapterData.hi,
          description: chapterData.descEn,
          descriptionHi: chapterData.descHi,
          studyTime: "2h 30min"
        };
      }
    }
  }

  // Smart Fallback
  return {
    title: `Chapter ${cleanChapterNum}: ${cleanSubjectName} Concepts`,
    description: `Comprehensive ${cleanGrade} ${cleanSubjectName} chapter resources tailored for Indian government school teachers. Includes interactive smart classroom teaching modules and revision summaries.`,
    studyTime: "2h 00min", 
  };
}
