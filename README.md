# SaaS Dashboard

A full-stack SaaS Dashboard template built with Next.js 16 (App Router), React 19, and Tailwind CSS v4.

## Features

- **Authentication**: NextAuth.js (v5) with MongoDB adapter for secure login and session management.
- **Team Management**: Invite members via email, manage user roles (Admin/Member), and handle account suspension or deletion.
- **Analytics**: Dynamic charts (via Recharts) tracking active sessions and signups based on user login events.
- **Billing**: Ready for Stripe integration to manage tiered plans (Free, Pro, Enterprise).
- **Email**: Resend / Nodemailer configured for sending secure, token-based team invitations.
- **UI Components**: Shadcn UI styled with Tailwind CSS v4 for a clean, responsive, and accessible layout.

## Tech Stack

- **Framework:** Next.js 16.2
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** MongoDB via Mongoose
- **Authentication:** Auth.js (NextAuth)

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB instance (Atlas or local)
- Resend API key (for emails)

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd saas_dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory and add the following keys:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_URL=http://localhost:3000
   AUTH_SECRET=your_auth_secret

   RESEND_API_KEY=your_resend_key
   
   STRIPE_SECRET_KEY=your_stripe_secret
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_public
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `src/app`: Next.js App Router pages and API endpoints.
- `src/components`: Reusable UI components.
- `src/models`: Mongoose database schemas.
- `src/lib`: Utilities and database configuration.
- `src/auth.ts`: Authentication setup and callbacks.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
