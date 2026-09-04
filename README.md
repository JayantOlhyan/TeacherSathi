# TeacherSathi 🎓 

> **Teachers ka Superpower | शिक्षकों का सुपरपावर**
> A bilingual (English/Hindi) digital teaching companion tailored for Indian school educators.

## 🚀 Project Status

**Status: Frontend MVP Prototype**

TeacherSathi is currently an interactive frontend prototype built with Next.js 14. It is designed to demonstrate high-fidelity UI/UX for smart classrooms. 
* **Authentication** is implemented using Supabase Auth.
* **Database/Backend** is not yet implemented. Content data (NCERT syllabus, quizzes) is served via static JSON files, and administrative state is mocked using browser `localStorage`.
* **AI Pipelines & Payments** (Razorpay) shown in the UI are simulated mocks for demonstration purposes.

---

## 🎯 Why This Project Exists

TeacherSathi solves the problem of resource fragmentation for Indian educators. Unlike hardware-based smartboard solutions or generic AI tools, TeacherSathi is built to run entirely in the browser, optimized for 75-inch smart classroom displays, providing NCERT-aligned content, bilingual support, and interactive quizzes without requiring complex setups.

---

## ✨ Features Inventory

### 🟢 IMPLEMENTED (Frontend & Auth Only)
* **Authentication Flow**: Login/Signup via Email OTP and Google OAuth via Supabase.
* **Smartboard Kiosk UI**: A Kiosk QR-code interface for smartboard authentication (`/classroom`).
* **Bilingual UI**: Full Internationalization (i18n) via `next-intl` supporting English and Hindi.
* **Content Delivery (Mocked Data)**:
  * **Chapter Hubs**: Displays study time, PDFs, videos, and quizzes for NCERT subjects based on hardcoded JSON data.
  * **Interactive Quizzes**: Client-side MCQ engine with immediate feedback, confetti effects, and local scoring.
* **Whiteboard Integration**: In-browser drawing using the `@excalidraw/excalidraw` package.
* **Premium UI/UX**: High-quality animations via `framer-motion` and `gsap`, utilizing `lucide-react` icons.

### 🟡 PARTIALLY IMPLEMENTED / MOCKED
* **Admin Dashboard**: Content management, class assignments, and audit logs work visually but only persist data in the browser's `localStorage` (`src/lib/adminStore.ts`).
* **AI Video Generation Pipeline**: The pipeline control dashboard (`/admin/pipeline`) is a visual mock using hardcoded arrays to simulate backend job processing.
* **Pricing/Checkout**: Razorpay integration is a frontend alert mock. No actual payment gateway is connected.

### 🔴 PLANNED (Not Yet Implemented)
* Real backend database (e.g., Supabase Postgres) for user progress, quiz scores, and content generation.
* Real AI integration for content generation, AI Video, and "Genie Chat".
* Secure roles and permissions (RBAC) via backend policies.

---

## 🏗️ Architecture

```text
User (Teacher/Student)
       ↓
Next.js App Router (React 18)  <-- [Handles Routing, i18n, Animations]
       ↓
Client-Side Logic & State
  ├── Supabase Auth (OAuth/OTP verification)
  ├── LocalStorage (Admin state persistence)
  └── Static JSON files (Quizzes, Syllabus data)
```

---

## 💻 Tech Stack

* **Frontend Framework**: Next.js 14.2 (App Router)
* **Language**: TypeScript
* **Styling**: Tailwind CSS
* **Animations**: Framer Motion, GSAP
* **Icons**: Lucide React
* **Authentication**: Supabase Auth (`@supabase/supabase-js`)
* **Internationalization**: `next-intl`
* **Interactive Tools**: `@excalidraw/excalidraw`

---

## 📂 Repository Structure

Key directories necessary for understanding and modifying the project:

