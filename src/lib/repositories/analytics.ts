import { SupabaseClient } from '@supabase/supabase-js';
import { supabase as defaultClient } from '@/lib/supabase/client';
import { masteryService } from '@/lib/services/mastery';
import {
  ConceptMasteryItem,
  LearningGapItem,
  MasteryStatus,
  EvidenceConfidence,
  ObservedDifficultyTier,
} from '@/lib/validations/analytics';

export interface ClassConceptMasterySummary {
  conceptId: string;
  conceptNameEn: string;
  conceptNameHi: string;
  chapterId: string;
  chapterTitleEn: string;
  averageMasteryScore: number;
  status: MasteryStatus;
  confidence: EvidenceConfidence;
  totalEvidenceCount: number;
  studentsAttemptedCount: number;
  studentsNeedingSupportCount: number;
  observedDifficulty: ObservedDifficultyTier;
  affectedStudents: Array<{
    studentId: string;
    studentName: string;
    masteryScore: number;
  }>;
}

export interface StudentGroupItem {
  studentId: string;
  fullName: string;
  averageMasteryScore: number;
  evaluatedConceptsCount: number;
  weakConceptsCount: number;
}

export interface ClassDiagnosticReport {
  classId: string;
  className: string;
  section: string;
  gradeId: string;
  studentCount: number;
  overallClassMastery: number;
  conceptMasteries: ClassConceptMasterySummary[];
  studentGroupings: {
    needsSupport: StudentGroupItem[];
    developing: StudentGroupItem[];
    onTrack: StudentGroupItem[];
  };
  topGaps: Array<{
    conceptId: string;
    conceptNameEn: string;
    averageMasteryScore: number;
    affectedStudentsCount: number;
    recommendedAction: string;
  }>;
}

export interface StudentMasteryProfile {
  studentId: string;
  fullName: string;
  overallMastery: number;
  evaluatedConceptsCount: number;
  conceptMasteries: ConceptMasteryItem[];
  activeGaps: LearningGapItem[];
  recentImprovements: Array<{
    conceptId: string;
    conceptNameEn: string;
    previousScore: number;
    currentScore: number;
    delta: number;
  }>;
}

