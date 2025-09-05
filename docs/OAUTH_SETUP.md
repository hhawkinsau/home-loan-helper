# OAuth Setup Guide

## Overview
The Home Loan Helper supports OAuth authentication with Google and GitHub. This provides users with familiar, secure login options.

## Setting Up OAuth

### Google OAuth Setup

1. **Go to Google Cloud Console**
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable Google+ API**
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it

3. **Create OAuth Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3001/api/v1/auth/google/callback` (development)
     - `https://yourdomain.com/api/v1/auth/google/callback` (production)

4. **Copy your credentials**
   - Copy the Client ID and Client Secret
   - Add them to your `.env` file

### GitHub OAuth Setup

1. **Go to GitHub Settings**
   - Visit [GitHub Developer Settings](https://github.com/settings/developers)
   - Click "New OAuth App"

2. **Configure the App**
   - Application name: "Home Loan Helper"
   - Homepage URL: `http://localhost:5174` (development)
   - Authorization callback URL: `http://localhost:3001/api/v1/auth/github/callback`

3. **Copy your credentials**
   - Copy the Client ID and Client Secret
   - Add them to your `.env` file

## Environment Configuration

1. **Copy the example environment file:**
   ```bash
   cp packages/web/.env.example packages/web/.env
   ```

2. **Add your OAuth credentials:**
   ```env
   VITE_API_URL=http://localhost:3001/api/v1
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   GITHUB_CLIENT_ID=your_github_client_id_here
   GITHUB_CLIENT_SECRET=your_github_client_secret_here
   ```

## Testing OAuth

1. **Start the API server:** `pnpm --filter api dev`
2. **Start the web server:** `pnpm --filter web dev`
3. **Navigate to:** http://localhost:5174
4. **Click "Continue with Google" or "Continue with GitHub"**

## Notes

- The Google button uses official Google branding guidelines
- The page is properly centered and responsive
- Security claims have been removed until proper certification
- OAuth only works when both frontend and backend are running
