# Changelog

All notable changes to the SubSense project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased] (v3.0.0)

### Added
- **Dynamic Gemini PDF OCR**: Integrated `gemini-1.5-pro` vision endpoints to directly ingest Base64 PDF bank statements and output raw JSON structured arrays of extracted subscription data.
- **Gmail Scanner Trial Logic**: Added deterministic prompt engineering to the `gemini-2.0-flash` text extractor to successfully flag `cancelled`, `trial`, and `expired` statuses from raw email payloads.
- **Vercel Telemetry**: Injected `@vercel/analytics` and `@vercel/speed-insights` for live user session mapping.
- **SEO Enhancements**: Added OpenGraph definitions, dynamic `sitemap.ts` generation, and `robots.txt` masking for authenticated routes.
- **Strict Typing Engine**: Forced global Next.js `API Response` structures across all endpoints enforcing strict `{ success: boolean, data?: any, error?: string }` payload deliveries.

### Changed
- **Dashboard Compute**: Heavy array aggregations (`totalMonthlySpend`, `healthScore`) are now completely wrapped in `useMemo` hooks, saving hundreds of wasted render frames during nested state changes.
- **Auth Security Boundary**: Overhauled cookie provisioning to strictly flag `subsense_session` payloads with `Secure`, `HttpOnly`, and `SameSite=Strict`.

### Fixed
- **Type Nullability Crashes**: Patched a massive UI crash vector where `auth.user` returning `null` during initialization destroyed the React suspense boundaries.
- **Data Iteration Failures**: Enforced safety wrappers on the client parsing logic to await the `data.data` field natively on network responses rather than assuming bare arrays.

---

## [v2.0.0] - Landing Page Refactor

### Changed
- **Visual Aesthetic Engine**: Complete pivot from a standard layout to a premium "Dark UI SaaS" interface mirroring the design systems of Vercel and Linear.
- **Framer Motion Integration**: Added staggering layout fluid animations, active gradient masks, and glassmorphism styling parameters.
- **Dashboard Wireframes**: Introduced the sliding insights drawer and skeleton loading states.

---

## [v1.0.0] - Initial Prototype

### Added
- Minimum Viable Product (MVP) initialized using Next.js 16 and Tailwind CSS.
- Local Storage sandbox functionality allowing demonstration interactions without live Supabase database bindings.
- Rudimentary Gmail scanning wireframes established.
