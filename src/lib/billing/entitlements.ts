import { SupabaseClient } from '@supabase/supabase-js';
import { supabase as defaultClient } from '../supabase/client';
import { billingRepository } from '../repositories/billing';
import type {
  PlanEntitlements,
  PlanFeatureFlags,
  SubscriptionRecord,
  SchoolUsageMetrics,
} from './types';

export interface SchoolEntitlementProfile {
  schoolId: string;
  planSlug: string;
  planName: string;
  subscriptionStatus: SubscriptionRecord['status'];
  billingInterval: 'MONTHLY' | 'YEARLY';
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  inGracePeriod: boolean;
  entitlements: PlanEntitlements;
  featureFlags: PlanFeatureFlags;
}

export interface QuotaCheckResult {
  allowed: boolean;
  metric: string;
  limit: number;
  currentUsage: number;
  remaining: number;
  message?: string;
}

export const entitlementEngine = {
  /**
   * Resolves the full entitlement profile for a school.
   */
  async getSchoolEntitlements(
    schoolId: string,
    client: SupabaseClient = defaultClient
  ): Promise<SchoolEntitlementProfile> {
    const subscription = await billingRepository.getSubscriptionBySchoolId(schoolId, client);
    const plan = subscription.plan;

    const entitlements: PlanEntitlements = plan?.entitlements || {
      TEACHER_LIMIT: 3,
      STUDENT_LIMIT: 60,
      CLASS_LIMIT: 2,
      AI_GENERATION_LIMIT: 100,
      AI_QUIZ_LIMIT: 50,
      AI_TEST_LIMIT: 10,
      AI_WORKSHEET_LIMIT: 30,
      AI_LESSON_PLAN_LIMIT: 20,
      SMARTBOARD_LIMIT: 1,
      CLASSROOM_SESSION_LIMIT: 20,
      STORAGE_LIMIT_MB: 500,
    };

    const featureFlags: PlanFeatureFlags = plan?.feature_flags || {
      AI_GENERATION: true,
      SMARTBOARD: true,
      ASSESSMENTS: true,
      ANALYTICS: false,
      EXPORTS: false,
      ADVANCED_REPORTS: false,
    };

    // Calculate Grace Period for PAST_DUE subscriptions (7-day window)
    const now = new Date();
    const periodEndDate = new Date(subscription.current_period_end);
    const gracePeriodEnd = new Date(periodEndDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    const inGracePeriod = subscription.status === 'PAST_DUE' && now <= gracePeriodEnd;

    return {
      schoolId,
      planSlug: plan?.slug || 'free',
      planName: plan?.name || 'Individual Educator / Starter School',
      subscriptionStatus: subscription.status,
      billingInterval: subscription.billing_interval,
      currentPeriodEnd: subscription.current_period_end,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      inGracePeriod,
      entitlements,
      featureFlags,
    };
  },

  /**
   * Authoritatively checks whether a school is allowed to use a given feature.
   */
  async canUseFeature(
    schoolId: string,
    featureKey: keyof PlanFeatureFlags,
    client: SupabaseClient = defaultClient
  ): Promise<boolean> {
    const profile = await this.getSchoolEntitlements(schoolId, client);

    // Expired or cancelled past period end: block premium features
    if (profile.subscriptionStatus === 'EXPIRED') {
      return false;
    }

    // Past-due subscriptions in grace period allow basic access but restrict heavy features
    if (profile.subscriptionStatus === 'PAST_DUE') {
      if (!profile.inGracePeriod) {
        return false;
      }
      // During grace period, only basic access is allowed; AI generation and exports are paused
      if (featureKey === 'AI_GENERATION' || featureKey === 'EXPORTS' || featureKey === 'ADVANCED_REPORTS') {
        return false;
      }
    }

    return profile.featureFlags[featureKey] === true;
  },

  /**
   * Evaluates current metric usage against entitlement limits.
   */
  async getRemainingQuota(
    schoolId: string,
    metricKey: keyof PlanEntitlements,
    client: SupabaseClient = defaultClient
  ): Promise<QuotaCheckResult> {
    const [profile, usage] = await Promise.all([
      this.getSchoolEntitlements(schoolId, client),
      billingRepository.getSchoolUsageMetrics(schoolId, client),
    ]);

    const limit = profile.entitlements[metricKey] ?? 0;
    let currentUsage = 0;

    switch (metricKey) {
      case 'TEACHER_LIMIT':
        currentUsage = usage.teachers;
        break;
      case 'STUDENT_LIMIT':
        currentUsage = usage.students;
        break;
      case 'CLASS_LIMIT':
        currentUsage = usage.classes;
        break;
      case 'SMARTBOARD_LIMIT':
        currentUsage = usage.smartboards;
        break;
      case 'AI_GENERATION_LIMIT':
        currentUsage = usage.aiGenerations;
        break;
      case 'STORAGE_LIMIT_MB':
        currentUsage = usage.storageMb;
        break;
      default:
        currentUsage = 0;
    }

    // Handle Past-Due / Expired state
    if (profile.subscriptionStatus === 'EXPIRED' || (profile.subscriptionStatus === 'PAST_DUE' && !profile.inGracePeriod)) {
      return {
        allowed: false,
        metric: String(metricKey),
        limit,
        currentUsage,
        remaining: 0,
        message: 'Subscription is past due or expired. Please update billing to proceed.',
      };
    }

    const remaining = Math.max(0, limit - currentUsage);
    const allowed = currentUsage < limit;

    return {
      allowed,
      metric: String(metricKey),
      limit,
      currentUsage,
      remaining,
      message: allowed ? undefined : `Quota exceeded for ${String(metricKey)} (${currentUsage}/${limit})`,
    };
  },

  /**
   * Atomic limit check for seat or resource allocation.
   */
  async checkLimit(
    schoolId: string,
    metricKey: keyof PlanEntitlements,
    client: SupabaseClient = defaultClient
  ): Promise<{ allowed: boolean; limit: number; currentUsage: number }> {
    const quota = await this.getRemainingQuota(schoolId, metricKey, client);
    return {
      allowed: quota.allowed,
      limit: quota.limit,
      currentUsage: quota.currentUsage,
    };
  },

  /**
   * Fetch school usage metrics.
   */
  async getSchoolUsage(
    schoolId: string,
    client: SupabaseClient = defaultClient
  ): Promise<SchoolUsageMetrics> {
    return billingRepository.getSchoolUsageMetrics(schoolId, client);
  },
};
