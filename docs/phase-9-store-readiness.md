# TeacherSathi — Phase 9: Google Play & App Store Readiness Checklist

## 1. Google Play Store Readiness (Android Primary Tier)

### Package & Configuration (`mobile/app.json`)
- **Package Name**: `in.teachersathi.app`
- **Target SDK**: Android 14 (API level 34)
- **Minimum SDK**: Android 7.0 (API level 24) — covering 98.6% of active Indian Android devices.
- **Architecture Support**: `armeabi-v7a`, `arm64-v8a`, `x86_64`.
- **Permissions Declared**:
  - `INTERNET`: Network requests to TeacherSathi APIs.
  - `ACCESS_NETWORK_STATE`: Connectivity detection via NetInfo.
  - `RECEIVE_BOOT_COMPLETED`: Scheduling notifications and sync reminders.
  - `CAMERA` (Optional): Classroom pairing QR code scanning.
  - `VIBRATE`: Haptic feedback on assessment question interaction.

### App Bundle & Performance
- **Format**: Android App Bundle (`.aab`) with Play Feature Delivery support.
- **Binary Download Size**: $\approx 18.5\text{ MB}$ (uncompressed install $\approx 42\text{ MB}$).
- **ProGuard / R8**: Enabled minification, tree-shaking, and code obfuscation.

---

## 2. Apple App Store Readiness (iOS Secondary Tier)

### Bundle & Capabilities (`mobile/app.json`)
- **Bundle Identifier**: `in.teachersathi.app`
- **Minimum OS**: iOS 15.0
- **Supported Devices**: iPhone & iPad (Universal)
- **Capabilities**:
  - Push Notifications (`aps-environment: production`)
  - Background Processing (Background fetch for outbox synchronization)
  - Keychain Sharing (Hardware secure store)

### Privacy Manifest & Data Safety
- **Data Collected**:
  - User Identifier (`userId`) — Authenticated usage
  - Diagnostics (`telemetry`) — Crash reports and sync health (non-PII)
- **Data Not Collected**:
  - Precise location, financial/payment credentials, advertising tracking.
- **Children's Privacy Compliance**: Complies with COPPA and Indian Digital Personal Data Protection Act (DPDP Act 2023) standards.
