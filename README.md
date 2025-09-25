# Next.js + Supabase + Drizzle Project

A modern full-stack application built with Next.js 15, Supabase, Drizzle ORM, and Tailwind CSS, ready for deployment on Vercel.

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: Supabase (PostgreSQL)
- **ORM**: Drizzle ORM
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
- **Language**: TypeScript

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- A Supabase account and project

## 🛠️ Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Dependencies are already installed, but if you need to reinstall:
npm install
```

### 2. Set up Supabase

1. Go to [Supabase](https://supabase.com) and create a new project
2. Go to **Settings > API** in your Supabase dashboard
3. Copy your project URL and anon/public key

### 3. Configure Environment Variables

1. Copy the environment template:
   ```bash
   cp env.template .env.local
   ```

2. Fill in your Supabase credentials in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
   ```

### 4. Set up Database Schema

Push the database schema to your Supabase database:

```bash
npm run db:push
```

This will create the following tables:
- `users` - User management
- `posts` - Blog/content posts

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view your application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard page
│   ├── users/            # Users management page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── lib/
│   ├── db/               # Database configuration
│   │   ├── index.ts      # Drizzle database instance
│   │   └── schema.ts     # Database schema definitions
│   └── supabase/         # Supabase client configuration
│       ├── client.ts     # Browser client
│       └── server.ts     # Server client
```

## 🗄️ Database Schema

The project includes example schemas for:

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  avatar TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

### Posts Table
```sql
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  published BOOLEAN DEFAULT FALSE NOT NULL,
  author_id INTEGER REFERENCES users(id) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Drizzle migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio

## 🚀 Deployment to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy to Vercel

1. Go to [Vercel](https://vercel.com) and import your GitHub repository
2. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DATABASE_URL`
3. Deploy!

### Environment Variables in Vercel

Add these in your Vercel project settings:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key |
| `DATABASE_URL` | Your Supabase database connection string |

## 📱 Features

- ✅ **Responsive Design** - Mobile-first with Tailwind CSS
- ✅ **Type Safety** - Full TypeScript support
- ✅ **Database Integration** - Drizzle ORM with Supabase
- ✅ **Authentication Ready** - Supabase auth setup
- ✅ **Modern UI** - Beautiful, accessible components
- ✅ **Deployment Ready** - Vercel configuration included

## 🎨 Pages

- **Home** (`/`) - Landing page with project overview
- **Dashboard** (`/dashboard`) - Admin dashboard with stats
- **Users** (`/users`) - User management interface

## 🔧 Customization

### Adding New Tables

1. Define schema in `src/lib/db/schema.ts`
2. Run `npm run db:push` to update database
3. Create API routes in `src/app/api/`

### Styling

The project uses Tailwind CSS with a modern, responsive design. Customize colors and styles in `tailwind.config.js`.

### Authentication

The Supabase client is configured for authentication. Add login/signup pages using Supabase auth methods.

## 📚 Next Steps

1. **Authentication**: Implement user login/signup
2. **API Routes**: Create RESTful APIs
3. **Real-time**: Add Supabase real-time subscriptions
4. **File Upload**: Implement Supabase Storage
5. **Testing**: Add unit and integration tests

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project as a starting point for your applications.