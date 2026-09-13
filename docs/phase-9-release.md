# TeacherSathi — Phase 9: Mobile Release & App Version Management

## 1. Release Architecture
The release management pipeline manages application versions across Android (Google Play Store) and iOS (Apple App Store) with centralized remote version checks.

---

## 2. Version Check Specification (`GET /api/mobile/version-check`)
Clients send:
- `platform`: `android` | `ios`
- `version`: Semver string (e.g. `1.0.0`)

The server queries `app_version_configs` and returns:
```json
{
  "success": true,
  "data": {
    "status": "CURRENT",
    "platform": "android",
    "client_version": "1.0.0",
    "min_supported_version": "1.0.0",
    "latest_version": "1.0.0",
    "update_url": "https://play.google.com/store/apps/details?id=in.teachersathi.app",
    "release_notes": "Stable production release"
  }
}
```

### Version Status Enum & Client Behavior
1. **`CURRENT`**: Client is on the latest recommended release. Normal execution proceeds.
2. **`UPDATE_RECOMMENDED`**: A newer release exists with non-critical features. A dismissible banner is shown informing the user.
3. **`UPDATE_REQUIRED`**: The client version is below `min_supported_version` or a critical security patch is mandated. A blocking modal is presented, preventing further actions until updated via the official store link.

---

## 3. Database Schema (`app_version_configs`)
```sql
CREATE TABLE app_version_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform TEXT NOT NULL CHECK (platform IN ('android', 'ios')),
    min_supported_version TEXT NOT NULL,
    latest_version TEXT NOT NULL,
    update_url TEXT NOT NULL,
    release_notes TEXT,
    critical_security_patch BOOLEAN DEFAULT false,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_app_version_platform UNIQUE (platform)
);
```
Seeded with:
- Android: `min_supported_version: 1.0.0`, `latest_version: 1.0.0`
- iOS: `min_supported_version: 1.0.0`, `latest_version: 1.0.0`
