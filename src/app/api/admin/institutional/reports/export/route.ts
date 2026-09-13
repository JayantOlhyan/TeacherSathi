import { NextRequest, NextResponse } from 'next/server';
import { authenticateInstitutionalAdmin } from '@/lib/services/institutionalAuth';
import { reportingService } from '@/lib/services/reportingService';
import { ExportReportSchema } from '@/lib/validations/institution';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const auth = await authenticateInstitutionalAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    const validated = ExportReportSchema.parse(body);

    if (!auth.context.canViewScope(validated.scope_type, validated.scope_id)) {
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions to export report for this scope' }, { status: 403 });
    }

    const supabase = createClient();
    const [overview, academicData] = await Promise.all([
      reportingService.getScopeOverview(validated.scope_type, validated.scope_id, supabase),
      reportingService.getAcademicMetrics(validated.scope_type, validated.scope_id, supabase),
    ]);

    if (validated.format === 'CSV') {
      const rows: string[] = [
        `"Institutional Report - ${overview.scopeName}"`,
        `"Scope Type","${overview.scopeType}"`,
        `"Generated At","${new Date().toISOString()}"`,
        '',
        '"KPI Summary"',
        '"Total Schools","Active Schools","Total Teachers","Total Students","Total Classes","Total Assessments","Avg Mastery","Adoption Rate"',
        `${overview.totalSchools},${overview.activeSchools},${overview.totalTeachers},${overview.totalStudents},${overview.totalClasses},${overview.totalAssessments},${overview.insufficientData ? '"Insufficient data"' : overview.averageMasteryScore ?? 'N/A'},"${overview.adoptionRate}%"`,
        '',
        '"Academic Concept Performance (Privacy Masked N >= 10)"',
        '"Concept Name","Chapter","Subject","Average Mastery","Evaluated Students","Status"',
      ];

      for (const c of academicData.concepts) {
        const scoreDisplay = c.insufficientData ? 'Insufficient data' : (c.averageMastery ?? 'N/A');
        rows.push(`"${c.conceptNameEn}","${c.chapterTitleEn}","${c.subjectName}",${scoreDisplay},${c.studentsEvaluatedCount},"${c.masteryStatus}"`);
      }

      const csvContent = rows.join('\n');
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="institutional-report-${overview.scopeType.toLowerCase()}-${validated.scope_id.slice(0, 8)}.csv"`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        overview,
        academic: academicData,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to generate export';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
