# Home Loan Helper API

Secure backend API for the Home Loan Helper application, built with Fastify, TypeScript, Prisma, and PostgreSQL.

## Features

- 🔐 **Zero-trust security** with passkey authentication and data encryption
- 🚀 **Modern stack**: Fastify, TypeScript, Prisma ORM, PostgreSQL
- 🔑 **Multiple auth methods**: WebAuthn/Passkeys, OAuth2 (Google, GitHub)
- 📚 **Auto-generated API docs** with OpenAPI/Swagger
- 🐳 **Docker ready** with docker-compose for development

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm
- Docker & Docker Compose (recommended)

### Development with Docker

1. **Start the database and API:**
   ```bash
   docker-compose up -d
   ```

2. **Run database migrations:**
   ```bash
   pnpm db:migrate
   ```

3. **Access the API:**
   - API: http://localhost:3001
   - API Docs: http://localhost:3001/docs
   - Database: localhost:5432

### Development without Docker

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your database URL and secrets
   ```

3. **Start PostgreSQL** (via Docker or local install)

4. **Generate Prisma client:**
   ```bash
   pnpm db:generate
   ```

5. **Run migrations:**
   ```bash
   pnpm db:migrate
   ```

6. **Start development server:**
   ```bash
   pnpm dev
   ```

## Scripts

| Command              | Description                           |
|---------------------|---------------------------------------|
| `pnpm dev`          | Start development server with hot reload |
| `pnpm build`        | Build TypeScript to JavaScript       |
| `pnpm start`        | Start production server              |
| `pnpm db:generate`  | Generate Prisma client               |
| `pnpm db:migrate`   | Run database migrations              |
| `pnpm db:reset`     | Reset database (dev only)           |
| `pnpm db:studio`    | Open Prisma Studio (database GUI)   |

## Architecture

### Security Model

- **Passkey Authentication**: WebAuthn for passwordless login
- **Data Encryption**: User data encrypted at rest
- **Row-Level Security**: Database-level access control
- **JWT Sessions**: Secure token-based authentication
- **Zero-Trust**: No implicit access, everything verified

### Database Schema

- **Users**: Core user accounts with encrypted data
- **Passkeys**: WebAuthn credentials storage
- **OAuth Accounts**: Third-party authentication linking
- **Sessions**: JWT token management

### API Structure

```
src/
├── server.ts          # Main server setup
├── controllers/       # Route handlers
├── services/          # Business logic
├── middleware/        # Auth, validation, etc.
├── utils/            # Utilities and helpers
└── types/            # TypeScript type definitions
```

## Environment Variables

See `.env.example` for all required environment variables.

**Critical for production:**
- `JWT_SECRET`: Strong random string for JWT signing
- `ENCRYPTION_KEY`: 32-byte base64 key for data encryption
- `DATABASE_URL`: PostgreSQL connection string

## API Documentation

Once running, visit http://localhost:3001/docs for interactive API documentation.

## License

MIT
