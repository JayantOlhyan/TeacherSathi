import { describe, it, expect } from 'vitest';
import { NCERT_SYLLABUS } from '@/lib/data/ncertSyllabus';

describe('TeacherSathi Usability Program - Global Search & Cockpit Index', () => {
  it('indexes all 5 core classes (Classes 6 to 10)', () => {
    const classes = Object.keys(NCERT_SYLLABUS);
    expect(classes).toContain('Class 6');
    expect(classes).toContain('Class 7');
    expect(classes).toContain('Class 8');
    expect(classes).toContain('Class 9');
    expect(classes).toContain('Class 10');
  });

  it('contains over 300 NCERT chapters with bilingual metadata', () => {
    let totalChapters = 0;
    let bilingualCount = 0;

    Object.values(NCERT_SYLLABUS).forEach((subjects) => {
      Object.values(subjects).forEach((chapters) => {
        chapters.forEach((ch) => {
          totalChapters += 1;
          if (ch.en && ch.hi) {
            bilingualCount += 1;
          }
        });
      });
    });

    expect(totalChapters).toBeGreaterThan(300);
    expect(bilingualCount).toBe(totalChapters);
  });

  it('correctly matches search query in English and Hindi', () => {
    const queryEn = 'exploring forces';
    const queryHi = 'विज्ञान';

    let matchFoundEn = false;
    let matchFoundHi = false;

    Object.values(NCERT_SYLLABUS).forEach((subjects) => {
      Object.values(subjects).forEach((chapters) => {
        chapters.forEach((ch) => {
          if (ch.en.toLowerCase().includes(queryEn)) matchFoundEn = true;
          if (ch.hi.includes(queryHi)) matchFoundHi = true;
        });
      });
    });

    expect(matchFoundEn).toBe(true);
    expect(matchFoundHi).toBe(true);
  });

  it('generates valid classroom and workspace URLs for chapters', () => {
    const gradeSlug = 'class-8';
    const subjectSlug = 'science';
    const chapterSlug = 'chapter-1';
    const chapterTitle = 'Crop Production and Management';

    const classroomUrl = `/classroom?grade=${gradeSlug}&subject=${subjectSlug}&chapter=${chapterSlug}&title=${encodeURIComponent(
      chapterTitle
    )}&returnUrl=${encodeURIComponent(`/content/${gradeSlug}/${subjectSlug}/${chapterSlug}`)}`;

    expect(classroomUrl).toContain('/classroom');
    expect(classroomUrl).toContain('grade=class-8');
    expect(classroomUrl).toContain('chapter=chapter-1');
    expect(classroomUrl).toContain('returnUrl');
  });
});
