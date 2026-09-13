import { SupabaseClient } from '@supabase/supabase-js';
import { supabase as defaultClient } from '@/lib/supabase/client';
import {
  InterventionItem,
  InterventionType,
  InterventionStatus,
  CreateInterventionInput,
  UpdateInterventionInput,
  AssignInterventionInput,
} from '@/lib/validations/analytics';
import { InterventionActivity } from '@/lib/ai/schemas';

export const interventionsRepository = {
  /**
   * Persists a newly generated or manually created intervention draft.
   */
  async createInterventionDraft(
    teacherId: string,
    schoolId: string | null,
    input: CreateInterventionInput,
    client: SupabaseClient = defaultClient
  ): Promise<InterventionItem> {
    const { data, error } = await client
      .from('interventions')
      .insert([
        {
          gap_id: input.gapId || null,
          teacher_id: teacherId,
          school_id: schoolId,
          concept_id: input.conceptId,
          chapter_id: input.chapterId || null,
          class_id: input.classId || null,
          student_id: input.studentId || null,
          title: input.title,
          type: input.type,
          resource_id: input.resourceId || null,
          content: input.content,
          status: 'DRAFT',
        },
      ])
      .select(`
        id,
        gap_id,
        teacher_id,
        school_id,
        concept_id,
        chapter_id,
        class_id,
        student_id,
        title,
        type,
        resource_id,
        content,
        status,
        assignment_id,
        reassessment_assessment_id,
        created_at,
        updated_at,
        concept:concepts(id, name_en, name_hi),
        chapter:chapters(id, title_en),
        class:classes(id, name, section),
        student:profiles(id, full_name)
      `)
      .single();

    if (error || !data) {
      throw new Error(`Failed to create intervention draft: ${error?.message}`);
    }

    return this.mapToItem(data);
  },

  /**
   * Fetches interventions created by a teacher, optionally filtered by class or status.
   */
  async getInterventionsByTeacher(
    teacherId: string,
    options: { classId?: string; status?: string } = {},
    client: SupabaseClient = defaultClient
  ): Promise<InterventionItem[]> {
    let query = client
      .from('interventions')
      .select(`
        id,
        gap_id,
        teacher_id,
        school_id,
        concept_id,
        chapter_id,
        class_id,
        student_id,
        title,
        type,
        resource_id,
        content,
        status,
        assignment_id,
        reassessment_assessment_id,
        created_at,
        updated_at,
        concept:concepts(id, name_en, name_hi),
        chapter:chapters(id, title_en),
        class:classes(id, name, section),
        student:profiles(id, full_name)
      `)
      .eq('teacher_id', teacherId);

    if (options.classId) {
      query = query.eq('class_id', options.classId);
    }
    if (options.status) {
      query = query.eq('status', options.status);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    if (error) {
      throw new Error(`Failed to fetch interventions: ${error.message}`);
    }

    return (data || []).map((row) => this.mapToItem(row));
  },

  /**
   * Fetches active assigned interventions for a student.
   */
  async getInterventionsByStudent(
    studentId: string,
    client: SupabaseClient = defaultClient
  ): Promise<InterventionItem[]> {
    // 1. Get class IDs student belongs to
    const { data: enrollments } = await client
      .from('class_students')
      .select('class_id')
      .eq('student_id', studentId)
      .eq('enrollment_status', 'ACTIVE');

    const classIds = (enrollments || []).map((e) => e.class_id);

    // 2. Query interventions directly assigned to student OR assigned to their active classes
    let query = client
      .from('interventions')
      .select(`
        id,
        gap_id,
        teacher_id,
        school_id,
        concept_id,
        chapter_id,
        class_id,
        student_id,
        title,
        type,
        resource_id,
        content,
        status,
        assignment_id,
        reassessment_assessment_id,
        created_at,
        updated_at,
        concept:concepts(id, name_en, name_hi),
        chapter:chapters(id, title_en),
        class:classes(id, name, section)
      `)
      .in('status', ['ASSIGNED', 'COMPLETED']);

    if (classIds.length > 0) {
      query = query.or(`student_id.eq.${studentId},class_id.in.(${classIds.join(',')})`);
    } else {
      query = query.eq('student_id', studentId);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    if (error) {
      throw new Error(`Failed to fetch student interventions: ${error.message}`);
    }

    return (data || []).map((row) => this.mapToItem(row));
  },

  /**
   * Fetches a single intervention by ID.
   */
  async getInterventionById(
    id: string,
    client: SupabaseClient = defaultClient
  ): Promise<InterventionItem | null> {
    const { data, error } = await client
      .from('interventions')
      .select(`
        id,
        gap_id,
        teacher_id,
        school_id,
        concept_id,
        chapter_id,
        class_id,
        student_id,
        title,
        type,
        resource_id,
        content,
        status,
        assignment_id,
        reassessment_assessment_id,
        created_at,
        updated_at,
        concept:concepts(id, name_en, name_hi),
        chapter:chapters(id, title_en),
        class:classes(id, name, section),
        student:profiles(id, full_name)
      `)
      .eq('id', id)
      .maybeSingle();

    if (error || !data) return null;
    return this.mapToItem(data);
  },

  /**
   * Updates intervention details (Teacher review and editing in DRAFT status).
   */
  async updateIntervention(
    id: string,
    teacherId: string,
    input: UpdateInterventionInput,
    client: SupabaseClient = defaultClient
  ): Promise<InterventionItem> {
    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (input.title) updates.title = input.title;
    if (input.content) updates.content = input.content;
    if (input.status) updates.status = input.status;

    const { data, error } = await client
      .from('interventions')
      .update(updates)
      .eq('id', id)
      .eq('teacher_id', teacherId)
      .select(`
        id,
        gap_id,
        teacher_id,
        school_id,
        concept_id,
        chapter_id,
        class_id,
        student_id,
        title,
        type,
        resource_id,
        content,
        status,
        assignment_id,
        reassessment_assessment_id,
        created_at,
        updated_at,
        concept:concepts(id, name_en, name_hi),
        chapter:chapters(id, title_en),
        class:classes(id, name, section),
        student:profiles(id, full_name)
      `)
      .single();

    if (error || !data) {
      throw new Error(`Failed to update intervention: ${error?.message}`);
    }

    return this.mapToItem(data);
  },

  /**
   * Approves an intervention draft.
   */
  async approveIntervention(
    id: string,
    teacherId: string,
    client: SupabaseClient = defaultClient
  ): Promise<InterventionItem> {
    return this.updateIntervention(id, teacherId, { status: 'APPROVED' }, client);
  },

  /**
   * Assigns an approved intervention to a class or student.
   * Automatically creates a practice check assessment and assignment to close the loop!
   */
  async assignIntervention(
    id: string,
    teacherId: string,
    params: AssignInterventionInput,
    client: SupabaseClient = defaultClient
  ): Promise<InterventionItem> {
    // 1. Fetch intervention
    const intervention = await this.getInterventionById(id, client);
    if (!intervention) {
      throw new Error(`Intervention not found: ${id}`);
    }
    if (intervention.teacherId !== teacherId) {
      throw new Error('Unauthorized to assign this intervention');
    }

    const content = intervention.content as unknown as InterventionActivity;
    const practiceQuestions = content.practice_questions || [];

    // 2. Fetch class and subject/grade context
    const { data: classRecord } = await client
      .from('classes')
      .select('id, name, grade_id')
      .eq('id', params.classId)
      .single();

    const gradeId = classRecord?.grade_id || 'class-10';

    // 3. Create a formal reassessment assessment from the practice check questions
    const assessmentTitle = `Reassessment Check: ${intervention.title}`;
    const { data: assessment, error: asstError } = await client
      .from('assessments')
      .insert([
        {
          title: assessmentTitle,
          grade_id: gradeId,
          subject_id: 'science',
          chapter_id: intervention.chapterId || null,
          concept_id: intervention.conceptId,
          type: 'PRACTICE',
          duration_minutes: params.timeLimitMinutes || 15,
          total_marks: practiceQuestions.length || 5,
          passing_percentage: 60,
          is_published: true,
          created_by: teacherId,
          school_id: intervention.schoolId,
        },
      ])
      .select('id')
      .single();

    if (asstError || !assessment) {
      throw new Error(`Failed to create reassessment assessment: ${asstError?.message}`);
    }

    // 4. Create assessment_questions with JSONB snapshot
    if (practiceQuestions.length > 0) {
      const questionInserts = practiceQuestions.map((pq, idx) => ({
        assessment_id: assessment.id,
        question_id: null,
        order_index: idx + 1,
        marks: 1,
        question_snapshot: {
          id: `pq_${idx + 1}`,
          question_text: pq.question_text,
          question_type: 'MCQ',
          options: pq.options,
          correct_answer: pq.correct_answer,
          explanation: pq.explanation,
          marks: 1,
          concept_id: intervention.conceptId,
        },
      }));

      await client.from('assessment_questions').insert(questionInserts);
    }

    // 5. Create an assignment for the class
    const dueDate = params.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data: assignment, error: assignError } = await client
      .from('assignments')
      .insert([
        {
          assessment_id: assessment.id,
          class_id: params.classId,
          created_by: teacherId,
          due_date: dueDate,
          status: 'PUBLISHED',
        },
      ])
      .select('id')
      .single();

    if (assignError || !assignment) {
      throw new Error(`Failed to create reassessment assignment: ${assignError?.message}`);
    }

    // 6. Update intervention status to ASSIGNED and link IDs
    const { data: updated, error: updError } = await client
      .from('interventions')
      .update({
        class_id: params.classId,
        student_id: params.studentId || null,
        status: 'ASSIGNED',
        assignment_id: assignment.id,
        reassessment_assessment_id: assessment.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select(`
        id,
        gap_id,
        teacher_id,
        school_id,
        concept_id,
        chapter_id,
        class_id,
        student_id,
        title,
        type,
        resource_id,
        content,
        status,
        assignment_id,
        reassessment_assessment_id,
        created_at,
        updated_at,
        concept:concepts(id, name_en, name_hi),
        chapter:chapters(id, title_en),
        class:classes(id, name, section),
        student:profiles(id, full_name)
      `)
      .single();

    if (updError || !updated) {
      throw new Error(`Failed to finalize intervention assignment: ${updError?.message}`);
    }

    // 7. Update linked learning gap status to IN_REMEDIATION if gap_id exists
    if (intervention.gapId) {
      await client
        .from('learning_gaps')
        .update({
          status: 'IN_REMEDIATION',
          updated_at: new Date().toISOString(),
        })
        .eq('id', intervention.gapId);
    }

    return this.mapToItem(updated);
  },

  mapToItem(row: Record<string, unknown>): InterventionItem {
    const c = Array.isArray(row.concept) ? row.concept[0] : row.concept;
    const ch = Array.isArray(row.chapter) ? row.chapter[0] : row.chapter;
    const cl = Array.isArray(row.class) ? row.class[0] : row.class;
    const st = Array.isArray(row.student) ? row.student[0] : row.student;

    return {
      id: row.id as string,
      gapId: (row.gap_id as string) || null,
      teacherId: row.teacher_id as string,
      schoolId: (row.school_id as string) || null,
      conceptId: row.concept_id as string,
      conceptNameEn: c?.name_en || undefined,
      chapterId: (row.chapter_id as string) || null,
      chapterTitleEn: ch?.title_en || undefined,
      classId: (row.class_id as string) || null,
      className: cl?.name ? `${cl.name} (${cl.section || ''})` : undefined,
      studentId: (row.student_id as string) || null,
      studentName: st?.full_name || undefined,
      title: row.title as string,
      type: row.type as InterventionType,
      resourceId: (row.resource_id as string) || null,
      content: (row.content as Record<string, unknown>) || {},
      status: row.status as InterventionStatus,
      assignmentId: (row.assignment_id as string) || null,
      reassessmentAssessmentId: (row.reassessment_assessment_id as string) || null,
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    };
  },
};
