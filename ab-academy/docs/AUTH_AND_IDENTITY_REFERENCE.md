# Auth and Identity Reference

## Current Careers MVP Rule

- Keep the existing Artisan `/careers` login and portal access unchanged.
- Do not add account creation, Academy SSO, a new user model, or a new session flow.
- T99 and resources work must remain behind the existing Artisan portal boundary.

## Confirmed Academy Model

- Users authenticate with Academy email/password credentials.
- Passwords use bcrypt with 12 rounds; verification occurs in `src/app/api/auth/login/route.ts`.
- Academy stores only a SHA-256 hash of each random 32-byte session token.
- The raw token is held in the `aba_session` cookie: HTTP-only, host-only, `SameSite=Lax`, secure in production, 30-day lifetime.
- Server code validates the database session, expiration, active user, and role.
- Account/IP login throttling and auth audit events are stored in PostgreSQL.
- Accounts are administratively provisioned; public registration, social login, password reset, and MFA are not implemented.

## Deferred Artisan Integration Model

- This model is not required for the current careers MVP.
- Academy remains the credential and Academy-role authority.
- Artisan starts a PKCE authorization-code flow.
- Academy authenticates the user and permits only `EMPLOYEE` or `ADMIN`.
- Artisan exchanges the short-lived, one-time code and creates its own host-only session.
- Artisan must validate its own `state` and retain its PKCE verifier.

## Do Not Reimplement in Artisan

- Academy password collection or verification
- Academy password hashes or session-token handling
- A duplicate Academy user/role authority
- Direct Neon access or copied Academy schema
- Shared cookies across Academy and Artisan subdomains
- Client-side-only enforcement of Academy portal eligibility

Any replacement or parallel auth design requires an accepted cross-repo decision before implementation.

## Verify Before Building

- SSO enabled environments
- Registered redirect URI for the target environment
- Client secret distribution and rotation process
- Artisan session lifetime, revocation, and logout behavior
- Cross-repo account deactivation propagation

These contracts are `Unclear — confirm with team` unless a deployed configuration or accepted decision confirms them.
