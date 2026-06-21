# SubSense Production Readiness Checklist

This checklist details the steps required to transition SubSense from local sandbox/preview stages to a live production environment under a custom domain (e.g., `subsense.ai`).

---

## 1. Custom Domain & DNS Configuration
- [ ] **Purchase Domain**: Acquire target domain name through registrar (GoDaddy, Namecheap, Google Domains).
- [ ] **Vercel Custom Domain Link**:
  - Add domain inside Vercel Dashboard -> Project Settings -> Domains.
  - Set up canonical redirect from `www.yourdomain.com` to `yourdomain.com`.
- [ ] **DNS Records Settings**:
  - Configure `A` record pointing to Vercel IP: `76.76.21.21`
  - Configure `CNAME` record for `www` subdomain pointing to `cname.vercel-dns.com`
  - Wait for DNS propagation and SSL certificate generation (handled automatically by Vercel).

---

## 2. Google Cloud Platform (GCP) & OAuth Setup
- [ ] **Create Production Credentials**: Set up dedicated GCP credentials for production.
- [ ] **Authorized JavaScript Origins**:
  - Add production URL: `https://yourdomain.com`
- [ ] **Authorized Redirect URIs**:
  - Add callback URI: `https://yourdomain.com/api/auth/callback`
- [ ] **OAuth Consent Screen Verification**:
  - Set Publishing Status to **In Production**.
  - Submit request scopes:
    - `https://www.googleapis.com/auth/userinfo.profile` (Read Profile)
    - `https://www.googleapis.com/auth/userinfo.email` (Read Email)
    - `https://www.googleapis.com/auth/gmail.readonly` (Read Gmail Invoices/Receipts)
  - Complete the brand verification process (provide Privacy Policy, Terms, and YouTube explanation video showing user OAuth consent flow).

---

## 3. Privacy Policy & Terms of Service Requirements
- [ ] **Publish Privacy Policy**: Host a public HTML/MD file outlining:
  - How Gmail read-only token data is fetched, used, and cleared.
  - Confirmation that no user email data is stored long-term or shared with third parties.
- [ ] **Publish Terms of Service**: Outline user guidelines, sandbox demo limitations, and subscription proxy cancel rules.

---

## 4. Security Audit & Supabase RLS Policies
- [ ] **Database RLS Verification**:
  - Confirm Row Level Security is enabled on tables `users`, `subscriptions`, `scans`, and `insights`.
  - Verify all database writes/reads utilize the correct user context.
- [ ] **Session Security**:
  - Ensure cookie `subsense_session` uses `httpOnly: true`, `secure: true`, and `sameSite: "lax"`.

---

## 5. Environment Variable Final Check
- [ ] Ensure the following values are loaded into Vercel production dashboard:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
  - `GEMINI_API_KEY`
  - `NEXTAUTH_URL` (Set to `https://yourdomain.com`)
  - `NODE_ENV` (Set to `production`)
