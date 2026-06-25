# SubSense

![SubSense Hero](docs/hero-placeholder.png)

SubSense is an AI-powered subscription management platform that connects securely to Gmail or scans bank statements to detect recurring subscriptions, calculate wasted spending, identify forgotten services, and generate AI-powered saving recommendations. Stop paying for what you don't use.

## Features
- **Gmail Scanner**: Securely scans inbox receipts and identifies active subscriptions, hidden fees, and upcoming renewals.
- **Bank Statement OCR**: Upload PDF bank statements to instantly extract recurring charges using AI-vision parsing.
- **AI Financial Insights**: Get intelligent roast-style feedback and actionable recommendations on your subscription health.
- **Duplicate Detection**: Automatically flags duplicate services (e.g., Netflix and Hulu) and recommends cuts.
- **Premium UI**: Seamless, dark-mode futuristic dashboard with fluid glassmorphism and Framer Motion animations.

## Tech Stack
- **Framework**: Next.js 16 (App Router), React 19
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Database/Auth**: Supabase (Mocked via LocalStorage for Sandbox)
- **AI/LLM**: Google Gemini 1.5 Flash / 2.0 Pro
- **Icons**: Lucide React
- **Analytics**: Vercel Analytics & Speed Insights

## Screenshots
| Dashboard | AI Insights | PDF Scanner |
| :---: | :---: | :---: |
| ![Dashboard](docs/dash-placeholder.png) | ![Insights](docs/insights-placeholder.png) | ![PDF Scanner](docs/scanner-placeholder.png) |

## Architecture Overview
SubSense utilizes a frontend-heavy architecture with standard Next.js Route Handlers orchestrating backend logic. The UI relies on aggressive React `useMemo` caching to rapidly filter heavy financial datasets without dropping frames. Backend extraction leverages Google's Gemini Vision and Text LLM endpoints for asynchronous data structuring. (See `ARCHITECTURE.md` for deep dive).

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/subsense.git

# Navigate to directory
cd subsense

# Install dependencies
npm install

# Run the development server
npm run dev
```
Navigate to `http://localhost:3000`.

## Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```
*Note: If Supabase keys are excluded, the app boots into Local Storage Sandbox mode.*

## Folder Structure
```text
src/
├── app/
│   ├── api/          # Next.js Route Handlers (Auth, Scan, Insights)
│   ├── dashboard/    # Main User Application Boundary
│   ├── layout.tsx    # Root Layout & Analytics
│   └── page.tsx      # Landing Page
├── components/
│   └── landing/      # Landing Page UI Components
├── lib/
│   ├── supabase.ts   # Supabase Client & Local Mock
│   └── subscription-logos.ts
```

## Deployment
SubSense is optimized for Vercel deployment:
```bash
npm run build
npm run start
```
Connect your GitHub repository to Vercel and ensure environment variables are configured in the Vercel dashboard.

## Future Roadmap
- [ ] Migrate heavy PDF OCR processing to Inngest background queues.
- [ ] Implement true cryptographic JWT verification on the server.
- [ ] Refactor dashboard monolith into micro-components.
- [ ] Support Plaid OAuth for direct bank feed integration.

## License
MIT License. See `LICENSE` for more information.
