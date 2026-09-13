import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase as defaultClient } from '../supabase/client';
import {
  InstitutionalScope,
  MINIMUM_COHORT_THRESHOLD,
} from '../validations/institution';

export interface ScopeOverviewSummary {
  scopeType: InstitutionalScope;
  scopeId: string;
  scopeName: string;
  totalSchools: number;
  activeSchools: number;
  totalTeachers: number;
  activeTeachers: number;
  totalStudents: number;
  activeStudents: number;
  totalClasses: number;
  totalAssessments: number;
  averageMasteryScore: number | null;
  insufficientData: boolean;
  totalOpenGaps: number;
  resolvedGapsCount: number;
  gapResolutionRate: number;
  resourceUsageCount: number;
  adoptionRate: number; // percentage of schools with active teachers/assessments
}

export interface ConceptAcademicSummary {
  conceptId: string;
  conceptNameEn: string;
  conceptNameHi?: string;
  chapterTitleEn: string;
  subjectName: string;
  averageMastery: number | null;
  studentsEvaluatedCount: number;
  insufficientData: boolean;
  masteryStatus: 'NEEDS_SUPPORT' | 'DEVELOPING' | 'MASTERED' | 'INSUFFICIENT_DATA';
  studentsNeedingSupportCount: number;
}

export interface LearningGapAggregateItem {
  conceptId: string;
  conceptNameEn: string;
  chapterTitleEn: string;
  subjectName: string;
  affectedSchoolsCount: number;
  affectedStudentsCount: number;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  resolutionRate: number;
}

export interface SchoolComparisonRow {
  schoolId: string;
  schoolName: string;
  schoolCode: string;
  board: string;
  city: string;
  teachersCount: number;
  studentsCount: number;
  classesCount: number;
  assessmentsCount: number;
  averageMastery: number | null;
  insufficientData: boolean;
  openGapsCount: number;
  resourceUsageCount: number;
}

