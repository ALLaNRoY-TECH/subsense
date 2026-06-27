# 💳 SubSense

> **Know where your money goes. Cancel what you don't need. Save more effortlessly.**

SubSense is an AI-powered subscription intelligence platform that automatically discovers recurring subscriptions from Gmail receipts and bank statements, analyzes your spending habits, and provides personalized insights to help you save money.

Built with a security-first approach, SubSense combines modern web technologies, AI-powered analysis, and an intuitive user experience into a production-ready SaaS application.

---

## ✨ Features

### 📧 Gmail Subscription Scanner

* Secure Google OAuth 2.0 authentication
* Scans Gmail receipts from the past 12 months
* Automatically detects recurring subscriptions
* Supports major services including:

  * Netflix
  * Spotify
  * YouTube Premium
  * ChatGPT Plus
  * Amazon Prime
  * Prime Video
  * Canva
  * Adobe Creative Cloud
  * Google One
  * Microsoft 365
  * Apple Music
  * Disney+ Hotstar
* Groups duplicate payments
* Calculates monthly and yearly spending

---

### 📄 Bank Statement Scanner

Upload PDF bank statements and let SubSense identify recurring transactions.

Supported Banks:

* SBI
* HDFC
* ICICI
* Axis Bank
* Kotak Mahindra Bank

Features:

* Automatic transaction extraction
* Subscription detection
* Duplicate payment analysis
* Spending categorization

---

### 🤖 AI Spending Insights

Powered by **Google Gemini AI**.

Receive:

* Personalized spending summaries
* Subscription health reports
* Cost-saving recommendations
* Spending behavior analysis
* AI-generated financial insights

---

### 📊 Interactive Dashboard

Monitor everything in one place.

* Active subscriptions
* Monthly spending
* Annual spending projection
* Subscription Health Meter
* Savings Calculator
* AI Insights Panel
* Detailed Subscription Drawer

---

### 🎨 Beautiful Landing Page

Modern SaaS landing page featuring:

* Animated Hero Section
* Interactive Savings Calculator
* AI Feature Showcase
* Glassmorphism UI
* Smooth Framer Motion animations
* Fully Responsive Design

---

## 🛠 Tech Stack

### Frontend

* Next.js 15 (App Router)
* React 19
* TypeScript
* Tailwind CSS v4
* Framer Motion

### Backend

* Next.js API Routes
* Supabase
* Google OAuth 2.0

### AI

* Google Gemini API

### Database

* PostgreSQL (Supabase)

### Authentication

* Google OAuth
* Secure Session Management

### Deployment

* Vercel

---

## 📂 Project Structure

```text
app/
 ├── api/
 │    ├── auth/
 │    ├── scan/
 │    ├── insights/
 │    └── subscriptions/
 ├── dashboard/
 ├── components/
 ├── lib/
 ├── hooks/
 └── utils/

public/

supabase/

types/
```

---

## 🚀 Getting Started

### Clone the repository

```bash
git clone https://github.com/yourusername/subsense.git

cd subsense
```

### Install dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=

NEXT_PUBLIC_SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=

GOOGLE_CLIENT_ID=

GOOGLE_CLIENT_SECRET=

GOOGLE_REDIRECT_URI=

GEMINI_API_KEY=
```

---

### Run locally

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

## 🔐 Security

SubSense is built with security as a priority.

* Google OAuth Authentication
* Secure Session Management
* Server-side API Routes
* Environment Variable Protection
* SQL Injection Protection
* Input Validation
* Secure PDF Processing
* No Gmail credentials stored

---

## 📈 Roadmap

* [x] Landing Page
* [x] Google OAuth
* [x] Gmail Subscription Scanner
* [x] Bank Statement Scanner
* [x] AI Spending Insights
* [x] Interactive Dashboard
* [x] Responsive UI
* [ ] Email Notifications
* [ ] Auto Subscription Renewal Alerts
* [ ] Subscription Cancellation Assistant
* [ ] Multi-Currency Support
* [ ] Mobile Application
* [ ] Expense Forecasting
* [ ] Budget Planning
* [ ] Family Accounts

---

## 📸 Screenshots

| Landing Page   | Dashboard      |
| -------------- | -------------- |
| Add Screenshot | Add Screenshot |

| Gmail Scanner  | AI Insights    |
| -------------- | -------------- |
| Add Screenshot | Add Screenshot |

---

## ⚡ Performance

* ⚡ Next.js App Router
* ⚡ Server Components
* ⚡ Lazy Loading
* ⚡ Optimized Images
* ⚡ Fast Page Transitions
* ⚡ Production Optimized
* ⚡ TypeScript Strict Mode

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature/amazing-feature
```

3. Commit your changes

```bash
git commit -m "Add amazing feature"
```

4. Push

```bash
git push origin feature/amazing-feature
```

5. Open a Pull Request

---

## 👨‍💻 Author

**Allan Roy**

Cybersecurity & Full Stack Developer

* Building secure, AI-powered SaaS applications
* Passionate about Web Security, AI, and Modern Web Development

---

## ⭐ Support

If you found this project useful:

⭐ Star the repository

🍴 Fork it

🛠️ Contribute

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

### 💙 Built with Next.js • TypeScript • Supabase • Gemini AI

**Helping users save money, one subscription at a time.**

</div>
