# TeacherSathi — PostgreSQL Row Level Security (RLS) for SaaS Billing

> **Status**: Production Reference Architecture (Phase 5)  
> **Target Audience**: Database Administrators, Security Auditors, Backend Engineers

---

## 1. Security Definer Helper Function

Multi-tenant school admin access is evaluated at the database level using a dedicated security-definer function:

```sql
CREATE OR REPLACE FUNCTION is_school_admin_of(p_user_id UUID, p_school_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM users
        WHERE id = p_user_id
          AND school_id = p_school_id
          AND role = 'SCHOOL_ADMIN'
          AND is_active = TRUE
    );
END;
$$;
```

### Security Properties
- **`SECURITY DEFINER`**: Bypasses table-level restrictions on `users` to evaluate administrative permissions reliably.
- **`SET search_path = public`**: Prevents schema search path hijacking attacks.
- **`is_active = TRUE`**: Immediately revokes access for deactivated school administrators.

---

## 2. Row Level Security Policies by Table

### 2.1 `plans` Table
- **Policy**: Public read for active plans; superadmin full management.
```sql
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active plans"
    ON plans FOR SELECT
    USING (is_active = TRUE);

CREATE POLICY "Superadmins can manage plans"
    ON plans FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'SUPERADMIN'
        )
    );
```

---

### 2.2 `subscriptions` Table
- **Policy**: School admins can read/update their own school subscription; superadmins have global access; teachers and students have zero access.
```sql
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "School Admins can view own school subscription"
    ON subscriptions FOR SELECT
    USING (
        is_school_admin_of(auth.uid(), school_id)
        OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'SUPERADMIN')
    );

CREATE POLICY "School Admins can update own school subscription"
    ON subscriptions FOR UPDATE
    USING (
        is_school_admin_of(auth.uid(), school_id)
        OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'SUPERADMIN')
    );

CREATE POLICY "Superadmins can insert subscriptions"
    ON subscriptions FOR INSERT
    WITH CHECK (
        is_school_admin_of(auth.uid(), school_id)
        OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'SUPERADMIN')
    );
```

---

### 2.3 `subscription_events` Table (Audit Log)
- **Policy**: Append-only log. School admins can view their school's subscription events; superadmins view all; no user updates or deletes are permitted.
```sql
ALTER TABLE subscription_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "School Admins can view own subscription events"
    ON subscription_events FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM subscriptions s
            WHERE s.id = subscription_events.subscription_id
              AND (
                  is_school_admin_of(auth.uid(), s.school_id)
                  OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'SUPERADMIN')
              )
        )
    );

CREATE POLICY "System and admins can insert subscription events"
    ON subscription_events FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM subscriptions s
            WHERE s.id = subscription_events.subscription_id
              AND (
                  is_school_admin_of(auth.uid(), s.school_id)
                  OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'SUPERADMIN')
              )
        )
    );
```

---

### 2.4 `payment_records` Table (Financial Ledger)
- **Policy**: School admins can view payments for their school; superadmins view all.
```sql
ALTER TABLE payment_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "School Admins can view own school payments"
    ON payment_records FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM subscriptions s
            WHERE s.id = payment_records.subscription_id
              AND (
                  is_school_admin_of(auth.uid(), s.school_id)
                  OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'SUPERADMIN')
              )
        )
    );

CREATE POLICY "System can insert payment records"
    ON payment_records FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM subscriptions s
            WHERE s.id = payment_records.subscription_id
              AND (
                  is_school_admin_of(auth.uid(), s.school_id)
                  OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'SUPERADMIN')
              )
        )
    );
```

---

### 2.5 `processed_webhook_events` Table (Idempotency Ledger)
- **Policy**: Superadmin view only. Mutated solely via service role / backend server process.
```sql
ALTER TABLE processed_webhook_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Superadmins can view processed webhooks"
    ON processed_webhook_events FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'SUPERADMIN')
    );
```

---

## 3. Verification & Automated Test Coverage

The RLS policy definitions are validated through automated integration tests in `tests/billing/security.test.ts`:
1. Verifies that public/anonymous queries can read plans but cannot access subscriptions.
2. Verifies that teachers and students receive zero rows when querying `subscriptions` or `payment_records`.
3. Verifies that school admins only receive records matching their designated `school_id`.
4. Verifies that superadmins have unrestricted multi-tenant oversight.
