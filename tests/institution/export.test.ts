import { describe, it, expect } from 'vitest';
import { ExportReportSchema } from '../../src/lib/validations/institution';

describe('Phase 8 Institutional Report Export Engine', () => {
  describe('Export Parameters Validation', () => {
    it('Validates CSV and JSON export configurations', () => {
      const csvExport = {
        scope_type: 'DISTRICT',
        scope_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        format: 'CSV',
      };
      expect(ExportReportSchema.safeParse(csvExport).success).toBe(true);

      const jsonExport = {
        scope_type: 'STATE',
        scope_id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
        format: 'JSON',
      };
      expect(ExportReportSchema.safeParse(jsonExport).success).toBe(true);
    });

    it('Rejects unsupported export formats', () => {
      const invalid = {
        scope_type: 'ORGANIZATION',
        scope_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        format: 'XML', // Unsupported in export schema
      };
      expect(ExportReportSchema.safeParse(invalid).success).toBe(false);
    });
  });

  describe('CSV Generation & Privacy Masking', () => {
    const generateCsvContent = (
      scopeName: string,
      scopeType: string,
      overview: {
        totalSchools: number;
        totalTeachers: number;
        totalStudents: number;
        insufficientData: boolean;
        averageMasteryScore: number | null;
        adoptionRate: number;
      },
      concepts: Array<{
        name: string;
        chapter: string;
        subject: string;
        mastery: number | null;
        evaluatedStudents: number;
        insufficientData: boolean;
      }>
    ) => {
      const rows: string[] = [
        `"Institutional Report - ${scopeName}"`,
        `"Scope Type","${scopeType}"`,
        '',
        '"KPI Summary"',
        '"Total Schools","Total Teachers","Total Students","Avg Mastery","Adoption Rate"',
        `${overview.totalSchools},${overview.totalTeachers},${overview.totalStudents},${overview.insufficientData ? '"Insufficient data"' : overview.averageMasteryScore ?? 'N/A'},"${overview.adoptionRate}%"`,
        '',
        '"Academic Concept Performance (Privacy Masked N >= 10)"',
        '"Concept Name","Chapter","Subject","Average Mastery","Evaluated Students"',
      ];

      for (const c of concepts) {
        const scoreDisplay = c.insufficientData ? '"Insufficient data"' : (c.mastery ?? 'N/A');
        rows.push(`"${c.name}","${c.chapter}","${c.subject}",${scoreDisplay},${c.evaluatedStudents}`);
      }

      return rows.join('\n');
    };

    it('Generates properly formatted CSV with masked scores for cohorts < 10', () => {
      const csv = generateCsvContent(
        'Pune District',
        'DISTRICT',
        {
          totalSchools: 4,
          totalTeachers: 12,
          totalStudents: 8, // < 10
          insufficientData: true,
          averageMasteryScore: null,
          adoptionRate: 75,
        },
        [
          {
            name: 'Linear Equations',
            chapter: 'Algebra',
            subject: 'Mathematics',
            mastery: null,
            evaluatedStudents: 7, // < 10
            insufficientData: true,
          },
          {
            name: 'Force & Pressure',
            chapter: 'Physics',
            subject: 'Science',
            mastery: 84,
            evaluatedStudents: 40,
            insufficientData: false,
          },
        ]
      );

      expect(csv).toContain('"Institutional Report - Pune District"');
      expect(csv).toContain('4,12,8,"Insufficient data","75%"');
      expect(csv).toContain('"Linear Equations","Algebra","Mathematics","Insufficient data",7');
      expect(csv).toContain('"Force & Pressure","Physics","Science",84,40');
    });
  });
});
