# Kashew - Modern Invoicing System

Kashew is a modern invoicing system built with Next.js, Supabase, and Tailwind CSS. It allows you to manage clients, products, invoices, and generate reports.

![Kashew Logo](public/images/Kashew.png)

## Features

- **Client Management**: Add, edit, and manage your clients
- **Product & Service Catalog**: Maintain a catalog of your products and services
- **Invoice Generation**: Create professional invoices with customizable templates
- **Payment Tracking**: Track payment status and send reminders
- **Reports & Analytics**: Generate reports and visualize your business performance
- **AI-Powered Assistance**: Use AI to help generate invoices and analyze data

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **State Management**: React Context API
- **Authentication**: Supabase Auth with Google OAuth
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account

### Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/kashew.git
cd kashew
```

2. Install dependencies:

```bash
npm install
```

3. Create a Supabase project and set up the database:
   - Create a new project in Supabase
   - Go to the SQL Editor and run the SQL from `src/lib/schema.sql`
   - Enable Google OAuth in the Authentication settings

4. Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Run the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

The application uses the following tables:

- `clients`: Store client information
- `products`: Store product and service information
- `invoices`: Store invoice data with items as JSONB
- `reports`: Store report configurations and data
- `charts`: Store chart configurations and data

The complete schema is available in `src/lib/schema.sql`.

## Authentication

The application uses Supabase Authentication with:

- Email/Password authentication
- Google OAuth

Users can sign up, sign in, and reset their passwords.

## Project Structure

```
src/
├── app/                  # Next.js app router
│   ├── ai/               # AI-powered features
│   ├── auth/             # Authentication pages
│   ├── clients/          # Client management
│   ├── invoices/         # Invoice management
│   ├── products/         # Product management
│   ├── reports/          # Reports and analytics
│   └── settings/         # User settings
├── components/           # React components
│   ├── auth/             # Authentication components
│   ├── clients/          # Client-related components
│   ├── dashboard/        # Dashboard components
│   ├── invoices/         # Invoice-related components
│   ├── layout/           # Layout components
│   ├── modals/           # Modal components
│   ├── products/         # Product-related components
│   ├── reports/          # Report-related components
│   └── ui/               # UI components (shadcn/ui)
├── contexts/             # React contexts
├── lib/                  # Utility functions and services
│   ├── database.ts       # Database services
│   ├── models.ts         # TypeScript interfaces
│   ├── schema.sql        # Database schema
│   ├── supabase.ts       # Supabase client
│   └── utils.ts          # Utility functions
└── styles/               # Global styles
```

## Development Workflow

1. **Authentication**: Users sign up or log in
2. **Dashboard**: View key metrics and recent activity
3. **Clients**: Manage client information
4. **Products**: Manage products and services
5. **Invoices**: Create and manage invoices
6. **Reports**: Generate and view reports

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)
