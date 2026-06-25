# SubSense Architecture

This document outlines the core architecture and data pipelines for the SubSense application.

## Application Architecture
SubSense follows a standard Next.js 16 App Router monolith pattern:
- **Frontend Layer**: React 19 Client Components (`"use client"`) handle interactive state, animation logic (Framer Motion), and data fetching.
- **Backend API Layer**: Next.js Route Handlers (`src/app/api`) act as secure proxies that format client requests, execute LLM invocations against Gemini, and strictly format JSON responses.
- **Data Layer**: Supabase handles persistent database storage and authentication. A Sandbox mock utilizes `localStorage` to allow demonstration without live database connections.

## Component Structure
- **Landing UI**: Functional, isolated components located in `src/components/landing`.
- **Dashboard UI**: Housed inside `src/app/dashboard/page.tsx`. Current architecture is monolithic; logic is governed by extensive local `useState` hooks. Heavy arrays are optimized via `useMemo`.

## Request Flow
1. User triggers an action (e.g., "Scan Gmail").
2. The Dashboard UI sets a loading state (`isScanning = true`) and fires a `POST` request to `/api/scan/gmail`.
3. The API route receives the request, wraps execution in a universal `try/catch` block, and invokes external services.
4. The API standardizes the response to `{ success: boolean, data: T | null, error: string | null }`.
5. The UI parses `data.data`, updates the internal React state, and triggers an aesthetic re-render.

## Authentication Flow
1. User clicks "Login via Google".
2. UI redirects to `/api/auth/google`.
3. Google handles OAuth execution.
4. The callback hits `/api/auth/callback`. The route provisions a secure `subsense_session` cookie (`HttpOnly`, `SameSite=Strict`, `Secure` in production).
5. The Dashboard UI boots, pings `/api/auth/me` to verify the cookie, and provisions the `auth` state.

## Gmail Scanner Pipeline
1. Client passes a Google API Access Token to `/api/scan/gmail`.
2. The server requests the user's latest 500 emails via the Gmail REST API matching queries like `subject:receipt OR subject:subscription`.
3. Raw email text is bundled into a densely formatted payload.
4. The payload is piped to Gemini 2.0 Flash with a strict `response_mime_type: "application/json"` directive.
5. Gemini extracts merchant names, prices, currencies, and infers status (`active`, `cancelled`, `trial`).
6. The JSON is validated and returned to the client.

## PDF Processing Pipeline
1. User uploads a PDF statement to the frontend.
2. A FileReader encodes the PDF to a Base64 string.
3. The Base64 string is POSTed to `/api/scan/pdf`.
4. The backend pipes the raw Base64 document as an `application/pdf` `InlineData` part to Gemini 1.5 Pro (Vision capabilities).
5. The LLM performs native OCR and entity extraction to locate recurring charges and normalizes merchant names.
6. Server returns the extracted JSON array.

## AI Insights Pipeline
1. Client gathers current `subscriptions` array.
2. The array is serialized and sent to `/api/insights`.
3. Gemini processes the financial payload to compute a "Health Score", locate duplicate charges, and provide actionable "roast-style" feedback.
4. Response is returned dynamically to populate the Insights drawer.
