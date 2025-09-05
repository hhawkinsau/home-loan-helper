# API Integration Tests

These tests validate the live API endpoints and ensure our passkey-only authentication system works correctly.

## Test Scenarios

### 1. Health Check & Server Status
- ✅ API server responds on port 3001
- ✅ Health endpoint returns correct status
- ✅ Security headers are present
- ✅ CORS is configured correctly

### 2. Session Management
- ✅ Session cookies are HTTP-only and secure
- ✅ Invalid sessions are rejected
- ✅ Session cleanup works
- ✅ Rate limiting is active

### 3. User Registration Flow
- ✅ Anonymous user creation
- ✅ Email-based user creation
- ✅ Duplicate email handling
- ✅ WebAuthn options generation

### 4. Authentication Flow
- ✅ Session creation
- ✅ Session validation
- ✅ Logout functionality
- ✅ Multi-device session management

### 5. Security Validation
- ✅ No Auth.js/OAuth endpoints exist
- ✅ JWT endpoints are removed
- ✅ Helmet security headers
- ✅ Rate limiting enforcement

## Running Tests

```bash
# Run API integration tests
pnpm --filter api test:integration

# Run specific test suites
npm test -- --grep "Health Check"
npm test -- --grep "Session Management" 
npm test -- --grep "Authentication"
```
