# Security — IRGE Extension

> Scope: this document covers the **prototype** security posture and the **target** posture for production.

## 1. Current posture (prototype)

| Area | Status |
|---|---|
| Authentication | **Mocked** — Zod-validated email/password + mock Microsoft Entra SSO button |
| Session storage | None (state lives in React) |
| Secrets | None checked into the repo |
| Data | All mock, generated client-side |
| Network calls | None to external services |
| Dependencies | Standard React/Vite/Tailwind stack |

The prototype is safe to demo publicly because **no real data, secrets, or backend exists**.

## 2. Target posture (production)

### 2.1 Authentication & session
- **Microsoft Entra ID (Azure AD)** OIDC for SSO
- Email/password fallback via Lovable Cloud (Supabase Auth) with email confirmation
- Short-lived access tokens (≤15 min) + refresh rotation
- httpOnly, Secure, SameSite=Lax cookies — never `localStorage` for tokens

### 2.2 Authorization
- **Roles stored in a dedicated `user_roles` table** (never on `profiles`)
- Enum: `admin`, `revops`, `sales_lead`, `viewer`
- All access mediated by a `has_role(user_id, role)` SECURITY DEFINER function
- Row-Level Security (RLS) on every table; deny-by-default

### 2.3 Secrets management
- All API keys (OCI, Salesforce, Microsoft) stored in **Lovable Cloud secrets**, never in the client bundle
- Only **publishable / anon** keys may appear in frontend code
- Rotation policy: 90 days for service credentials, immediate on role change

### 2.4 Data protection
- TLS 1.2+ everywhere
- PII fields (account contacts, CSM names) encrypted at rest in Gold layer
- ARR / revenue figures gated by role — `viewer` sees ranges, not exact values
- Audit log for every decision **executed** vs **reviewed**

### 2.5 Frontend hardening
- Strict CSP (`default-src 'self'`, no inline scripts)
- Subresource Integrity for any third-party CDN assets
- Dependabot / npm audit in CI; block on `high`+ severity
- No `dangerouslySetInnerHTML` without sanitization

## 3. Threat model (top risks)

| Threat | Mitigation |
|---|---|
| Token theft via XSS | httpOnly cookies, strict CSP, framework-escaped JSX |
| Privilege escalation | Roles in separate table, SECURITY DEFINER `has_role`, RLS |
| Decision tampering | Server-side validation; client cannot mutate `status` directly |
| Sensitive PII leak in logs | Redaction layer in observability pipeline |
| Supply-chain (npm) | Lockfile, audit, pinned versions, CI scan |

## 4. Things to **never** do

- ❌ Store roles on the `profiles` table
- ❌ Check admin status from `localStorage` or hardcoded emails
- ❌ Put OCI / Salesforce service keys in the client bundle
- ❌ Disable RLS "temporarily"
- ❌ Trust client-supplied `confidence` or `impact` values

## 5. Incident response

1. Rotate affected credentials via Lovable Cloud secrets
2. Invalidate all refresh tokens (force re-auth)
3. Review audit log for affected window
4. Patch + redeploy
5. Post-mortem within 5 business days
