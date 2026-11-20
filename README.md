# Vantrix Screen Marketing Platform

A dark-mode, enterprise-grade B2B SaaS marketing site for **Vantrix Screen** — a technical assessment platform featuring AI-assisted evaluation, coding challenges, integrity monitoring, and recruiter-first workflows.

---

## 1. Quick Start

### Prerequisites
- Node.js >= 18.0.0 (v22 LTS recommended)
- npm >= 9.0.0

### Installation & Local Development
```bash
# Install dependencies
npm install

# Start local development server (http://localhost:3000)
npm run dev

# Run unit and integration tests
npm test

# Run code linter
npm run lint

# Check code formatting
npm run format:check

# Run production build
npm run build

# Run security credential scan & bundle budget audit
npm run security:scan
npm run budget:check

# Preview production build locally
npm run preview
```

---

## 2. Environment Variables & Modes

Configuration is managed via `.env` (copy from `.env.example`):

| Variable | Default | Purpose |
|---|---|---|
| `VITE_APP_ENV` | `development` | Environment name |
| `VITE_USE_MOCKS` | `true` | When `true`, all booking and payment flows use local realistic mock adapters |
| `VITE_API_BASE_URL` | `https://api.vantrix.ai` | Base URL for future production backend endpoints |
| `VITE_RAZORPAY_KEY_ID` | `rzp_test_...` | Public Razorpay Key ID (lazy loaded on `/checkout`) |

> **Security Note:** No secrets or private tokens are packaged into the client bundle. A CI script (`scripts/secret-scan.js`) prevents accidental credential leaks.

---

## 3. Architecture & Slices

The site is built with **Vite + React 18 (ES2022)** and strict **JSDoc typedefs** (`// @ts-check`).
- **Routing:** React Router v6 with route-level code splitting (`React.lazy`).
- **Styling:** Tailwind CSS with custom design tokens (`#070713`, Manrope font, glass recipes) and tailored shadcn/ui primitives.
- **Conversion Flows:**
  - `/book-demo` & modal: 45-min demo booking with Google Calendar availability model, slot conflict handling (HTTP 409), and client-side `.ics` generator.
  - `/checkout`: Plan validation, billing form, Razorpay integration, server-side signature verification, and short-lived onboarding token issuance.
  - `/onboarding`: Post-purchase architecture setup scheduler.
  - **FAQs Section (Added Value-Add Feature):** We have added a dedicated **Frequently Asked Questions (FAQ)** section (`src/features/faq/FaqSection.jsx`), which was **not present on the original Vantrix landing page**. It provides an interactive, accessible glass accordion addressing enterprise procurement objections, anti-cheating integrity checks, deployment timelines, data security, billing cycles, and refund terms (configured via `src/config/faq.js`).


