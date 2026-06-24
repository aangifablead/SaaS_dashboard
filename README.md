# SaaS Dashboard

A modern, full-stack SaaS Dashboard template built with Next.js 16 (App Router), React 19, and Tailwind CSS v4. This platform features a complete authentication flow, team management, interactive analytics, and subscription handling.

## Features

- **Modern Tech Stack**: Built on the cutting edge with Next.js 16, React 19, and Tailwind CSS v4.
- **Authentication**: Secure login, registration, and session management powered by NextAuth.js (v5) and MongoDB.
- **Team Management**: Invite members via email, manage user roles (Admin/Member), suspend users, and handle account revocations.
- **Interactive Analytics**: Beautiful, responsive charts utilizing `recharts` for tracking page views, active sessions, and signup trends.
- **Billing & Subscriptions**: Integration-ready with Stripe for handling SaaS tier plans (Free, Pro, Enterprise).
- **Email Notifications**: Seamless email delivery via Resend/Nodemailer for team invitations and password resets.
- **Beautiful UI components**: Styled with Shadcn UI, customized for a premium dashboard aesthetic (vibrant charts, micro-animations, glassmorphism elements).
- **Dark Mode**: Fully supported dark/light theme toggling using `next-themes`.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) & [@base-ui/react](https://base-ui.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **Authentication**: [NextAuth.js (v5)](https://authjs.dev/) with `@auth/mongodb-adapter`
- **Charts**: [Recharts](https://recharts.org/)
- **Payments**: [Stripe](https://stripe.com/)
- **Email**: [Resend](https://resend.com/)

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- Node.js (v20 or higher)
- npm or pnpm
- MongoDB instance (local or Atlas)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd saas_dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your environment variables:
   ```env
   # Database
   MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/saas

   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   AUTH_SECRET=your_super_secret_string

   # Emails (Resend or SMTP)
   RESEND_API_KEY=your_resend_api_key

   # Stripe
   STRIPE_SECRET_KEY=your_stripe_secret_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_pub_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Core Features Breakdown

### Team Invitations
Admins can send email invitations to new members. Next.js server actions handle creating a secure one-time-use token, saving it to MongoDB, and sending the email link. When the recipient clicks the link, they are taken to a dedicated onboarding page.

### Dynamic Analytics
The analytics page features real-time, database-driven metrics. It automatically pulls `LoginEvents` to track active sessions, session durations, and user locations, plotting them elegantly on interactive charts.

### User Management
From the team settings page, Admins can view complete user profiles, change subscription plans, assign roles, or safely suspend/delete accounts. Actions are guarded by backend authorization checks.

## Project Structure

- `/src/app`: Next.js App Router pages and API endpoints.
- `/src/components`: Reusable UI components (buttons, dialogs, charts, layout headers).
- `/src/models`: Mongoose database schemas (User, Invite, LoginEvent).
- `/src/lib`: Utility functions, database connection instances, and Mongoose configurations.
- `/src/auth.ts`: NextAuth configuration and callback logic.

## License
MIT License
