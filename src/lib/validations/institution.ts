import { z } from 'zod';

/**
 * Constant: Minimum cohort size required to display aggregate academic metrics.
 * Protects individual student privacy in small cohorts (< 10 students).
 */
export const MINIMUM_COHORT_THRESHOLD = 10;

// =============================================================================
// ENUM SCHEMAS
// =============================================================================

export const InstitutionalScopeSchema = z.enum([
  'STATE',
  'DISTRICT',
  'ORGANIZATION',
  'SCHOOL',
]);
export type InstitutionalScope = z.infer<typeof InstitutionalScopeSchema>;

export const OrganizationTypeSchema = z.enum([
  'GOVERNMENT',
  'PRIVATE_NETWORK',
  'TRUST',
  'CHARTER',
]);
export type OrganizationType = z.infer<typeof OrganizationTypeSchema>;

export const InstitutionUserRoleSchema = z.enum([
  'SUPER_ADMIN',
  'STATE_ADMIN',
  'DISTRICT_ADMIN',
  'ORG_ADMIN',
  'SCHOOL_ADMIN',
  'TEACHER',
  'STUDENT',
]);
export type InstitutionUserRole = z.infer<typeof InstitutionUserRoleSchema>;

export const InvitationStatusSchema = z.enum([
  'CREATED',
  'SENT',
  'ACCEPTED',
  'EXPIRED',
  'REVOKED',
]);
export type InvitationStatus = z.infer<typeof InvitationStatusSchema>;

export const SchoolBoardSchema = z.enum([
  'CBSE',
  'KVS',
  'JNV',
  'STATE_BOARD',
  'ICSE',
  'OTHER',
]);
export type SchoolBoard = z.infer<typeof SchoolBoardSchema>;

// =============================================================================
// STATE SCHEMAS
// =============================================================================

export const CreateStateSchema = z.object({
  code: z.string().min(2).max(10).toUpperCase(),
  name: z.string().min(2).max(100),
  region: z.string().default('NORTH'),
  is_active: z.boolean().default(true),
});
export type CreateStateInput = z.infer<typeof CreateStateSchema>;

export const StateRecordSchema = CreateStateSchema.extend({
  id: z.string().uuid(),
  created_at: z.string(),
  updated_at: z.string(),
});
export type StateRecord = z.infer<typeof StateRecordSchema>;

// =============================================================================
// DISTRICT SCHEMAS
// =============================================================================

export const CreateDistrictSchema = z.object({
  state_id: z.string().uuid(),
  code: z.string().min(2).max(30).toUpperCase(),
  name: z.string().min(2).max(100),
  is_active: z.boolean().default(true),
});
export type CreateDistrictInput = z.infer<typeof CreateDistrictSchema>;

export const DistrictRecordSchema = CreateDistrictSchema.extend({
  id: z.string().uuid(),
  created_at: z.string(),
  updated_at: z.string(),
  state_name: z.string().optional(),
});
export type DistrictRecord = z.infer<typeof DistrictRecordSchema>;

// =============================================================================
// ORGANIZATION SCHEMAS
// =============================================================================

export const CreateOrganizationSchema = z.object({
  code: z.string().min(2).max(50).toUpperCase(),
  name: z.string().min(2).max(255),
  type: OrganizationTypeSchema.default('GOVERNMENT'),
  website: z.string().url().optional().or(z.literal('')),
  contact_email: z.string().email(),
  contact_phone: z.string().optional().or(z.literal('')),
  is_active: z.boolean().default(true),
});
export type CreateOrganizationInput = z.infer<typeof CreateOrganizationSchema>;

export const OrganizationRecordSchema = CreateOrganizationSchema.extend({
  id: z.string().uuid(),
  created_at: z.string(),
  updated_at: z.string(),
  school_count: z.number().optional(),
});
export type OrganizationRecord = z.infer<typeof OrganizationRecordSchema>;

// =============================================================================
// INSTITUTIONAL SETTINGS SCHEMA
// =============================================================================

