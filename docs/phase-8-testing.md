# Phase 8 — Testing Suite & Verification Matrix

## 1. Test Suite Summary

The Phase 8 test suite covers all institutional features across 9 dedicated test specifications in `tests/institution/`:

| Test Suite | Spec File | Test Count | Key Areas Covered |
| :--- | :--- | :---: | :--- |
| **RBAC & Capabilities** | `tests/institution/rbac.test.ts` | 9 | Scope permission boundaries, action authorization, immutability of NCERT curriculum. |
| **Row-Level Security** | `tests/institution/rls.test.ts` | 6 | Cross-state isolation, district containment, network scoping, independent school privacy. |
| **Hierarchy & Models** | `tests/institution/hierarchy.test.ts` | 8 | State/district/org schemas, onboarding payloads, UUID validation, independent schools. |
| **Reporting Engine** | `tests/institution/reporting.test.ts` | 5 | Adoption rates, gap resolution rates, overview KPI contracts, comparative rows. |
| **Academic Intelligence** | `tests/institution/academic.test.ts` | 6 | Concept mastery categorization, learning gap severity tiers, NCERT concept alignment. |
| **Privacy by Design** | `tests/institution/privacy.test.ts` | 7 | Minimum sample threshold ($N \ge 10$), small cohort score suppression, deanonymization guard. |
| **Cryptographic Invitations** | `tests/institution/invitations.test.ts` | 8 | Random token generation (64 hex), SHA-256 hash verification, single-use, expiry, revocation. |
| **Cascading Settings** | `tests/institution/settings.test.ts` | 5 | 4-tier cascade resolution: Defaults $\to$ State $\to$ District $\to$ Org $\to$ School. |
| **Report Export Engine** | `tests/institution/export.test.ts` | 3 | CSV generation, escaping, header structuring, masked scores in exports. |

**Total Phase 8 Tests**: 57 tests across 9 files (100% passing).  
**Platform-Wide Test Suite**: 267 tests across 49 files (100% passing).

---

## 2. Verification Commands

```bash
# Run Phase 8 test suite
npx vitest run tests/institution/

# Run entire platform test suite
npm test

# Verify type safety
npm run typecheck

# Verify linter rules
npm run lint

# Verify production Next.js build
npm run build
```
