# Deployment Guide

This project can be easily deployed to Vercel, taking advantage of its Serverless Functions for the Python backend and its static hosting for the React frontend.

## Prerequisites

- A [Vercel](https://vercel.com) account.
- [Vercel CLI](https://vercel.com/cli) installed (`npm i -g vercel`), or you can deploy via GitHub integration.

## Deploying via Vercel CLI (Recommended)

The project includes a `vercel.json` file in the root directory that automatically configures Vercel to build and serve both the React frontend and the FastAPI backend.

1. **Log in to Vercel:**
   ```bash
   vercel login
   ```

2. **Deploy the application:**
   From the root of the project (where `vercel.json` is located), run:
   ```bash
   vercel
   ```

3. **Follow the prompts:**
   - **Set up and deploy?** `Y`
   - **Which scope?** (Select your account)
   - **Link to existing project?** `N`
   - **What's your project's name?** `safeguard` (or whatever you prefer)
   - **In which directory is your code located?** `./` (Press Enter)
   - **Want to override the settings?** `N`

4. **Deploy to Production:**
   Once you're happy with the preview deployment, deploy it to production by running:
   ```bash
   vercel --prod
   ```

## How It Works

The `vercel.json` file orchestrates the deployment:
- **`@vercel/python`**: Deploys the FastAPI application located in `backend/main.py` as a Serverless Function. Vercel automatically installs the dependencies from `backend/requirements.txt`.
- **`@vercel/static-build`**: Builds the React application in `frontend-react` by running `npm run build` and serves the resulting `dist` folder.
- **Routes**: API requests (e.g., `/api/endpoints`) are rewritten to the Python backend, while all other requests serve the React frontend.

## Environment Variables

If your backend requires any environment variables (e.g., database connection strings, API keys), you can add them through the Vercel Dashboard under your project's **Settings -> Environment Variables**.

## Database Considerations

Currently, the backend uses a local SQLite database (`safeguard.db`). **SQLite is not suitable for serverless environments** like Vercel because the filesystem is ephemeral and read-only. 

For a true production deployment, you should:
1. Provision a PostgreSQL database (e.g., on Vercel Postgres, Supabase, Neon, or Render).
2. Update the database connection string in your backend to point to the remote PostgreSQL instance using an environment variable (e.g., `DATABASE_URL`).
