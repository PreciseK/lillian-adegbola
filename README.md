# Lillian Adegbola Professional Website & Member Portal

A premium, unified web application for leadership coach and keynote speaker Lillian Adegbola. This codebase consolidates the public-facing professional website and the private members portal into a single React SPA powered by Supabase.

---

## 🌟 Key Features

### 1. Public Professional Website
- **Modern Responsive Design:** Crafted with high-end typography, smooth transitions, and premium color palettes.
- **Leadership Blog:** Dynamic post management, featured imagery, and built-in SEO metadata customization.
- **Consultation Bookings:** Form scheduling with relational backend logging.
- **Client Engagement:** Secure contact forms, newsletter subscription widgets, and testimonial showcases.

### 2. Private Member Portal (`/portal`)
- **Dashboard:** Unified membership overview with action-driven KPI cards.
- **Self-Coaching Tools:** Custom goal tracker, interactive schedule calendar, and personal development analytics.
- **Learning & Shop:** Immersive courses catalog and product shop for coaching assets.
- **Community Forum:** Threaded community board for member networking.
- **Account & Security:** Custom subscription tiers, member profile customization, and secure authentication.

### 3. Conjoined Admin Control Center (`/admin`)
- Combined management controls for website operations (blog posts, consultations, contact logs, testimonials, and profiles) and portal content (users, orders, support tickets, course curriculum, shop inventory, and system diagnostics).
- Unified admin authentication checks via database-level admin role permissions.

---

## 🛠️ Technology Stack

- **Frontend:** React 18 (Vite, Tailwind CSS, Framer Motion)
- **Backend:** Supabase (Auth, Postgres, Realtime, Storage)
- **Routing:** React Router v6 (`BrowserRouter` with rewrite configuration)
- **Emailing:** Resend Integration

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/PreciseK/lillian-adegbola.git
cd lillian-adegbola

# Install packages
npm install
```

### 2. Configure Environment Variables
Copy the `.env.example` file to `.env` and fill in your connection credentials:
```bash
cp .env.example .env
```
- **`VITE_SUPABASE_URL`**: Your remote Supabase Project URL.
- **`VITE_SUPABASE_ANON_KEY`**: Your public/anonymous API key.
- **`RESEND_API_KEY`**: API key for sending email notifications.

### 3. Deploy Supabase Database & Storage
This repository uses the Supabase CLI to maintain migrations. To apply all local table structures, RLS rules, and storage configurations to your remote project:
```bash
# Push database structure & storage migrations
npx supabase db push
```
The migration will automatically:
1. Initialize database tables (blogs, products, courses, orders, support tickets, profiles).
2. Configure a public storage bucket named `website-images`.
3. Set up Row Level Security (RLS) policies allowing public selects, but restricting write access strictly to admin users.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📦 Deployment Guide

### Vercel Deployment
The application is pre-configured for Vercel with SPA routing rewrite rules in `vercel.json`.
1. Push your branch to GitHub.
2. Connect your repository to Vercel.
3. Configure the environment variables (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`) in the project settings.
4. Deploy!

### cPanel / Apache Deployment
1. Build the production assets:
   ```bash
   npm run build
   ```
2. Upload all files from the `dist/` directory directly into your server's `public_html` folder.
3. Make sure to upload the `.htaccess` file (located in `public/.htaccess`) to the root of `public_html`. This ensures subpaths like `/portal` and `/admin` redirect correctly to `index.html` for client-side routing on page refresh.

---

## 🔐 Administrative Access
- **Admin Panel URL:** `/admin`
- Logging in requires an authenticated account that has `role = 'admin'` configured in the `profiles_la2024` database table.

---

Built with ❤️ for transformational leadership.