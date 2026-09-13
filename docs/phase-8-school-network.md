# Phase 8 — School Networks & Multi-School Organizations

## 1. Overview

Multi-school networks represent organizations that operate or govern multiple member schools across diverse geographical territories. Examples include:
* **Kendriya Vidyalaya Sangathan (KVS)**: 1,200+ central schools across India.
* **Jawaharlal Navodaya Vidyalayas (JNV)**: 660+ residential schools.
* **Private Chains & Educational Trusts**: Chains such as DPS, DAV, Ryan International, or state-level educational societies.

---

## 2. Organization Architecture & Lifecycle

```
[Create Organization (code, name, type)]
                 |
                 v
   [Assign Org Administrator(s)]
                 |
                 v
+----------------+----------------+
|                                 |
v                                 v
[Onboard New School]       [Associate Existing School]
(Link organization_id)     (Update organization_id)
                 |
                 v
[Central Content & Policy Governance]
- Cross-School Resource Sharing Toggle
- Centralized Academic Benchmark Setting
- School Network Comparison Matrix
```

---

## 3. Key Capabilities for Network Administrators

### 3.1 Network-Wide School Directory
Network admins can view, search, and filter all schools in their network with real-time counters for active teachers, student cohorts, active classrooms, and total assessments generated.

### 3.2 Cross-School Benchmarking & Comparison
The Comparative Analytics engine allows network administrators to select between 2 and 10 schools simultaneously to benchmark:
* Teacher & student participation rates
* Average concept mastery percentages
* Open learning gap counts
* Smartboard and interactive content launch frequency

### 3.3 Network-Level Governance Presets
Organizations can enforce policy configurations that automatically cascade to all constituent schools unless locally customized:
* Enabling or disabling cross-school resource discovery
* Setting baseline concept mastery standards (e.g., 75%)
* Specifying supported languages and AI availability modes
