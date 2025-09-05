# Auth.js to Passkey-Only Migration Plan

## 🎯 Goal: Private, Passkey-First, Single-App Setup
- Remove all third-party OAuth (Google, GitHub)
- Remove Auth.js complexity  
- Pure Fastify + WebAuthn + server sessions
- Zero-trust, minimal-PII architecture

## 📋 Step-by-Step Execution Plan

### Phase 1: Package Cleanup (Remove Dependencies)
- [ ] Remove: `next-auth`, `@fastify/oauth2`, `@fastify/jwt`
- [ ] Remove: `@auth/core`, `@auth/prisma-adapter` 
- [ ] Keep: `@simplewebauthn/server` (upgrade to latest)
- [ ] Add: `@fastify/helmet`, `@fastify/rate-limit`, `@fastify/csrf-protection`

### Phase 2: Legacy Code Removal
- [ ] Delete: `src/routes/auth.routes.ts` (old custom auth)
- [ ] Delete: `src/routes/oauth.routes.ts` (OAuth routes)
- [ ] Delete: `src/routes/auth.routes.new.ts` (Auth.js routes)
- [ ] Delete: `src/controllers/auth.controller.ts`
- [ ] Delete: `src/services/oauth.service.ts`
- [ ] Delete: `src/middleware/auth.middleware.ts` (old JWT)
- [ ] Delete: `src/middleware/auth.middleware.new.ts` (Auth.js)
- [ ] Delete: `src/auth.config.ts`

### Phase 3: Clean Prisma Schema
- [ ] Remove Auth.js tables: `Account`, `Session`, `VerificationToken`
- [ ] Keep: `User`, `Passkey` (enhanced)
- [ ] Add: `ServerSession` (opaque cookie sessions)
- [ ] Migration: Drop old tables, create new minimal schema

### Phase 4: Pure WebAuthn Implementation
- [ ] Create: `src/auth/webauthn.service.ts` (registration + authentication)
- [ ] Create: `src/auth/session.service.ts` (server-side sessions)
- [ ] Create: `src/routes/auth.routes.ts` (new, clean passkey-only routes)
- [ ] Create: `src/middleware/session.middleware.ts` (session validation)

### Phase 5: Security Hardening
- [ ] Add security headers (Helmet)
- [ ] Add rate limiting on auth endpoints
- [ ] Add CSRF protection
- [ ] Lock CORS to exact origin
- [ ] HTTP-only, Secure, SameSite=Strict cookies

### Phase 6: Docker & Infrastructure
- [ ] Upgrade: `node:22-alpine`
- [ ] Add: non-root user in container
- [ ] Add: health checks
- [ ] Update: docker-compose with secure defaults
- [ ] Remove: default postgres credentials

### Phase 7: Frontend Updates
- [ ] Remove: OAuth buttons (Google, GitHub)
- [ ] Update: Auth context to use pure session API
- [ ] Update: Login form to be passkey-only
- [ ] Add: WebAuthn registration flow

### Phase 8: Environment & Config
- [ ] Remove: OAuth environment variables
- [ ] Add: Session secrets, WebAuthn RP settings
- [ ] Update: .env.example with new structure

## 🏗️ New Architecture

### Authentication Flow
```
1. User visits app
2. Click "Sign In" → WebAuthn get() challenge
3. Device authenticates → API validates assertion
4. API creates server session → HTTP-only cookie
5. All requests include session cookie
6. Logout clears server session + cookie
```

### Security Properties
- ✅ No third-party dependencies
- ✅ No PII in sessions/tokens
- ✅ Opaque session tokens
- ✅ Device-bound authentication
- ✅ Zero-trust endpoint guards
- ✅ Rate-limited auth endpoints
- ✅ Secure cookie configuration

### Recovery Strategy
- Primary: Multi-device passkey sync (iCloud/Google Password Manager)
- Fallback: Multiple passkeys per user
- Future: Admin recovery (if needed)

---

## 🚀 Ready to Execute?

This plan will:
1. **Remove ~500 lines** of complex Auth.js/OAuth code
2. **Add ~200 lines** of focused WebAuthn code
3. **Eliminate** all third-party auth dependencies
4. **Maximize** privacy and security
5. **Simplify** the entire auth stack

**Shall we begin with Phase 1: Package Cleanup?**
