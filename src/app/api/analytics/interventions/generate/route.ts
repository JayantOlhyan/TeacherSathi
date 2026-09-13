import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { interventionService } from '@/lib/services/interventions';
import { interventionsRepository } from '@/lib/repositories/interventions';
import { entitlementEngine } from '@/lib/billing/entitlements';
import { GenerateInterventionSchema } from '@/lib/validations/analytics';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Fetch user role and school
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('id, role, school_id')
      .eq('id', user.id)
      .single();

    if (profileError || !userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 403 });
    }

    if (userProfile.role === 'STUDENT') {
      return NextResponse.json({ error: 'Forbidden: Only teachers can generate interventions' }, { status: 403 });
    }

    // 2. Billing Entitlement Check (Section 39)
    if (userProfile.school_id && userProfile.role !== 'SUPERADMIN') {
      const canGenerate = await entitlementEngine.canUseFeature(userProfile.school_id, 'ai_remediation');
      if (!canGenerate) {
        return NextResponse.json(
          {
            error: 'AI Remediation generation requires an active School Pro or Enterprise plan.',
            code: 'ENTITLEMENT_REQUIRED',
          },
          { status: 403 }
        );
      }
    }

    const body = await request.json();
    const validated = GenerateInterventionSchema.parse(body);

    // 3. Generate structured remediation via service
    const interventionActivity = await interventionService.generateRemediation(
      {
        conceptId: validated.conceptId,
        chapterId: validated.chapterId,
        gradeId: validated.gradeId,
        subjectId: validated.subjectId,
        language: validated.language,
        observedWeakness: validated.observedWeakness,
      },
      supabase
    );

    // 4. Persist in database as DRAFT (Section 24: AI Output Status must remain DRAFT until teacher approval)
    const interventionDraft = await interventionsRepository.createInterventionDraft(
      user.id,
      userProfile.school_id || null,
      {
        conceptId: validated.conceptId,
        chapterId: validated.chapterId,
        title: interventionActivity.title,
        type: 'REMEDIATION_PLAN',
        content: interventionActivity as unknown as Record<string, unknown>,
        status: 'DRAFT',
      },
      supabase
    );

    return NextResponse.json({
      data: interventionActivity,
      intervention: interventionDraft,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