```text
teacher-sathi/
├── public/                 # Static assets, icons, offline PWA files
│   ├── qa/                 # Hardcoded QA JSON files
│   └── quizzes/            # Hardcoded Quiz JSON files
├── src/
│   ├── app/
│   │   └── [locale]/       # Core application routes (i18n enabled)
│   │       ├── admin/      # Admin dashboard UIs (localStorage driven)
│   │       ├── auth/       # Authentication confirmation routes
│   │       ├── classroom/  # Smartboard Kiosk QR interface
│   │       ├── content/    # NCERT Content viewer (Video, QA, Quiz)
│   │       └── dashboard/  # Main Teacher dashboard
│   ├── components/         # Reusable React UI components
│   │   ├── admin/          # Admin specific layouts
│   │   ├── auth/           # Modals and QR implementations
│   │   └── landing/        # Landing page marketing components
│   ├── i18n/               # next-intl configuration
│   └── lib/
│       ├── data/           # Hardcoded syllabus and chapter data
│       ├── adminStore.ts   # LocalStorage-based mock database for Admin
│       └── supabase.ts     # Supabase client initialization
├── .env.example            # Environment variables template
├── next.config.mjs         # Next.js configuration
├── package.json            # Dependencies
└── tailwind.config.ts      # Tailwind styling configuration
```

---

## ⚙️ Prerequisites

* **Node.js**: v18+ (verified with Next.js 14 requirements)
* **Package Manager**: npm (verified via `package-lock.json`)
* **Supabase Project**: Requires a Supabase account for Authentication.

---

## 🔐 Environment Variables

Create a `.env.local` file based on `.env.example`:

| Variable | Required | Purpose | Example |
| -------- | -------- | ------- | ------- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL for Auth | `https://your-project-id.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`| Yes | Supabase public key for Auth | `eyJhbGciOiJIUzI1...` |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | No | Placeholder for future payments | `rzp_test_your_key_id` |

*(Note: The app will run without Supabase, but Authentication features will be disabled/throw warnings.)*

---

## 🛠️ Local Development

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd "teacher sathi final"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   Create `.env.local` and add your Supabase credentials.

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Access the application:**
   Open `http://localhost:3000` in your browser.

---

## 🗄️ Database & Authentication

**Database:**
There is **no backend database** currently connected for application data. All application data (Admin creations, classes, content) is either statically served from `src/lib/data` and `public/` or temporarily saved in the browser's `localStorage`.

**Authentication:**
The project uses Supabase Auth.
* Supports OTP via email.
* Supports Google OAuth.
* Authentication state is verified on the client side via standard Supabase session checks.

---

## 🛡️ Security

**Current Security Implementations:**
* **Authentication**: Secured by Supabase.

**⚠️ Known Security Limitations:**
* **No Authorization/RBAC**: Because the admin state is stored in `localStorage` and routes are primarily frontend-driven without API enforcement, there is no true server-side role-based access control (RBAC).
* **Data Persistence**: Data is easily manipulable by end-users since it resides in `localStorage`. 

*Do not deploy this prototype for real users expecting secure data isolation until a backend is implemented.*

---

## 🧪 Testing

No automated testing framework (Jest, Cypress, Playwright) is currently configured or implemented in the repository.

---

## 🚀 Deployment

The project can be deployed natively to Vercel or Netlify.
A `netlify.toml` file exists, indicating previous configuration for Netlify deployment.

**Build Command:**
```bash
npm run build
```

---

## ⚠️ Known Limitations

1. **Static Data**: The AI Pipeline, Video generation, Quizzes, and NCERT content are hardcoded representations. 
2. **State Loss**: Admin configurations (new classes, subjects) will be lost if the user clears their browser cache.
3. **No Backend API**: There are no `/api` routes or server actions implemented. 
4. **No Real AI**: Despite "AI-powered" messaging in the UI, no actual LLM or video-generation APIs are integrated.

---

## 🤖 AI / Developer Orientation

If you are an AI agent or a developer tasked with building out the backend:

* **To add a real Database:** Replace `src/lib/adminStore.ts` logic with actual API calls or Server Actions querying a PostgreSQL database.
* **To implement the AI Pipeline:** You will need to create Next.js API routes (`src/app/api/...`) or Server Actions to handle queueing and generation logic, replacing the hardcoded arrays in `src/app/[locale]/admin/pipeline/page.tsx`.
* **To add new Content:** Currently, you must manually edit the JSON structures in `src/lib/data/` and `public/quizzes/`.
* **UI/UX Changes:** The landing page components are highly segmented in `src/components/landing/`. Most dashboard logic is localized within `src/app/[locale]/dashboard`.

---

## 📄 License

*License unknown. No `LICENSE` file is present in the repository.*