export const reportingService = {
  /**
   * Helper: Resolves the list of school IDs within a given administrative scope.
   */
  async getSchoolIdsForScope(
    scopeType: InstitutionalScope,
    scopeId: string,
    client: SupabaseClient = defaultClient
  ): Promise<string[]> {
    if (scopeType === 'SCHOOL') {
      return [scopeId];
    }

    let query = client.from('schools').select('id').eq('is_active', true);

    if (scopeType === 'STATE') {
      query = query.eq('state_id', scopeId);
    } else if (scopeType === 'DISTRICT') {
      query = query.eq('district_id', scopeId);
    } else if (scopeType === 'ORGANIZATION') {
      query = query.eq('organization_id', scopeId);
    }

    const { data, error } = await query;
    if (error) throw new Error(`Failed to resolve schools for scope: ${error.message}`);
    return (data || []).map((s: { id: string }) => s.id);
  },

  /**
   * Helper: Resolves human-readable scope name.
   */
  async getScopeName(
    scopeType: InstitutionalScope,
    scopeId: string,
    client: SupabaseClient = defaultClient
  ): Promise<string> {
    if (scopeType === 'STATE') {
      const { data } = await client.from('states').select('name').eq('id', scopeId).maybeSingle();
      return data?.name || 'State';
    }
    if (scopeType === 'DISTRICT') {
      const { data } = await client.from('districts').select('name').eq('id', scopeId).maybeSingle();
      return data?.name || 'District';
    }
    if (scopeType === 'ORGANIZATION') {
      const { data } = await client.from('organizations').select('name').eq('id', scopeId).maybeSingle();
      return data?.name || 'Organization';
    }
    if (scopeType === 'SCHOOL') {
      const { data } = await client.from('schools').select('name').eq('id', scopeId).maybeSingle();
      return data?.name || 'School';
    }
    return 'Institutional Scope';
  },

  /**
   * Overview summary for any scope (State, District, Organization, or School).
   */
  async getScopeOverview(
    scopeType: InstitutionalScope,
    scopeId: string,
    client: SupabaseClient = defaultClient
  ): Promise<ScopeOverviewSummary> {
    const [schoolIds, scopeName] = await Promise.all([
      this.getSchoolIdsForScope(scopeType, scopeId, client),
      this.getScopeName(scopeType, scopeId, client),
    ]);

    const totalSchools = schoolIds.length;

    if (totalSchools === 0) {
      return {
        scopeType,
        scopeId,
        scopeName,
        totalSchools: 0,
        activeSchools: 0,
        totalTeachers: 0,
        activeTeachers: 0,
        totalStudents: 0,
        activeStudents: 0,
        totalClasses: 0,
        totalAssessments: 0,
        averageMasteryScore: null,
        insufficientData: true,
        totalOpenGaps: 0,
        resolvedGapsCount: 0,
        gapResolutionRate: 0,
        resourceUsageCount: 0,
        adoptionRate: 0,
      };
    }

    // Parallel aggregate queries across resolved schools
    const [
      teachersRes,
      studentsRes,
      classesRes,
      assessmentsRes,
      masteryRes,
      openGapsRes,
      resolvedGapsRes,
      resourceUsageRes,
    ] = await Promise.all([
      client.from('profiles').select('id, school_id').in('school_id', schoolIds).eq('role', 'TEACHER'),
      client.from('profiles').select('id, school_id').in('school_id', schoolIds).eq('role', 'STUDENT'),
      client.from('classes').select('id, school_id').in('school_id', schoolIds).eq('is_active', true),
      client.from('assessments').select('id, school_id').in('school_id', schoolIds),
      client.from('student_concept_mastery').select('mastery_score, student_id').in('school_id', schoolIds),
      client.from('learning_gaps').select('id, school_id').in('school_id', schoolIds).in('status', ['OPEN', 'IN_REMEDIATION', 'IMPROVING']),
      client.from('learning_gaps').select('id, school_id').in('school_id', schoolIds).eq('status', 'RESOLVED'),
      client.from('resource_usage').select('id', { count: 'exact', head: true }).in('school_id', schoolIds),
    ]);

    const teachers = teachersRes.data || [];
    const students = studentsRes.data || [];
    const classes = classesRes.data || [];
    const assessments = assessmentsRes.data || [];
    const masteryRows = masteryRes.data || [];
    const openGaps = openGapsRes.data || [];
    const resolvedGaps = resolvedGapsRes.data || [];

    // Distinct schools with at least one teacher and one class
    const schoolsWithActivity = new Set([
      ...teachers.map((t: { school_id: string }) => t.school_id),
      ...assessments.map((a: { school_id: string }) => a.school_id),
    ]);
    const activeSchools = schoolsWithActivity.size;

    // Minimum sample protection for academic metrics
    const evaluatedStudentsCount = new Set(masteryRows.map((m: { student_id: string }) => m.student_id)).size;
    const insufficientData = evaluatedStudentsCount < MINIMUM_COHORT_THRESHOLD;

    let averageMasteryScore: number | null = null;
    if (!insufficientData && masteryRows.length > 0) {
      const sum = masteryRows.reduce((acc: number, r: { mastery_score: number }) => acc + (Number(r.mastery_score) || 0), 0);
      averageMasteryScore = Math.round((sum / masteryRows.length) * 10) / 10;
    }

    const totalGapsCount = openGaps.length + resolvedGaps.length;
    const gapResolutionRate = totalGapsCount > 0
      ? Math.round((resolvedGaps.length / totalGapsCount) * 100)
      : 0;

    const adoptionRate = totalSchools > 0
      ? Math.round((activeSchools / totalSchools) * 100)
      : 0;

    return {
      scopeType,
      scopeId,
      scopeName,
      totalSchools,
      activeSchools,
      totalTeachers: teachers.length,
      activeTeachers: teachers.length,
      totalStudents: students.length,
      activeStudents: students.length,
      totalClasses: classes.length,
      totalAssessments: assessments.length,
      averageMasteryScore,
      insufficientData,
      totalOpenGaps: openGaps.length,
      resolvedGapsCount: resolvedGaps.length,
      gapResolutionRate,
      resourceUsageCount: resourceUsageRes.count || 0,
      adoptionRate,
    };
  },

  /**
   * Academic metrics: Aggregates concept-level mastery across schools in scope,
   * enforcing the N >= 10 minimum sample privacy boundary.
   */
  async getAcademicMetrics(
    scopeType: InstitutionalScope,
    scopeId: string,
    client: SupabaseClient = defaultClient
  ): Promise<{ concepts: ConceptAcademicSummary[]; overallMastery: number | null; insufficientData: boolean }> {
    const schoolIds = await this.getSchoolIdsForScope(scopeType, scopeId, client);
    if (schoolIds.length === 0) {
      return { concepts: [], overallMastery: null, insufficientData: true };
    }

    const { data: masteryData, error } = await client
      .from('student_concept_mastery')
      .select('concept_id, mastery_score, student_id, concept:concepts(name_en, name_hi, chapter:chapters(title_en, subject:subjects(name)))')
      .in('school_id', schoolIds);

    if (error) throw new Error(`Failed to aggregate academic mastery: ${error.message}`);

    const rawRows = masteryData || [];
    const distinctStudents = new Set(rawRows.map((r: { student_id: string }) => r.student_id)).size;
    const globalInsufficient = distinctStudents < MINIMUM_COHORT_THRESHOLD;

    // Group by concept_id
    const conceptMap: Record<
      string,
      {
        conceptId: string;
        conceptNameEn: string;
        conceptNameHi?: string;
        chapterTitleEn: string;
        subjectName: string;
        scores: number[];
        studentIds: Set<string>;
      }
    > = {};

    for (const row of rawRows) {
      const cid = row.concept_id;
      if (!conceptMap[cid]) {
        const c = row.concept as {
          name_en?: string;
          name_hi?: string;
          chapter?: { title_en?: string; subject?: { name?: string } };
        };
        conceptMap[cid] = {
          conceptId: cid,
          conceptNameEn: c?.name_en || 'Unknown Concept',
          conceptNameHi: c?.name_hi || undefined,
          chapterTitleEn: c?.chapter?.title_en || 'NCERT Chapter',
          subjectName: c?.chapter?.subject?.name || 'General',
          scores: [],
          studentIds: new Set(),
        };
      }
      conceptMap[cid].scores.push(Number(row.mastery_score) || 0);
      conceptMap[cid].studentIds.add(row.student_id);
    }

    const concepts: ConceptAcademicSummary[] = Object.values(conceptMap).map((item) => {
      const cohortCount = item.studentIds.size;
      const isInsuff = cohortCount < MINIMUM_COHORT_THRESHOLD;

      if (isInsuff) {
        return {
          conceptId: item.conceptId,
          conceptNameEn: item.conceptNameEn,
          conceptNameHi: item.conceptNameHi,
          chapterTitleEn: item.chapterTitleEn,
          subjectName: item.subjectName,
          averageMastery: null,
          studentsEvaluatedCount: cohortCount,
          insufficientData: true,
          masteryStatus: 'INSUFFICIENT_DATA',
          studentsNeedingSupportCount: 0,
        };
      }

      const avg = Math.round((item.scores.reduce((a, b) => a + b, 0) / item.scores.length) * 10) / 10;
      const struggling = item.scores.filter((s) => s < 60).length;

      let status: 'NEEDS_SUPPORT' | 'DEVELOPING' | 'MASTERED' = 'DEVELOPING';
      if (avg >= 75) status = 'MASTERED';
      else if (avg < 60) status = 'NEEDS_SUPPORT';

      return {
        conceptId: item.conceptId,
        conceptNameEn: item.conceptNameEn,
        conceptNameHi: item.conceptNameHi,
        chapterTitleEn: item.chapterTitleEn,
        subjectName: item.subjectName,
        averageMastery: avg,
        studentsEvaluatedCount: cohortCount,
        insufficientData: false,
        masteryStatus: status,
        studentsNeedingSupportCount: struggling,
      };
    });

    let overallMastery: number | null = null;
    if (!globalInsufficient && rawRows.length > 0) {
      const sum = rawRows.reduce((a: number, b: { mastery_score: number }) => a + (Number(b.mastery_score) || 0), 0);
      overallMastery = Math.round((sum / rawRows.length) * 10) / 10;
    }

    return {
      concepts: concepts.sort((a, b) => (a.averageMastery ?? 999) - (b.averageMastery ?? 999)),
      overallMastery,
      insufficientData: globalInsufficient,
    };
  },

  /**
   * Aggregate learning gaps across schools in scope.
   */
  async getLearningGapSummary(
    scopeType: InstitutionalScope,
    scopeId: string,
    client: SupabaseClient = defaultClient
  ): Promise<LearningGapAggregateItem[]> {
    const schoolIds = await this.getSchoolIdsForScope(scopeType, scopeId, client);
    if (schoolIds.length === 0) return [];

    const { data: gapsData, error } = await client
      .from('learning_gaps')
      .select('concept_id, school_id, student_id, severity, status, concept:concepts(name_en, chapter:chapters(title_en, subject:subjects(name)))')
      .in('school_id', schoolIds);

    if (error) throw new Error(`Failed to aggregate learning gaps: ${error.message}`);

    const rawGaps = gapsData || [];
    const grouped: Record<
      string,
      {
        conceptId: string;
        conceptNameEn: string;
        chapterTitleEn: string;
        subjectName: string;
        schools: Set<string>;
        students: Set<string>;
        resolvedCount: number;
        totalCount: number;
        criticalCount: number;
      }
    > = {};

    for (const g of rawGaps) {
      const cid = g.concept_id;
      if (!grouped[cid]) {
        const c = g.concept as {
          name_en?: string;
          chapter?: { title_en?: string; subject?: { name?: string } };
        };
        grouped[cid] = {
          conceptId: cid,
          conceptNameEn: c?.name_en || 'Concept',
          chapterTitleEn: c?.chapter?.title_en || 'Chapter',
          subjectName: c?.chapter?.subject?.name || 'Subject',
          schools: new Set(),
          students: new Set(),
          resolvedCount: 0,
          totalCount: 0,
          criticalCount: 0,
        };
      }
      grouped[cid].schools.add(g.school_id);
      grouped[cid].students.add(g.student_id);
      grouped[cid].totalCount++;
      if (g.status === 'RESOLVED') grouped[cid].resolvedCount++;
      if (g.severity === 'CRITICAL') grouped[cid].criticalCount++;
    }

    return Object.values(grouped).map((item) => {
      let severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW' = 'MODERATE';
      if (item.criticalCount > 5) severity = 'CRITICAL';
      else if (item.students.size > 15) severity = 'HIGH';
      else if (item.students.size < 5) severity = 'LOW';

      const resRate = item.totalCount > 0
        ? Math.round((item.resolvedCount / item.totalCount) * 100)
        : 0;

      return {
        conceptId: item.conceptId,
        conceptNameEn: item.conceptNameEn,
        chapterTitleEn: item.chapterTitleEn,
        subjectName: item.subjectName,
        affectedSchoolsCount: item.schools.size,
        affectedStudentsCount: item.students.size,
        severity,
        resolutionRate: resRate,
      };
    });
  },

  /**
   * Multi-School Comparison Tool.
   * Compares 2 to 10 schools across key operational and academic dimensions.
   */
  async compareSchools(
    schoolIds: string[],
    client: SupabaseClient = defaultClient
  ): Promise<SchoolComparisonRow[]> {
    if (schoolIds.length === 0) return [];

    const { data: schoolsData, error } = await client
      .from('schools')
      .select('id, name, code, board, city')
      .in('id', schoolIds);

    if (error) throw new Error(`Failed to load schools for comparison: ${error.message}`);

    const schools = schoolsData || [];

    const rows: SchoolComparisonRow[] = await Promise.all(
      schools.map(async (s) => {
        const [teachersCount, studentsRes, classesCount, assessmentsCount, masteryRes, openGapsCount, resourceUsage] =
          await Promise.all([
            client.from('profiles').select('*', { count: 'exact', head: true }).eq('school_id', s.id).eq('role', 'TEACHER'),
            client.from('profiles').select('id').eq('school_id', s.id).eq('role', 'STUDENT'),
            client.from('classes').select('*', { count: 'exact', head: true }).eq('school_id', s.id).eq('is_active', true),
            client.from('assessments').select('*', { count: 'exact', head: true }).eq('school_id', s.id),
            client.from('student_concept_mastery').select('mastery_score, student_id').eq('school_id', s.id),
            client.from('learning_gaps').select('*', { count: 'exact', head: true }).eq('school_id', s.id).in('status', ['OPEN', 'IN_REMEDIATION']),
            client.from('resource_usage').select('*', { count: 'exact', head: true }).eq('school_id', s.id),
          ]);

        const masteryRows = masteryRes.data || [];
        const evaluatedStudents = new Set(masteryRows.map((m: { student_id: string }) => m.student_id)).size;
        const insufficient = evaluatedStudents < MINIMUM_COHORT_THRESHOLD;

        let avgMastery: number | null = null;
        if (!insufficient && masteryRows.length > 0) {
          const sum = masteryRows.reduce((acc: number, r: { mastery_score: number }) => acc + (Number(r.mastery_score) || 0), 0);
          avgMastery = Math.round((sum / masteryRows.length) * 10) / 10;
        }

        return {
          schoolId: s.id,
          schoolName: s.name,
          schoolCode: s.code || 'N/A',
          board: s.board,
          city: s.city,
          teachersCount: teachersCount.count || 0,
          studentsCount: (studentsRes.data || []).length,
          classesCount: classesCount.count || 0,
          assessmentsCount: assessmentsCount.count || 0,
          averageMastery: avgMastery,
          insufficientData: insufficient,
          openGapsCount: openGapsCount.count || 0,
          resourceUsageCount: resourceUsage.count || 0,
        };
      })
    );

    return rows;
  },
};
