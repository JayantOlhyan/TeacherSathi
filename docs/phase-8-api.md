# Phase 8 — Institutional REST API Specification

## 1. Authentication & Common Headers

All institutional admin endpoints require:
* Valid Supabase session cookie or `Authorization: Bearer <token>`
* Authenticated user role in `SUPER_ADMIN`, `STATE_ADMIN`, `DISTRICT_ADMIN`, `ORG_ADMIN`, or `SCHOOL_ADMIN`

---

## 2. Endpoint Index

| Method | Path | Description |
| :--- | :--- | :--- |
| `GET` | `/api/admin/institutional/states` | List active states. |
| `POST` | `/api/admin/institutional/states` | Create new state (Super Admin only). |
| `GET` | `/api/admin/institutional/districts` | List districts (optionally filtered by `state_id`). |
| `POST` | `/api/admin/institutional/districts` | Create district under a state. |
| `GET` | `/api/admin/institutional/organizations` | List multi-school organizations. |
| `POST` | `/api/admin/institutional/organizations` | Create school network / organization. |
| `GET` | `/api/admin/institutional/schools` | Paginated, enriched directory of schools with search & filters. |
| `POST` | `/api/admin/institutional/schools` | Onboard new school with state, district, or org hierarchy. |
| `GET` | `/api/admin/institutional/schools/[id]` | Fetch single school details with hierarchy. |
| `PATCH` | `/api/admin/institutional/schools/[id]` | Update school hierarchy or metadata. |
| `DELETE` | `/api/admin/institutional/schools/[id]` | Soft-delete / deactivate school. |
| `GET` | `/api/admin/institutional/overview` | Scope-aware overview KPIs (schools, teachers, students, adoption). |
| `GET` | `/api/admin/institutional/academic` | Scope-aware academic mastery & learning gaps ($N \ge 10$ masked). |
| `GET` | `/api/admin/institutional/adoption` | Adoption and utilization breakdown. |
| `GET` | `/api/admin/institutional/resources` | Digital content & smartboard telemetry across schools. |
| `POST` | `/api/admin/institutional/compare` | Multi-school benchmark matrix (2 to 10 schools). |
| `GET` | `/api/admin/institutional/invitations` | List pending invitations for a scope. |
| `POST` | `/api/admin/institutional/invitations` | Generate cryptographic single-use invitation. |
| `DELETE` | `/api/admin/institutional/invitations` | Revoke active invitation. |
| `POST` | `/api/admin/institutional/invitations/accept` | Verify token & provision role/membership. |
| `GET` | `/api/admin/institutional/settings` | Get effective or raw institutional settings. |
| `PUT` | `/api/admin/institutional/settings` | Upsert institutional governance settings. |
| `POST` | `/api/admin/institutional/reports/export` | Export aggregated reports (CSV or JSON). |