export const InstitutionalSettingsValuesSchema = z.object({
  default_language: z.enum(['en', 'hi', 'bilingual']).default('en'),
  enabled_features: z.array(z.string()).default([
    'ai_generation',
    'smartboard',
    'assessments',
    'remediation',
    'analytics',
  ]),
  ai_availability: z.enum(['UNRESTRICTED', 'QUOTA_LIMITED', 'DISABLED']).default('UNRESTRICTED'),
  minimum_passing_percentage: z.number().min(1).max(100).default(40),
  mastery_threshold_percentage: z.number().min(1).max(100).default(75),
  minimum_cohort_size: z.number().min(1).max(100).default(MINIMUM_COHORT_THRESHOLD),
  allow_cross_school_resources: z.boolean().default(false),
  curriculum_standards: z.array(z.string()).default(['NCERT_2024']),
});
export type InstitutionalSettingsValues = z.infer<typeof InstitutionalSettingsValuesSchema>;

export const UpsertInstitutionalSettingsSchema = z.object({
  scope_type: InstitutionalScopeSchema,
  scope_id: z.string().uuid(),
  settings: InstitutionalSettingsValuesSchema.partial(),
});
export type UpsertInstitutionalSettingsInput = z.infer<typeof UpsertInstitutionalSettingsSchema>;

// =============================================================================
// INSTITUTIONAL INVITATION SCHEMAS
// =============================================================================

export const CreateInvitationSchema = z.object({
  email: z.string().email(),
  role: InstitutionUserRoleSchema,
  target_type: InstitutionalScopeSchema,
  target_id: z.string().uuid(),
  expires_in_days: z.number().min(1).max(30).default(7),
});
export type CreateInvitationInput = z.infer<typeof CreateInvitationSchema>;

export const AcceptInvitationSchema = z.object({
  token: z.string().min(16),
  full_name: z.string().min(2).optional(),
});
export type AcceptInvitationInput = z.infer<typeof AcceptInvitationSchema>;

export const InstitutionalInvitationRecordSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: InstitutionUserRoleSchema,
  target_type: InstitutionalScopeSchema,
  target_id: z.string().uuid(),
  invited_by: z.string().uuid().nullable(),
  status: InvitationStatusSchema,
  expires_at: z.string(),
  accepted_at: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  target_name: z.string().optional(),
});
export type InstitutionalInvitationRecord = z.infer<typeof InstitutionalInvitationRecordSchema>;

// =============================================================================
// SCHOOL ONBOARDING & DIRECTORY SCHEMAS
// =============================================================================

export const SchoolOnboardingSchema = z.object({
  name: z.string().min(3).max(255),
  code: z.string().min(2).max(50).toUpperCase(),
  board: SchoolBoardSchema.default('CBSE'),
  state: z.string().min(2).max(100),
  city: z.string().min(2).max(100),
  address: z.string().optional().or(z.literal('')),
  postal_code: z.string().optional().or(z.literal('')),
  contact_email: z.string().email(),
  contact_phone: z.string().optional().or(z.literal('')),
  state_id: z.string().uuid().optional().nullable(),
  district_id: z.string().uuid().optional().nullable(),
  organization_id: z.string().uuid().optional().nullable(),
  subscription_tier: z.enum(['FREE', 'PRO_SCHOOL', 'ENTERPRISE']).default('FREE'),
  admin_email: z.string().email().optional(),
  admin_name: z.string().optional(),
});
export type SchoolOnboardingInput = z.infer<typeof SchoolOnboardingSchema>;

export const SchoolDirectoryQuerySchema = z.object({
  search: z.string().optional(),
  state_id: z.string().uuid().optional(),
  district_id: z.string().uuid().optional(),
  organization_id: z.string().uuid().optional(),
  board: SchoolBoardSchema.optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ALL']).default('ALL'),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  sort_by: z.enum(['name', 'created_at', 'students_count', 'teachers_count']).default('name'),
  sort_order: z.enum(['asc', 'desc']).default('asc'),
});
export type SchoolDirectoryQuery = z.infer<typeof SchoolDirectoryQuerySchema>;

// =============================================================================
// COMPARISON & REPORTING SCHEMAS
// =============================================================================

export const SchoolComparisonQuerySchema = z.object({
  school_ids: z.array(z.string().uuid()).min(2).max(10),
});
export type SchoolComparisonQuery = z.infer<typeof SchoolComparisonQuerySchema>;

export const ExportReportSchema = z.object({
  scope_type: InstitutionalScopeSchema,
  scope_id: z.string().uuid(),
  format: z.enum(['CSV', 'PDF', 'JSON']).default('CSV'),
  include_academic: z.boolean().default(true),
  include_adoption: z.boolean().default(true),
  period: z.enum(['WEEK', 'MONTH', 'TERM', 'YEAR']).default('MONTH'),
});
export type ExportReportInput = z.infer<typeof ExportReportSchema>;
