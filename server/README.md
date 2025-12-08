# CP Analyzer Backend

Backend API for the CP Analyzer application.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   Copy `.env.sample` to `.env` and update values.
   
   Required variables:
   - `PORT`: Server port (default: 5001)
   - `DATABASE_URL`: MySQL connection string
   - `JWT_SECRET`: Secret key for JWT tokens
   - `GOOGLE_CLIENT_ID`: Google OAuth Client ID

3. Database Setup (Prisma):
   ```bash
   # Generate Prisma Client
   npx prisma generate
   
   # Push schema to database
   npx prisma db push
   ```

4. Run server:
   ```bash
   npm run dev
   ```

## API Endpoints

- `/api/auth`: Authentication (Signup, Login, Google)
- `/api/cf`: Codeforces API wrapper
- `/api/users`: User profile and bookmarks
