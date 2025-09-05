# Authentication Migration Plan

## Current State Analysis
- Using `@fastify/oauth2` with incomplete implementation
- Custom JWT middleware
- Placeholder OAuth callbacks
- Manual user session management

## Recommended Migration to Passport.js

### 1. Install Passport Dependencies
```bash
pnpm add passport passport-google-oauth20 passport-github2 passport-local
pnpm add @types/passport @types/passport-google-oauth20 @types/passport-github2 @types/passport-local --save-dev
```

### 2. Benefits of Migration
- **Standardized OAuth Flow**: Passport handles the entire OAuth flow automatically
- **Multiple Strategies**: Easy to add new providers (Apple, Microsoft, etc.)
- **Session Management**: Built-in session handling with various stores
- **Security**: Proven security patterns and automatic CSRF protection
- **Documentation**: Extensive documentation and community support

### 3. Migration Steps

#### Phase 1: Setup Passport.js
- Install Passport and strategies
- Configure Fastify to work with Passport
- Set up session store (Redis/PostgreSQL)

#### Phase 2: Implement OAuth Strategies
- Google OAuth strategy
- GitHub OAuth strategy
- Local strategy for passkey fallback

#### Phase 3: Update Routes
- Replace custom OAuth routes with Passport routes
- Update authentication middleware
- Implement proper session handling

#### Phase 4: Frontend Integration
- Update OAuth button redirects
- Handle Passport callback responses
- Update authentication state management

### 4. Code Structure
```
src/
├── auth/
│   ├── strategies/
│   │   ├── google.strategy.ts
│   │   ├── github.strategy.ts
│   │   └── local.strategy.ts
│   ├── passport.config.ts
│   └── auth.middleware.ts
├── routes/
│   └── auth.routes.ts
└── services/
    └── user.service.ts
```

## Recommendation: Migrate to Passport.js
The current implementation is incomplete and would require significant custom development. Passport.js provides:
- Production-ready OAuth implementation
- Better security practices
- Easier maintenance and testing
- Industry standard approach

Would you like me to implement the Passport.js migration?
