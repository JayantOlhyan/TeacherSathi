import { SupabaseClient } from '@supabase/supabase-js';
import { supabase as defaultClient } from '../supabase/client';
import type {
  PlanRecord,
  SubscriptionRecord,
  SubscriptionEventRecord,
  PaymentRecord,
  SchoolUsageMetrics,
  SuperAdminBillingOverview,
  SubscriptionStatusType,
} from '../billing/types';

export const billingRepository = {
  /**
   * List all active plans ordered by display_order.
   */
  async getPlans(client: SupabaseClient = defaultClient): Promise<PlanRecord[]> {
    const { data, error } = await client
      .from('plans')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch plans: ${error.message}`);
    }

    return (data || []) as PlanRecord[];
  },

  /**
   * Get a plan by its unique slug.
   */
  async getPlanBySlug(slug: string, client: SupabaseClient = defaultClient): Promise<PlanRecord | null> {
    const { data, error } = await client
      .from('plans')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch plan by slug: ${error.message}`);
    }

    return data as PlanRecord | null;
  },

  /**
   * Get a plan by its UUID.
   */
  async getPlanById(id: string, client: SupabaseClient = defaultClient): Promise<PlanRecord | null> {
    const { data, error } = await client
      .from('plans')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch plan by id: ${error.message}`);
    }

    return data as PlanRecord | null;
  },

  /**
   * Get active subscription for a school.
   * If no explicit row exists in DB, returns a synthesized FREE tier record.
   */
  async getSubscriptionBySchoolId(
    schoolId: string,
    client: SupabaseClient = defaultClient
  ): Promise<SubscriptionRecord> {
    const { data, error } = await client
      .from('subscriptions')
      .select('*, plan:plans(*)')
      .eq('school_id', schoolId)
      .maybeSingle();

    if (!error && data) {
      const rec = data as unknown as SubscriptionRecord & { plan: PlanRecord };
      return {
        ...rec,
        plan: rec.plan,
      };
    }

    // Fallback: Fetch the default FREE plan from database or construct default
    const freePlan = await this.getPlanBySlug('free', client).catch(() => null);

    const defaultFreePlan: PlanRecord = freePlan || {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Individual Educator / Starter School',
      slug: 'free',
      description: '100% Free forever starter deployment',
      billing_interval: 'MONTHLY',
      price: 0,
      currency: 'INR',
      is_active: true,
      display_order: 1,
      entitlements: {
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
      },
      feature_flags: {
        AI_GENERATION: true,
        SMARTBOARD: true,
        ASSESSMENTS: true,
        ANALYTICS: false,
        EXPORTS: false,
        ADVANCED_REPORTS: false,
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const now = new Date();
    const periodEnd = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);

    return {
      id: `sub_free_${schoolId}`,
      school_id: schoolId,
      plan_id: defaultFreePlan.id,
      provider: 'MOCK',
      provider_subscription_id: null,
      provider_customer_id: null,
      status: 'ACTIVE',
      billing_interval: 'MONTHLY',
      current_period_start: now.toISOString(),
      current_period_end: periodEnd.toISOString(),
      cancel_at_period_end: false,
      cancelled_at: null,
      trial_start: null,
      trial_end: null,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
      plan: defaultFreePlan,
    };
  },

  /**
   * Create or activate a subscription for a school.
   */
  async createSubscription(
    subData: {
      school_id: string;
      plan_id: string;
      provider?: string;
      provider_subscription_id?: string | null;
      provider_customer_id?: string | null;
      status?: SubscriptionStatusType;
      billing_interval?: 'MONTHLY' | 'YEARLY';
      current_period_start?: string;
      current_period_end?: string;
    },
    client: SupabaseClient = defaultClient
  ): Promise<SubscriptionRecord> {
    const now = new Date();
    const currentStart = subData.current_period_start || now.toISOString();
    const currentEnd =
      subData.current_period_end ||
      new Date(now.getTime() + (subData.billing_interval === 'YEARLY' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString();

    const payload = {
      school_id: subData.school_id,
      plan_id: subData.plan_id,
      provider: subData.provider || 'RAZORPAY',
      provider_subscription_id: subData.provider_subscription_id || null,
      provider_customer_id: subData.provider_customer_id || null,
      status: subData.status || 'ACTIVE',
      billing_interval: subData.billing_interval || 'YEARLY',
      current_period_start: currentStart,
      current_period_end: currentEnd,
      updated_at: now.toISOString(),
    };

    const { data, error } = await client
      .from('subscriptions')
      .upsert(payload, { onConflict: 'school_id' })
      .select('*, plan:plans(*)')
      .single();

    if (error) {
      throw new Error(`Failed to create/upsert subscription: ${error.message}`);
    }

    const createdSub = data as unknown as SubscriptionRecord;

    // Record lifecycle event
    await this.recordSubscriptionEvent(
      {
        subscription_id: createdSub.id,
        school_id: subData.school_id,
        event_type: 'SUBSCRIPTION_ACTIVATED',
        from_status: null,
        to_status: createdSub.status,
        metadata: {
          plan_id: subData.plan_id,
          provider: payload.provider,
        },
      },
      client
    ).catch(() => {});

    return createdSub;
  },

  /**
   * Update subscription status or schedule cancellation/downgrades.
   */
  async updateSubscription(
    schoolId: string,
    updates: Partial<SubscriptionRecord>,
    eventType: string = 'PLAN_CHANGED',
    client: SupabaseClient = defaultClient
  ): Promise<SubscriptionRecord> {
    const existing = await this.getSubscriptionBySchoolId(schoolId, client);

    const { data, error } = await client
      .from('subscriptions')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('school_id', schoolId)
      .select('*, plan:plans(*)')
      .single();

    if (error) {
      throw new Error(`Failed to update subscription: ${error.message}`);
    }

    const updated = data as unknown as SubscriptionRecord;

    await this.recordSubscriptionEvent(
      {
        subscription_id: updated.id,
        school_id: schoolId,
        event_type: eventType,
        from_status: existing.status,
        to_status: updated.status,
        metadata: { updates },
      },
      client
    ).catch(() => {});

    return updated;
  },

  /**
   * Record an immutable subscription event.
   */
  async recordSubscriptionEvent(
    eventData: {
      subscription_id: string;
      school_id: string;
      event_type: string;
      from_status?: string | null;
      to_status?: string | null;
      metadata?: Record<string, unknown>;
    },
    client: SupabaseClient = defaultClient
  ): Promise<SubscriptionEventRecord> {
    const { data, error } = await client
      .from('subscription_events')
      .insert([
        {
          subscription_id: eventData.subscription_id,
          school_id: eventData.school_id,
          event_type: eventData.event_type,
          from_status: eventData.from_status || null,
          to_status: eventData.to_status || null,
          metadata: eventData.metadata || {},
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to record subscription event: ${error.message}`);
    }

    return data as SubscriptionEventRecord;
  },

  /**
   * Create a payment record.
   */
  async createPaymentRecord(
    paymentData: {
      school_id: string;
      subscription_id?: string | null;
      provider?: string;
      provider_payment_id?: string | null;
      provider_order_id?: string | null;
      amount: number;
      currency?: string;
      status?: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
      receipt_url?: string | null;
      metadata?: Record<string, unknown>;
    },
    client: SupabaseClient = defaultClient
  ): Promise<PaymentRecord> {
    const { data, error } = await client
      .from('payment_records')
      .insert([
        {
          school_id: paymentData.school_id,
          subscription_id: paymentData.subscription_id || null,
          provider: paymentData.provider || 'RAZORPAY',
          provider_payment_id: paymentData.provider_payment_id || null,
          provider_order_id: paymentData.provider_order_id || null,
          amount: paymentData.amount,
          currency: paymentData.currency || 'INR',
          status: paymentData.status || 'PENDING',
          receipt_url: paymentData.receipt_url || null,
          metadata: paymentData.metadata || {},
          paid_at: paymentData.status === 'SUCCESS' ? new Date().toISOString() : null,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create payment record: ${error.message}`);
    }

    return data as PaymentRecord;
  },

  /**
   * Update payment record status.
   */
  async updatePaymentRecord(
    id: string,
    updates: Partial<PaymentRecord>,
    client: SupabaseClient = defaultClient
  ): Promise<PaymentRecord> {
    const { data, error } = await client
      .from('payment_records')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update payment record: ${error.message}`);
    }

    return data as PaymentRecord;
  },

  /**
   * List payment records for a school.
   */
  async listPaymentsBySchool(
    schoolId: string,
    client: SupabaseClient = defaultClient
  ): Promise<PaymentRecord[]> {
    const { data, error } = await client
      .from('payment_records')
      .select('*')
      .eq('school_id', schoolId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to list school payment records: ${error.message}`);
    }

    return (data || []) as PaymentRecord[];
  },

  /**
   * Check if a webhook event ID was already processed.
   */
  async isWebhookProcessed(eventId: string, client: SupabaseClient = defaultClient): Promise<boolean> {
    const { data, error } = await client
      .from('processed_webhook_events')
      .select('id')
      .eq('id', eventId)
      .maybeSingle();

    if (error || !data) return false;
    return true;
  },

  /**
   * Mark a webhook event as processed.
   */
  async markWebhookProcessed(
    eventId: string,
    provider: string,
    eventType: string,
    client: SupabaseClient = defaultClient
  ): Promise<void> {
    await client.from('processed_webhook_events').insert([
      {
        id: eventId,
        provider,
        event_type: eventType,
      },
    ]);
  },

  /**
   * Aggregate real-time school usage metrics against plan entitlements.
   */
  async getSchoolUsageMetrics(
    schoolId: string,
    client: SupabaseClient = defaultClient
  ): Promise<SchoolUsageMetrics> {
    const now = new Date();
    const periodMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const [teachersRes, studentsRes, classesRes, devicesRes, aiUsageRes] = await Promise.all([
      client
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('school_id', schoolId)
        .eq('role', 'TEACHER'),
      client
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('school_id', schoolId)
        .eq('role', 'STUDENT'),
      client
        .from('classes')
        .select('*', { count: 'exact', head: true })
        .eq('school_id', schoolId),
      client
        .from('classroom_devices')
        .select('*', { count: 'exact', head: true })
        .eq('school_id', schoolId),
      client
        .from('ai_usage_tracking')
        .select('generation_count')
        .eq('school_id', schoolId)
        .eq('period_month', periodMonth),
    ]);

    const totalAiGens = (aiUsageRes.data || []).reduce(
      (acc: number, row: { generation_count?: number }) => acc + (row.generation_count || 0),
      0
    );

    return {
      teachers: teachersRes.count || 0,
      students: studentsRes.count || 0,
      classes: classesRes.count || 0,
      smartboards: devicesRes.count || 0,
      aiGenerations: totalAiGens,
      storageMb: Math.round(((classesRes.count || 0) * 15) + (totalAiGens * 0.5)),
    };
  },

  /**
   * Super Admin Overview: aggregates SaaS metrics across all institutions.
   */
  async getSuperAdminBillingOverview(
    client: SupabaseClient = defaultClient
  ): Promise<SuperAdminBillingOverview> {
    const [schoolsRes, subsRes] = await Promise.all([
      client.from('schools').select('id, name'),
      client.from('subscriptions').select('*, plan:plans(*)'),
    ]);

    const schools = schoolsRes.data || [];
    const subs = (subsRes.data || []) as unknown as Array<SubscriptionRecord & { plan?: PlanRecord }>;

    let mrr = 0;
    let arr = 0;
    const planDistribution: Record<string, number> = {
      free: 0,
      school: 0,
      'school-pro': 0,
      enterprise: 0,
    };
    const pastDueSubscriptions: SuperAdminBillingOverview['pastDueSubscriptions'] = [];

    const activeSchoolIdsWithSub = new Set<string>();

    for (const sub of subs) {
      activeSchoolIdsWithSub.add(sub.school_id);
      const planSlug = sub.plan?.slug || 'free';
      planDistribution[planSlug] = (planDistribution[planSlug] || 0) + 1;

      if (sub.status === 'ACTIVE') {
        const price = sub.plan?.price || 0;
        if (sub.billing_interval === 'YEARLY') {
          arr += price;
          mrr += Math.round(price / 12);
        } else {
          mrr += price;
          arr += price * 12;
        }
      } else if (sub.status === 'PAST_DUE') {
        const schoolObj = schools.find((s) => s.id === sub.school_id);
        pastDueSubscriptions.push({
          id: sub.id,
          school_id: sub.school_id,
          school_name: schoolObj?.name || 'School',
          status: sub.status,
          current_period_end: sub.current_period_end,
          amount: sub.plan?.price || 0,
        });
      }
    }

    // Schools without explicit paid subscriptions count as Free
    const freeCount = schools.filter((s) => !activeSchoolIdsWithSub.has(s.id)).length;
    planDistribution.free = (planDistribution.free || 0) + freeCount;

    return {
      totalSchools: schools.length,
      subscribedSchools: subs.filter((s) => s.status === 'ACTIVE' && s.plan?.slug !== 'free').length,
      freeSchools: planDistribution.free || 0,
      mrr,
      arr,
      planDistribution,
      pastDueSubscriptions,
    };
  },
};