export const analyticsRepository = {
  /**
   * Generates a pedagogical diagnostic report for an entire classroom cohort.
   * Answers: Which concepts are weak across the classroom, and which students need support?
   */
  async getClassMastery(
    classId: string,
    options: { chapterId?: string; subjectId?: string } = {},
    client: SupabaseClient = defaultClient
  ): Promise<ClassDiagnosticReport> {
    // 1. Fetch class details
    const { data: classRecord, error: classError } = await client
      .from('classes')
      .select('id, name, section, grade_id')
      .eq('id', classId)
      .single();

    if (classError || !classRecord) {
      throw new Error(`Class not found: ${classError?.message || classId}`);
    }

    // 2. Fetch enrolled students
    const { data: enrollments } = await client
      .from('class_students')
      .select('student_id, student:profiles(id, full_name)')
      .eq('class_id', classId)
      .eq('enrollment_status', 'ACTIVE');

    const students = (enrollments || []).map((e) => {
      const p = Array.isArray(e.student) ? e.student[0] : e.student;
      return {
        id: e.student_id,
        name: p?.full_name || 'Student',
      };
    });

    if (students.length === 0) {
      return {
        classId: classRecord.id,
        className: classRecord.name,
        section: classRecord.section,
        gradeId: classRecord.grade_id,
        studentCount: 0,
        overallClassMastery: 0,
        conceptMasteries: [],
        studentGroupings: {
          needsSupport: [],
          developing: [],
          onTrack: [],
        },
        topGaps: [],
      };
    }

    const studentIds = students.map((s) => s.id);

    // 3. Query materialized concept masteries for all students in class
    let query = client
      .from('student_concept_mastery')
      .select(`
        id,
        student_id,
        concept_id,
        chapter_id,
        subject_id,
        grade_id,
        mastery_score,
        confidence_level,
        evidence_count,
        correct_count,
        incorrect_count,
        status,
        last_assessed_at,
        concept:concepts(id, name_en, name_hi),
        chapter:chapters(id, title_en)
      `)
      .in('student_id', studentIds);

    if (options.chapterId) {
      query = query.eq('chapter_id', options.chapterId);
    }
    if (options.subjectId) {
      query = query.eq('subject_id', options.subjectId);
    }

    const { data: masteries, error: mError } = await query;
    if (mError) {
      throw new Error(`Failed to load class masteries: ${mError.message}`);
    }

    const rows = masteries || [];

    // 4. Fetch question metrics for observed difficulties
    const { data: qMetrics } = await client
      .from('question_metrics')
      .select('question_id, observed_difficulty');

    const questionMetricsMap = new Map<string, ObservedDifficultyTier>();
    (qMetrics || []).forEach((qm) => questionMetricsMap.set(qm.question_id, qm.observed_difficulty as ObservedDifficultyTier));

    // 5. Aggregate by Concept
    const conceptAggMap = new Map<
      string,
      {
        conceptId: string;
        conceptNameEn: string;
        conceptNameHi: string;
        chapterId: string;
        chapterTitleEn: string;
        scores: number[];
        totalEvidence: number;
        studentsAttempted: Set<string>;
        weakStudentsCount: number;
        affectedStudents: Array<{
          studentId: string;
          studentName: string;
          masteryScore: number;
        }>;
      }
    >();

    const studentScoresMap = new Map<string, number[]>();
    const studentWeakCountMap = new Map<string, number>();
    students.forEach((s) => {
      studentScoresMap.set(s.id, []);
      studentWeakCountMap.set(s.id, 0);
    });

    for (const r of rows) {
      const c = Array.isArray(r.concept) ? r.concept[0] : r.concept;
      const ch = Array.isArray(r.chapter) ? r.chapter[0] : r.chapter;
      const conceptId = r.concept_id;

      if (!conceptAggMap.has(conceptId)) {
        conceptAggMap.set(conceptId, {
          conceptId,
          conceptNameEn: c?.name_en || 'Concept',
          conceptNameHi: c?.name_hi || '',
          chapterId: r.chapter_id,
          chapterTitleEn: ch?.title_en || 'Chapter',
          scores: [],
          totalEvidence: 0,
          studentsAttempted: new Set(),
          weakStudentsCount: 0,
          affectedStudents: [],
        });
      }

      const agg = conceptAggMap.get(conceptId)!;
      const score = Number(r.mastery_score);
      agg.scores.push(score);
      agg.totalEvidence += r.evidence_count;
      agg.studentsAttempted.add(r.student_id);

      if (score < 60) {
        agg.weakStudentsCount++;
        const studentInfo = students.find((s) => s.id === r.student_id);
        agg.affectedStudents.push({
          studentId: r.student_id,
          studentName: studentInfo?.name || 'Student',
          masteryScore: score,
        });
      }

      if (studentScoresMap.has(r.student_id)) {
        studentScoresMap.get(r.student_id)!.push(score);
        if (score < 60) {
          studentWeakCountMap.set(r.student_id, (studentWeakCountMap.get(r.student_id) || 0) + 1);
        }
      }
    }

    const conceptMasteries: ClassConceptMasterySummary[] = Array.from(conceptAggMap.values()).map((agg) => {
      const avgScore = agg.scores.length > 0
        ? Number((agg.scores.reduce((sum, s) => sum + s, 0) / agg.scores.length).toFixed(1))
        : 0;

      let status: MasteryStatus = 'INSUFFICIENT_EVIDENCE';
      if (agg.scores.length > 0) {
        if (avgScore < 40) status = 'CRITICAL';
        else if (avgScore < 60) status = 'DEVELOPING';
        else if (avgScore < 75) status = 'APPROACHING';
        else if (avgScore < 90) status = 'PROFICIENT';
        else status = 'STRONG';
      }

      const confidence: EvidenceConfidence = agg.totalEvidence >= 20 ? 'HIGH' : agg.totalEvidence >= 6 ? 'MEDIUM' : 'LOW';

      return {
        conceptId: agg.conceptId,
        conceptNameEn: agg.conceptNameEn,
        conceptNameHi: agg.conceptNameHi,
        chapterId: agg.chapterId,
        chapterTitleEn: agg.chapterTitleEn,
        averageMasteryScore: avgScore,
        status,
        confidence,
        totalEvidenceCount: agg.totalEvidence,
        studentsAttemptedCount: agg.studentsAttempted.size,
        studentsNeedingSupportCount: agg.weakStudentsCount,
        observedDifficulty: avgScore < 50 ? 'DIFFICULT' : avgScore < 75 ? 'MODERATE' : 'EASY',
        affectedStudents: agg.affectedStudents,
      };
    });

    // Sort concepts by lowest mastery score first (highest intervention priority)
    conceptMasteries.sort((a, b) => a.averageMasteryScore - b.averageMasteryScore);

    // 6. Group Students into Educational Tiers (Needs Support, Developing, On Track)
    const needsSupport: StudentGroupItem[] = [];
    const developing: StudentGroupItem[] = [];
    const onTrack: StudentGroupItem[] = [];

    let totalClassScoreSum = 0;
    let studentsWithScoresCount = 0;

    students.forEach((s) => {
      const scores = studentScoresMap.get(s.id) || [];
      const evaluatedCount = scores.length;
      const weakCount = studentWeakCountMap.get(s.id) || 0;

      const avg = evaluatedCount > 0
        ? Number((scores.reduce((sum, val) => sum + val, 0) / evaluatedCount).toFixed(1))
        : 0;

      if (evaluatedCount > 0) {
        totalClassScoreSum += avg;
        studentsWithScoresCount++;
      }

      const item: StudentGroupItem = {
        studentId: s.id,
        fullName: s.name,
        averageMasteryScore: avg,
        evaluatedConceptsCount: evaluatedCount,
        weakConceptsCount: weakCount,
      };

      if (evaluatedCount === 0 || avg < 60) {
        needsSupport.push(item);
      } else if (avg < 75) {
        developing.push(item);
      } else {
        onTrack.push(item);
      }
    });

    const overallClassMastery = studentsWithScoresCount > 0
      ? Number((totalClassScoreSum / studentsWithScoresCount).toFixed(1))
      : 0;

    // 7. Top Class Gaps
    const topGaps = conceptMasteries
      .filter((c) => c.averageMasteryScore < 60 && c.studentsNeedingSupportCount > 0)
      .slice(0, 5)
      .map((c) => ({
        conceptId: c.conceptId,
        conceptNameEn: c.conceptNameEn,
        averageMasteryScore: c.averageMasteryScore,
        affectedStudentsCount: c.studentsNeedingSupportCount,
        recommendedAction: `Re-teach ${c.conceptNameEn} using visual anchor and assign 5-question targeted practice.`,
      }));

    return {
      classId: classRecord.id,
      className: classRecord.name,
      section: classRecord.section,
      gradeId: classRecord.grade_id,
      studentCount: students.length,
      overallClassMastery,
      conceptMasteries,
      studentGroupings: {
        needsSupport,
        developing,
        onTrack,
      },
      topGaps,
    };
  },

  /**
   * Retrieves a student's personal concept mastery profile and historical learning trajectory.
   */
  async getStudentMasteryProfile(
    studentId: string,
    options: { subjectId?: string; chapterId?: string } = {},
    client: SupabaseClient = defaultClient
  ): Promise<StudentMasteryProfile> {
    const { data: profile, error: pError } = await client
      .from('profiles')
      .select('id, full_name')
      .eq('id', studentId)
      .single();

    if (pError || !profile) {
      throw new Error(`Student not found: ${pError?.message || studentId}`);
    }

    // 1. Fetch current concept masteries
    let query = client
      .from('student_concept_mastery')
      .select(`
        id,
        student_id,
        concept_id,
        chapter_id,
        subject_id,
        grade_id,
        mastery_score,
        confidence_level,
        evidence_count,
        correct_count,
        incorrect_count,
        unanswered_count,
        recent_accuracy,
        historical_accuracy,
        status,
        last_assessed_at,
        concept:concepts(id, name_en, name_hi),
        chapter:chapters(id, title_en)
      `)
      .eq('student_id', studentId);

    if (options.subjectId) query = query.eq('subject_id', options.subjectId);
    if (options.chapterId) query = query.eq('chapter_id', options.chapterId);

    const { data: masteries } = await query;
    const masteryRows = masteries || [];

    // 2. Fetch history for trends
    const conceptIds = masteryRows.map((m) => m.concept_id);
    const trendMap = new Map<string, Array<{ masteryScore: number; calculatedAt: string }>>();

    if (conceptIds.length > 0) {
      const { data: history } = await client
        .from('concept_mastery_history')
        .select('concept_id, mastery_score, calculated_at')
        .eq('student_id', studentId)
        .in('concept_id', conceptIds)
        .order('calculated_at', { ascending: true });

      (history || []).forEach((h) => {
        if (!trendMap.has(h.concept_id)) trendMap.set(h.concept_id, []);
        trendMap.get(h.concept_id)!.push({
          masteryScore: Number(h.mastery_score),
          calculatedAt: h.calculated_at,
        });
      });
    }

    const conceptMasteries: ConceptMasteryItem[] = masteryRows.map((r) => {
      const c = Array.isArray(r.concept) ? r.concept[0] : r.concept;
      const ch = Array.isArray(r.chapter) ? r.chapter[0] : r.chapter;
      return {
        id: r.id,
        studentId: r.student_id,
        conceptId: r.concept_id,
        conceptNameEn: c?.name_en || 'Concept',
        conceptNameHi: c?.name_hi || '',
        chapterId: r.chapter_id,
        chapterTitleEn: ch?.title_en || 'Chapter',
        subjectId: r.subject_id,
        gradeId: r.grade_id,
        masteryScore: Number(r.mastery_score),
        confidenceLevel: r.confidence_level as EvidenceConfidence,
        evidenceCount: r.evidence_count,
        correctCount: r.correct_count,
        incorrectCount: r.incorrect_count,
        unansweredCount: r.unanswered_count,
        recentAccuracy: r.recent_accuracy != null ? Number(r.recent_accuracy) : null,
        historicalAccuracy: r.historical_accuracy != null ? Number(r.historical_accuracy) : null,
        status: r.status as MasteryStatus,
        lastAssessedAt: r.last_assessed_at,
        trend: trendMap.get(r.concept_id) || [],
      };
    });

    // 3. Fetch active learning gaps
    const { data: gaps } = await client
      .from('learning_gaps')
      .select(`
        id,
        student_id,
        concept_id,
        chapter_id,
        subject_id,
        grade_id,
        severity,
        mastery_score,
        confidence_level,
        evidence_count,
        status,
        recommended_action,
        detected_at,
        resolved_at,
        concept:concepts(name_en)
      `)
      .eq('student_id', studentId)
      .neq('status', 'RESOLVED');

    const activeGaps: LearningGapItem[] = (gaps || []).map((g) => {
      const c = Array.isArray(g.concept) ? g.concept[0] : g.concept;
      return {
        id: g.id,
        studentId: g.student_id,
        studentName: profile.full_name,
        conceptId: g.concept_id,
        conceptNameEn: c?.name_en || 'Concept',
        chapterId: g.chapter_id,
        subjectId: g.subject_id,
        gradeId: g.grade_id,
        severity: g.severity,
        masteryScore: Number(g.mastery_score),
        confidenceLevel: g.confidence_level as EvidenceConfidence,
        evidenceCount: g.evidence_count,
        status: g.status,
        recommendedAction: g.recommended_action,
        detectedAt: g.detected_at,
        resolvedAt: g.resolved_at,
      };
    });

    // 4. Calculate Recent Improvements
    const recentImprovements: Array<{
      conceptId: string;
      conceptNameEn: string;
      previousScore: number;
      currentScore: number;
      delta: number;
    }> = [];

    conceptMasteries.forEach((cm) => {
      const historyItems = cm.trend || [];
      if (historyItems.length >= 2) {
        const first = historyItems[0].masteryScore;
        const current = cm.masteryScore;
        const delta = current - first;
        if (delta > 0) {
          recentImprovements.push({
            conceptId: cm.conceptId,
            conceptNameEn: cm.conceptNameEn || 'Concept',
            previousScore: first,
            currentScore: current,
            delta: Number(delta.toFixed(1)),
          });
        }
      }
    });

    const evaluatedCount = conceptMasteries.length;
    const overallMastery = evaluatedCount > 0
      ? Number((conceptMasteries.reduce((sum, c) => sum + c.masteryScore, 0) / evaluatedCount).toFixed(1))
      : 0;

    return {
      studentId: profile.id,
      fullName: profile.full_name,
      overallMastery,
      evaluatedConceptsCount: evaluatedCount,
      conceptMasteries,
      activeGaps,
      recentImprovements,
    };
  },

  /**
   * Triggers deterministic recalculation for a student.
   */
  async recomputeStudent(
    studentId: string,
    client: SupabaseClient = defaultClient
  ) {
    return masteryService.recomputeForStudent(studentId, {}, client);
  },

  /**
   * Triggers deterministic recalculation for a classroom.
   */
  async recomputeClass(
    classId: string,
    client: SupabaseClient = defaultClient
  ) {
    return masteryService.recomputeForClass(classId, client);
  },
};
