# Multi-Tenant SaaS Starter Kit

A production-ready Multi-Tenant SaaS Starter Kit built with Next.js 14 (App Router), Prisma, NextAuth.js v5, Stripe, and Tailwind CSS.

## Features

- **Authentication**: Credentials, Google, and GitHub login using NextAuth.js v5.
- **Multi-Tenancy**: Organization creation, routing middleware, and role-based access control (RBAC).
- **Billing**: Stripe Checkout and Webhooks for managing subscriptions.
- **Emails**: Resend integration for transactional emails and organization invitations.
- **UI/UX**: Beautiful, responsive components using Tailwind CSS and shadcn/ui.
- **Database**: PostgreSQL with Prisma ORM.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Copy `.env.example` to `.env` and fill in your keys:
   ```bash
   cp .env.example .env
   ```
   You will need to set up:
   - A PostgreSQL database (e.g., Supabase, Neon).
   - Stripe Account (Secret Key and Webhook Secret).
   - Resend API Key.
   - GitHub/Google OAuth keys.

3. **Database Setup**
   Push the schema to your database and seed it:
   ```bash
   npx prisma db push
   npm run prisma:seed
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Architecture & Project Structure

- `src/app/(auth)`: Login and registration flows.
- `src/app/(dashboard)`: Protected routes and dashboard layout.
- `src/app/api`: API routes, including NextAuth and Stripe Webhooks.
- `src/components`: Reusable UI components from shadcn/ui and custom components.
- `src/actions`: Server actions for database operations and server-side logic.
- `prisma/`: Database schema and seed scripts.
# SaaS_dashboard
