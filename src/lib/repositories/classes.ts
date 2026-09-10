import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase as defaultClient } from '../supabase/client';
import { ClassCreateSchema, ClassUpdateSchema, StudentEnrollmentSchema } from '../validations';

export interface ClassRecord {
  id: string;
  school_id: string;
  teacher_id: string | null;
  grade_id: string;
  name: string;
  section: string;
  academic_year: string;
  status: 'ACTIVE' | 'ARCHIVED';
  created_at: string;
  updated_at: string;
}

export interface ClassStudentRecord {
  id: string;
  class_id: string;
  student_id: string;
  roll_number: string | null;
  enrollment_status: 'ACTIVE' | 'TRANSFERRED' | 'DROPPED';
  created_at: string;
  student?: {
    id: string;
    full_name: string;
    email: string;
  };
}

export const classesRepository = {
  async getClassesBySchool(schoolId: string, client: SupabaseClient = defaultClient): Promise<ClassRecord[]> {
    const { data, error } = await client
      .from('classes')
      .select('*')
      .eq('school_id', schoolId)
      .eq('status', 'ACTIVE')
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch classes: ${error.message}`);
    }

    return (data || []) as ClassRecord[];
  },

  async getClassesByTeacher(teacherId: string, client: SupabaseClient = defaultClient): Promise<ClassRecord[]> {
    const { data, error } = await client
      .from('classes')
      .select('*')
      .eq('teacher_id', teacherId)
      .eq('status', 'ACTIVE')
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch teacher classes: ${error.message}`);
    }

    return (data || []) as ClassRecord[];
  },

  async getClassById(id: string, client: SupabaseClient = defaultClient): Promise<ClassRecord | null> {
    const { data, error } = await client
      .from('classes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Failed to fetch class: ${error.message}`);
    }

    return data as ClassRecord;
  },

  async createClass(classData: unknown, client: SupabaseClient = defaultClient): Promise<ClassRecord> {
    const validated = ClassCreateSchema.parse(classData);

    const { data, error } = await client
      .from('classes')
      .insert([validated])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create class: ${error.message}`);
    }

    return data as ClassRecord;
  },

  async updateClass(id: string, updates: unknown, client: SupabaseClient = defaultClient): Promise<ClassRecord> {
    const validated = ClassUpdateSchema.parse(updates);

    const { data, error } = await client
      .from('classes')
      .update({
        ...validated,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update class: ${error.message}`);
    }

    return data as ClassRecord;
  },

  async enrollStudent(enrollmentData: unknown, client: SupabaseClient = defaultClient): Promise<ClassStudentRecord> {
    const validated = StudentEnrollmentSchema.parse(enrollmentData);

    const { data, error } = await client
      .from('class_students')
      .insert([validated])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to enroll student: ${error.message}`);
    }

    return data as ClassStudentRecord;
  },

  async getClassStudents(classId: string, client: SupabaseClient = defaultClient): Promise<ClassStudentRecord[]> {
    const { data, error } = await client
      .from('class_students')
      .select('*, student:profiles!student_id(id, full_name, email)')
      .eq('class_id', classId)
      .eq('enrollment_status', 'ACTIVE')
      .order('roll_number', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch class students: ${error.message}`);
    }

    return (data || []) as unknown as ClassStudentRecord[];
  }
};
