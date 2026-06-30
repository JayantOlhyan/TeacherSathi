import { NCERT_SYLLABUS } from "./ncertSyllabus";

export interface ChapterDetails {
  title: string;
  description: string;
  studyTime: string;
}

/**
 * Helper to fetch chapter details or generate a smart fallback if not found.
 */
export function getChapterDetails(grade: string, subject: string, chapter: string): ChapterDetails {
  // Convert URL slugs to readable format (e.g. 'class-10' -> 'Class 10', 'science' -> 'Science')
  const cleanGrade = grade.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const cleanSubjectName = subject.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const cleanChapterNum = chapter.replace("chapter-", "");

  const classSyllabus = NCERT_SYLLABUS[cleanGrade];
  
  if (classSyllabus) {
    const subjectSyllabus = classSyllabus[cleanSubjectName];
    if (subjectSyllabus) {
      // Array is 0-indexed, chapterNum is 1-indexed
      const chapterData = subjectSyllabus[parseInt(cleanChapterNum) - 1];
      if (chapterData) {
        return {
          title: chapterData.en,
          description: chapterData.descEn,
          studyTime: "2h 30min" // Simplified for now
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
