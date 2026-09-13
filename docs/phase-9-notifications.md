# TeacherSathi — Phase 9: Push & In-App Notifications Architecture

## 1. Notification Subsystem
TeacherSathi Mobile implements a hybrid notification architecture:
1. **Remote Push Notifications** via Expo Push Service / FCM (Firebase Cloud Messaging) / APNs (Apple Push Notification service).
2. **In-App Persistent Notifications** stored in PostgreSQL (`notifications` table) with real-time sync.

---

## 2. Notification Types & Trigger Matrix

| Notification Type | Trigger Event | Target Role | Deep Link Destination |
| :--- | :--- | :--- | :--- |
| `ASSIGNMENT_NEW` | Teacher assigns new homework/worksheet to a class. | `STUDENT` | `teacher-sathi://assignment/{id}` |
| `ASSIGNMENT_DUE` | Assignment due in $\le 24\text{ hours}$. | `STUDENT` | `teacher-sathi://assignment/{id}` |
| `ASSESSMENT_PUBLISHED` | Term test / formative quiz published for offline download. | `STUDENT`, `TEACHER` | `teacher-sathi://assessment/{id}` |
| `RESULT_AVAILABLE` | Descriptive or objective grading completed by server. | `STUDENT` | `teacher-sathi://results/{attemptId}` |
| `CLASSROOM_INVITE` | Live smartboard pairing session started in a classroom. | `TEACHER` | `teacher-sathi://classroom/{sessionId}?token={token}` |
| `SYNC_ALERT` | Background sync resolved offline submissions or flagged a conflict. | `TEACHER`, `STUDENT` | `teacher-sathi://notifications` |

---

## 3. Device Registration & Lifecycle
1. **App Launch**: `NotificationService.registerDeviceToken()` obtains device push token and posts to `/api/notifications/devices` with:
   - `push_token`: Exponent push token or native FCM token
   - `platform`: `ANDROID` | `IOS`
   - `app_version`: `1.0.0`
   - `device_model`: Hardware model string (e.g. `Samsung Galaxy A14`)
   - `locale`: Active app language (`en` or `hi`)
2. **User Logout**: `NotificationService.unregisterDeviceToken()` calls `DELETE /api/notifications/devices`, immediately revoking token association to prevent notification leaks to subsequent users of shared devices.
3. **Deep Link Parsing & Authorization**:
   - `NotificationService.parseDeepLink()` normalizes URLs.
   - `NotificationService.canAccessRoute()` validates destination against active user role before screen dispatch (e.g. students cannot navigate to teacher smartboard remote).
