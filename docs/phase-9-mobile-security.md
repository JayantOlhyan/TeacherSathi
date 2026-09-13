# TeacherSathi — Phase 9: Mobile Security & Data Protection Specification

## 1. Threat Model & Environment
Mobile devices in Indian educational institutions are frequently:
1. Shared across multiple teachers or multiple student shifts (morning/evening batches).
2. Connected to open or unencrypted school Wi-Fi networks.
3. Vulnerable to local application inspection or rooted/jailbroken OS environments.

---

## 2. Key Security Protections

### A. Hardware Keychain Isolation
- Auth session JWTs are stored solely in hardware-backed storage via `expo-secure-store` (Android KeyStore / iOS Keychain Services with `kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly`).
- Never stored in unencrypted `AsyncStorage`, SQLite databases, or local file caches.

### B. Shared Device Hygiene & Instant Wipe
- Upon user logout (`authService.logout()`):
  1. Auth token and profile are deleted from SecureStore.
  2. Local `offline_answers` table is cleared.
  3. Local `sync_outbox` table is purged.
  4. Cached user-specific assignments are scrubbed.
  5. Generic public NCERT curriculum remains cached to avoid unnecessary bandwidth consumption for the next teacher.

### C. Assessment Tamper Protection & Masked Payloads
- Downloaded assessment packages are **masked**:
  - Model answers, teacher rubrics, and correct answer options are stripped on the server before packaging.
  - The mobile device has zero client-side knowledge of the correct answer keys.
- **Tamper Sealing**:
  - Once an attempt is submitted (`assessmentEngine.submitAttempt()`), the session is sealed locally with a timestamp and locked against further modifications.
  - Any subsequent attempts to record answers for a sealed attempt are rejected with hard runtime exceptions.

### D. Zero Secrets in Client Code
- Mobile source code contains:
  - No service role keys
  - No database master passwords
  - No third-party AI provider API keys (OpenAI/Anthropic/Gemini)
  - No payment gateway private secrets
- All privileged calls route strictly through authenticated backend endpoints protected by Supabase RLS and Next.js middleware.
