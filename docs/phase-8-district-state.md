# Phase 8 — District & State-Level Administration

## 1. Jurisdictional Hierarchy

State and District tiers represent the geographical and governmental administrative bodies overseeing public and affiliated education systems:

$$\text{State (e.g., Maharashtra)} \longrightarrow \text{District (e.g., Pune, Nagpur)} \longrightarrow \text{Schools}$$

---

## 2. State-Level Administration (`STATE_ADMIN`)

### 2.1 Scope of Authority
A `STATE_ADMIN` possesses oversight of all districts and public schools registered under their state ID (`states.id`).

### 2.2 Core Responsibilities
1. **Statewide Adoption & Utilization Telemetry**:
   Monitor the percentage of schools actively conducting digital classrooms, utilizing interactive smartboard modules, and conducting formative assessments.
2. **Curriculum-Level Diagnostic Oversight**:
   Inspect statewide mastery trends across NCERT Subjects, Books, Chapters, and Concepts.
3. **Statewide Policy Defaults**:
   Configure state-level governance settings (default instructional language: English / Hindi / Bilingual, minimum passing grades, default remediation parameters).
4. **District Administration Delegation**:
   Issue cryptographic administrative invitations to District Education Officers (DEOs).

---

## 3. District-Level Administration (`DISTRICT_ADMIN`)

### 3.1 Scope of Authority
A `DISTRICT_ADMIN` operates strictly within their assigned district boundaries (`districts.id`). They cannot view schools or metrics in neighboring districts.

### 3.2 Core Responsibilities
1. **Local School Onboarding**:
   Onboard schools directly into the district registry with localized metadata (CBSE / State Board, city, PIN code).
2. **Targeted Remediation & Gap Monitoring**:
   Identify specific learning concepts with elevated failure or gap rates across district schools.
3. **School-to-School Peer Benchmarking**:
   Benchmark schools within the district to identify high-performing model schools and schools requiring administrative intervention.
4. **School Admin Provisioning**:
   Issue cryptographic invitation links to new school principals and headmasters.
