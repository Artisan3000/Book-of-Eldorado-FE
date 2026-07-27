# Academy Authentication and Artisan SSO Plan

Last updated: July 27, 2026

## Objective

Harden the existing Artisan Academy authentication system and add a secure,
first-party authorization-code bridge that lets eligible Academy accounts sign
in to the employee experience on `www.artisanbarber.com`.

The Academy application remains the owner of user credentials, identity,
Prisma models, and Neon migrations. The Artisan application must not receive
passwords, Academy session tokens, or direct Neon credentials.

## Status

| Phase | Status | Notes |
| --- | --- | --- |
| Discovery and architecture | Completed | Local code, Git history, prototype SQL, live Prisma schema, and deployment assumptions reviewed. |
| Phase 1A: Employee role support | Completed | Deployed to production and verified through login, protected-page, logout, and role smoke tests. |
| Phase 1B: Authentication hardening | Completed | Deployed to production after the deterministic Prisma-generation fix and smoke-tested successfully. |
| Phase 2: Artisan authorization bridge | In progress | Implement PKCE authorization-code issuance and exchange, disabled by default. |
| Artisan callback and session | Deferred | Implement later in the Artisan frontend repository. |
| Employee onboarding platform | Deferred | Translate the approved parts of the onboarding prototype after SSO is stable. |

## Confirmed decisions

- Academy production origin: `https://academy.artisanbarber.com`.
- Artisan production origin: `https://www.artisanbarber.com`.
- Both applications are deployed on Vercel.
- Accounts are provisioned administratively; public registration is out of
  scope.
- The existing `ADMIN` role is shared across Academy administration and the
  future Artisan onboarding administration experience.
- Add an `EMPLOYEE` role.
- `EMPLOYEE` receives the same Academy experience and route access as
  `STUDENT`.
- Only `EMPLOYEE` and `ADMIN` may authorize the Artisan employee portal.
- `STUDENT`, `INSTRUCTOR`, and `MEMBER` may not authorize the Artisan employee
  portal.
- `MEMBER` retains its current Academy member experience.
- Academy remains the sole owner of credential verification and database
  migrations.
- Artisan will establish its own host-only session after exchanging a
  short-lived Academy authorization code.
- Academy and Artisan cookies will not be shared across subdomains.
- The onboarding prototype is a domain reference, not production-ready SQL.
- Phase 1 used `academy-auth-bridge`. Phase 2 is implemented from `main` on
  `agent/academy-sso-phase-2` for client review and merge.

## Current implementation

The Academy application currently uses:

- Next.js 16.2.7 and React 19.2.7.
- Prisma and Prisma Client 6.19.3.
- PostgreSQL hosted by Neon.
- bcrypt 6.0.0 with 12 hashing rounds.
- Random 32-byte opaque session tokens.
- SHA-256 session-token hashes stored in Neon.
- Host-only, HTTP-only, secure-in-production, `SameSite=Lax` cookies.
- Thirty-day database-backed sessions.
- Server-side role enforcement in protected layouts.
- Centralized role groups with `EMPLOYEE` sharing the Student experience.
- Distributed account and IP login throttling backed by Neon.
- Secret-safe authentication audit events.
- Exact-origin and JSON content-type enforcement for browser mutations.
- Safe internal login continuation handling.
- Opportunistic rejection and database cleanup of expired sessions.

The live Neon schema was inspected read-only on July 21, 2026. It matched the
checked-in Prisma schema exactly before Phase 1, with both historical migrations
applied and no schema drift. The reviewed Phase 1 migration was subsequently
applied and verified. Production now has all three checked-in migrations. No
table records were inspected or modified during verification.

Remaining gaps:

- No database-backed route or concurrency test environment is configured.
- No tracked CI or migration-deployment automation exists.
- `npm run build` generates Prisma Client and then runs `next build`.
- `npm run db:deploy` runs `prisma migrate deploy` separately.
- Phase 2 is implemented locally and remains disabled pending its database,
  configuration, deployment, and integration-test gates.

## Role and authorization policy

The current Prisma enum is:

```prisma
enum Role {
  ADMIN
  INSTRUCTOR
  STUDENT
  EMPLOYEE
  MEMBER
}
```

Target behavior:

| Role | Academy destination and access | Artisan employee portal |
| --- | --- | --- |
| `ADMIN` | `/admin`; retains existing broad access | Allowed |
| `INSTRUCTOR` | `/instructor` | Denied |
| `STUDENT` | `/student/dashboard` | Denied |
| `EMPLOYEE` | `/student/dashboard`; same access as Student | Allowed |
| `MEMBER` | `/member`; existing behavior retained | Denied |

Role groups are centralized rather than repeated throughout route files:

```ts
STUDENT_EXPERIENCE_ROLES = ["STUDENT", "EMPLOYEE", "ADMIN"]
INSTRUCTOR_ROLES = ["INSTRUCTOR", "ADMIN"]
MEMBER_ROLES = ["MEMBER", "ADMIN"]
ARTISAN_PORTAL_ROLES = ["EMPLOYEE", "ADMIN"]
```

The Academy authorization endpoint must enforce `ARTISAN_PORTAL_ROLES` on the
server. Hiding the login button or rejecting users only in Artisan is not
sufficient.

## Phase 1A: Employee role support

Status: Completed

Implementation, migration, automated checks, production deployment, and
end-to-end smoke verification are complete.

### Scope

- [x] Add `EMPLOYEE` to the Prisma `Role` enum.
- [x] Create and apply an additive migration using PostgreSQL
  `ALTER TYPE ... ADD VALUE`.
- [x] Add the Employee role home route: `/student/dashboard`.
- [x] Centralize role groups.
- [x] Update every student layout, page, and server-side guard to accept
  `EMPLOYEE`.
- [x] Preserve Instructor, Member, and Admin behavior in code and unit tests.
- [x] Keep seed behavior unchanged; a dedicated development Employee is not
  currently required.
- [x] Add tests for role destinations and allowed-role groups.

### Acceptance criteria

- [x] Existing role destinations and exact role groups pass unit tests.
- [x] Employee receives the Student route group in code and unit tests.
- [x] Employee is excluded from Admin, Instructor, and Member-only role groups.
- [x] Student, Instructor, and Member are excluded from Artisan eligibility.
- [x] The Prisma schema validates and Prisma Client generates successfully.
- [x] The applied migration is additive and contains no destructive statements.
- [x] Lint, typecheck, unit tests, and production build pass.
- [x] Existing roles and Employee behavior have no observed production
  regression after deployment.

## Phase 1B: Authentication hardening

Status: Completed

Implementation, migration, automated checks, production deployment, and
end-to-end authentication smoke verification are complete.

### Data model

Phase 1 added two narrowly scoped Prisma models.

`LoginThrottle` stores distributed rate-limit state using hashed identifiers.
It must not store raw passwords, raw email addresses, or raw IP addresses.

Implemented fields:

- `keyHash` primary key.
- Failure count.
- Window start.
- Optional block expiration.
- Updated timestamp.

`AuthEvent` is an append-only security audit trail.

Implemented event categories:

- Login succeeded.
- Login failed.
- Login throttled.
- Logout.
- Password changed.
- Authorization code issued.
- Authorization code exchanged.
- Authorization exchange rejected.

Audit records must not contain passwords, raw session tokens, raw
authorization codes, client secrets, or complete request bodies.

### Request-security utilities

Implemented server-only helpers for:

- Normalized email handling.
- Safe internal redirect validation.
- Same-origin validation for cookie-authenticated mutations.
- JSON content-type enforcement.
- Client IP extraction.
- HMAC hashing of rate-limit and audit identifiers.
- Consistent public authentication errors.
- `Cache-Control: no-store` authentication responses.

On Vercel, production IP throttling may trust Vercel's overwritten
`x-forwarded-for` header. Local development must use a conservative fallback.

### Implemented login throttling

- Apply account/email and client-IP limits independently.
- Store only keyed hashes of normalized identifiers.
- Use temporary backoff, not permanent account lockout.
- Keep credential failure messages generic.
- Make limits configurable through server-only environment variables.
- Reset or reduce applicable failure state after a successful login.
- Return a bounded `Retry-After` response when throttled.

### Implemented session lifecycle

- Preserve opaque random session tokens and database token hashes.
- Reject invalid or expired sessions. Route handlers that encounter a stale
  session clear the cookie; public Server Components cannot safely mutate it.
- Opportunistically delete the referenced expired session.
- Avoid a broad cleanup query on each page request.
- Preserve revocation of other sessions after a password change.
- Add audit events for session-sensitive actions.

### Implemented safe continuation

The repaired login continuation flow:

- Accept only same-origin paths beginning with a single `/`.
- Reject schemes, hostnames, protocol-relative paths, backslashes, control
  characters, and malformed encodings.
- Fall back to the authenticated user's role home route.
- Never send an external SSO callback through the ordinary `next` parameter.

### Implemented code organization

New server-only modules under `src/lib/auth/` cover:

- Request security.
- Redirect validation.
- Login throttling.
- Audit events.
- Authentication response helpers.

Updated routes include:

- `src/app/api/auth/login/route.ts`
- `src/app/api/auth/logout/route.ts`
- `src/app/api/auth/change-password/route.ts`
- `src/app/api/account/name/route.ts`
- `src/app/(account)/login/page.tsx`
- `src/lib/session.ts`

### Acceptance criteria

- [x] Distributed throttling state is implemented for account and IP buckets.
- [x] Unknown, inactive, and wrong-password accounts use generic public errors.
- [x] Cookie-authenticated mutations enforce exact trusted origins and JSON
  content types.
- [x] Unsafe continuation paths are rejected by tested pure validation logic.
- [x] Invalid and expired sessions are rejected, with referenced expired
  database sessions deleted opportunistically.
- [x] Audit models and writers omit passwords, tokens, codes, secrets, and raw
  request bodies.
- [x] Lint, typecheck, unit tests, Prisma validation, and production build pass.
- [x] Production login, protected-page access, logout, and role redirects have
  no observed regression after deployment.
- [ ] Password change and account-name change retain automated and code-review
  coverage but were not part of the final manual smoke test.
- [ ] Login throttling and audit persistence are exercised against a disposable
  or approved non-production integration-test database.

## Phase 2: Artisan authorization bridge

Status: In progress

### Security model

Implement a limited first-party authorization-code flow with PKCE. Do not share
cookies between subdomains and do not send credentials to Artisan.

Only `EMPLOYEE` and `ADMIN` accounts may complete this flow.

### Authorization code model

Add an `AuthorizationCode` model with:

- A unique hash of a cryptographically random code.
- A relation to the authenticated Academy user.
- Client ID.
- Exact redirect URI.
- PKCE code challenge.
- Required `S256` challenge method.
- Short expiration, initially approximately two minutes.
- Nullable used timestamp.
- Creation timestamp.
- Indexes supporting expiration cleanup and user lookup.

The raw code must never be stored. Code consumption must be atomic and
single-use.

### Endpoints

`GET /api/sso/authorize`

Required inputs:

- `client_id`
- `redirect_uri`
- `response_type=code`
- `state`
- `code_challenge`
- `code_challenge_method=S256`

Responsibilities:

1. Validate the configured client and exact callback before redirecting.
2. Reject wildcard, partial, or arbitrary redirect matches.
3. Require PKCE with `S256`.
4. Authenticate through Academy when no Academy session exists.
5. Preserve the SSO request through login using server-controlled state rather
   than an arbitrary external `next` value.
6. Enforce Employee/Admin eligibility after authentication.
7. Create a short-lived code and audit the issuance.
8. Redirect to the registered callback using HTTP `303`.
9. Return the original `state` unchanged.

`POST /api/sso/exchange`

Responsibilities:

1. Accept server-to-server POST requests only.
2. Authenticate the Artisan client using a server-only secret.
3. Verify the code hash, client, exact redirect, expiration, unused state, and
   PKCE verifier.
4. Re-check that the user is active and still Employee/Admin.
5. Mark the code used atomically.
6. Return only the required identity fields: user ID, name, email, and role.
7. Audit successful and rejected exchanges without logging secrets.

The initial exchange will not issue a reusable Academy access token. Artisan
will create its own host-only session in the later Artisan implementation.

### Callback registration

Production:

```text
https://www.artisanbarber.com/api/auth/callback/academy
```

Local development:

```text
http://localhost:3000/api/auth/callback/academy
```

Academy will run locally on port `3001` when both applications are tested
together.

Preview callbacks must be explicitly configured. Vercel preview-host wildcards
will not be accepted as redirect URIs.

### Configuration

Expected server-only configuration:

- `ARTISAN_SSO_ENABLED`
- `ARTISAN_SSO_CLIENT_ID`
- `ARTISAN_SSO_CLIENT_SECRET`
- `ARTISAN_SSO_STATE_SECRET`
- `ARTISAN_SSO_PRODUCTION_REDIRECT_URI`
- `ARTISAN_SSO_LOCAL_REDIRECT_URI`
- `ARTISAN_SSO_PREVIEW_REDIRECT_URI`
- `ARTISAN_SSO_CODE_TTL_SECONDS`
- `AUTH_IDENTIFIER_HASH_SECRET`
- Login-throttle window, limit, and backoff settings

Development, Preview, and Production values must be scoped separately in
Vercel. Secrets must not use `NEXT_PUBLIC_` names.

### Acceptance criteria

- [x] The bridge is disabled by default.
- [x] Student, Instructor, and Member accounts cannot receive an Artisan code.
- [x] Employee and Admin accounts can authorize when active.
- [x] Redirect URIs use exact matching.
- [x] PKCE downgrade and verifier failures are rejected.
- [x] Codes expire quickly and are consumed through an atomic conditional
  update.
- [x] A code cannot be redeemed by another client or callback.
- [x] Exchanges reveal no password hashes, Academy sessions, enrollment data, or
  administrative data.
- [x] Existing Academy authentication builds normally when SSO is disabled.
- [x] Lint, typecheck, 15 tests, and production build pass locally.
- [ ] The additive migration is independently reviewed and approved.
- [ ] Replay and concurrent exchange behavior is verified against an approved
  database target.
- [ ] The disabled bridge is deployed before any environment enables it.

## Testing strategy

Use the existing Node test runner through `tsx` and keep most security logic in
pure functions where possible. Add a heavier framework only when database route
fixtures justify it.

Implemented unit coverage:

- Email normalization.
- Internal redirect acceptance and rejection.
- Origin validation.
- Role destinations and portal eligibility.

Remaining Phase 1 automated coverage:

- Rate-limit boundaries, backoff, and concurrent updates against a disposable
  database.
- Route-level successful, failed, and throttled login behavior.
- Logout, password-change, and account-name mutation enforcement.
- Session expiration behavior.
- Secret-safe audit persistence.

Phase 2 unit coverage will add:

- PKCE challenge verification.
- Code expiry and replay rules.
- Exact callback matching.

Required Phase 2 route/integration coverage:

- Successful and failed login.
- Throttled login.
- Logout and password-change origin enforcement.
- Session expiration behavior.
- Authorization while logged out and logged in.
- Ineligible role rejection.
- Successful exchange.
- Invalid client, redirect, verifier, expired code, and replayed code.

Tests must not connect to production Neon without explicit approval.

## Database safety and migration policy

The production database is the only active database target for this work. A
Neon branch named `jul 21 backup` was created on July 21, 2026 as a point-in-time
restore backup. It must remain untouched and be used only if recovery is
necessary.

Rules:

1. Do not run Prisma Studio, table-data queries, introspection, migration status,
   migration application, `db push`, `migrate dev`, or any other Neon-connected
   command without explicit approval immediately before the interaction.
2. Prepare Prisma schema edits and migration SQL locally first.
3. Show and review the exact migration before requesting permission.
4. Use additive migrations only for these phases.
5. Use `prisma migrate deploy` for production application.
6. Never use `prisma migrate dev` or `prisma db push` against production.
7. Verify migration status read-only after an approved application.
8. Do not provision an Employee row until code that understands `EMPLOYEE` is
   deployed.
9. Do not automatically chain migrations into the Vercel build command.

Planned migration order:

1. Employee enum plus Phase 1 hardening tables.
2. Phase 2 authorization-code table.

Each migration requires its own review and approval. PostgreSQL enum additions
are not destructively rolled back; an unused value may remain if application
rollout is reversed.

## Deployment plan

- [x] Create and work on `academy-auth-bridge`.
- [x] Complete Phase 1A and Phase 1B locally.
- [x] Validate without connecting tests to production Neon.
- [x] Review the exact Phase 1 migration.
- [x] Complete the approved read-only production migration-status check.
- [x] Complete the approved production build.
- [x] Apply the reviewed Phase 1 migration with `prisma migrate deploy`.
- [x] Verify production migration status after application.
- [x] Configure `AUTH_IDENTIFIER_HASH_SECRET` in Vercel Preview and Production.
- [x] Commit and push `academy-auth-bridge` at `c498eac`.
- [x] Merge `academy-auth-bridge` into `main` as `5960826`.
- [x] Diagnose the first Vercel production build failure.
- [x] Update the build to run `prisma generate` before `next build`.
- [x] Verify the corrected build locally with tests, typecheck, lint, and all
  38 routes.
- [x] Commit and push the deterministic Prisma generation fix to `main`.
- [x] Confirm the corrected Vercel production deployment succeeds.
- [x] Verify login, protected access, logout, and role behavior in production.
- [x] Monitor the initial production rollout for login failures, throttling,
  and unexpected authorization behavior.
- [x] Implement the local Phase 2 bridge behind
  `ARTISAN_SSO_ENABLED=false`.
- [x] Complete independent code and migration review for Phase 2.
- [x] Confirm through an approved read-only production status check that only
  `20260727160000_add_authorization_codes` is pending.
- [x] Obtain approval, apply the Phase 2 migration, and verify production
  migration status.
- [ ] Test the disabled bridge in production and the enabled bridge in a
  controlled development or preview configuration.
- [ ] Push and enable production SSO only when the Artisan callback is ready.

## Rollback approach

- Authentication hardening can be reverted at the application layer while
  leaving additive tables unused.
- SSO can be stopped immediately with `ARTISAN_SSO_ENABLED=false`.
- Authorization codes are short-lived and single-use, limiting residual risk.
- Do not drop tables or rebuild enums during an incident unless a separate,
  reviewed recovery plan requires it.
- Use the `jul 21 backup` Neon branch only if a database restore is necessary.

## Deferred onboarding work

After SSO is stable, use Duhan's onboarding prototype as a domain reference for:

- Employee onboarding profiles.
- Checklists and completion state.
- Meetings and scheduling.
- Handbook-version acknowledgments.
- Team profiles.
- Training-access confirmation.
- Administrative notes and audit history.

Do not import the prototype SQL unchanged. In particular, production models
must relate onboarding profiles to Academy users, replace the prototype's
`is_current_user` flag, normalize meeting timestamps and hosts, version handbook
acknowledgments, and define media storage.

## Progress log

### July 27, 2026

- Confirmed the corrected Phase 1 deployment and production smoke checks;
  marked Phase 1A and Phase 1B completed.
- Started Phase 2 on `main`.
- Added a disabled-by-default, exact-callback authorization-code bridge with
  PKCE `S256`, Employee/Admin eligibility, and server-to-server client
  authentication.
- Added a five-minute signed HttpOnly resume cookie so logged-out SSO requests
  do not travel through the ordinary login continuation as raw parameters.
- Added a two-minute, 32-byte authorization code stored only as a SHA-256 hash
  and consumed through a single conditional PostgreSQL update.
- Prepared—but did not apply—the additive `AuthorizationCode` migration.
- Added four Phase 2 security tests. All 15 tests, Prisma validation and
  generation, TypeScript, ESLint, and the production build pass locally.
- Requested an independent final security review before the database gate.
- Completed the approved read-only production migration-status check. All prior
  migrations are applied and only the expected Phase 2 authorization-code
  migration is pending; no database change was made.
- Applied `20260727160000_add_authorization_codes` to production Neon with
  `prisma migrate deploy`. The follow-up read-only check confirmed all four
  migrations are applied and the schema is up to date. SSO remained disabled
  and no authorization-code row was created.

### July 23, 2026

- Merged `academy-auth-bridge` into `main` through pull request 1 at `5960826`.
- Preserved both the newer Academy analytics work and Phase 1 authentication
  behavior while updating the branch from `main`.
- The first Vercel production deployment compiled but failed typechecking
  because cached Prisma Client output did not export the new `AuthEventType`.
- Identified the root cause as missing deterministic Prisma Client generation
  in the Vercel build path; no schema or migration failure occurred.
- Updated `npm run build` to execute `prisma generate && next build`.
- Verified the fix locally: all 11 tests, TypeScript, ESLint, Prisma generation,
  and the production build passed across 38 routes.
- Preserved unrelated local edits in `prisma/seed.ts` and
  `prisma/map-vimeo-lessons.ts`; they are not part of this deployment fix.

### July 21, 2026

- Completed read-only discovery of the Artisan and Academy repositories.
- Reviewed Academy authentication, sessions, role guards, Prisma ownership, Git
  history, migration scripts, and Vercel deployment assumptions.
- Reviewed Duhan's onboarding prototype, API contract, and PostgreSQL schema.
- Confirmed Academy and Artisan production origins.
- Confirmed Vercel as the hosting provider for both applications.
- Confirmed administratively provisioned accounts.
- Confirmed target role behavior, including the new Employee role and preserved
  Member experience.
- Confirmed that only Employee and Admin may authorize Artisan.
- Completed approved read-only Neon schema introspection and migration-status
  checks; found no drift and inspected no records.
- Confirmed `npm run db:deploy` is separate from `npm run build` and should remain
  a manually controlled production step.
- Confirmed the `jul 21 backup` Neon restore branch exists and must remain
  untouched.
- Created `academy-auth-bridge` for the Academy work.
- Implemented `EMPLOYEE` role support and centralized exact role groups. Local
  tests verify the full Academy access matrix and Artisan eligibility matrix.
- Prepared and independently reviewed the additive Phase 1 migration for the
  Employee enum, distributed login-throttle state, and secret-safe
  authentication audit events.
- Implemented local authentication hardening: exact-origin and JSON mutation
  guards, generic credential errors, account and IP throttling, safe login
  continuation, no-store responses, audit events, and session-expiry cleanup.
- Removed an asynchronous browser-cookie cleanup approach after review found it
  could race with a newly created session. Invalid sessions remain rejected;
  stale cookies are cleared only where Next.js permits safe mutation.
- Completed independent read-only reviews of role enforcement, authentication
  security, and migration safety. All identified medium-or-higher local issues
  were corrected; the migration review found no destructive statements.
- Avoided an audit-write amplification path by recording the transition into a
  throttled state, not every subsequent request received during the block.
- Validated the Prisma schema and regenerated Prisma Client locally without a
  database connection.
- Passed 11 local unit tests plus TypeScript, ESLint, and `git diff --check`.
  Database-backed route/concurrency tests remain gated.
- Completed an approved read-only production `prisma migrate status` check. It
  found exactly the expected Phase 1 migration pending; no migration was
  applied.
- Completed the approved production build successfully. Next.js compiled,
  typechecked, generated all 34 routes, and retained application routes as
  dynamically server-rendered.
- Applied the reviewed additive Phase 1 migration to production Neon with
  `prisma migrate deploy`. Prisma then confirmed all three migrations are
  applied and the production schema is up to date. No user record was created
  or changed.
- Configured the same strong `AUTH_IDENTIFIER_HASH_SECRET` in the Academy Vercel
  Preview and Production environments. The value is server-only and is not
  committed.
- Committed the complete Phase 1 implementation as `c498eac` (`Harden Academy
  auth and add employee role`) and pushed `academy-auth-bridge` to the Academy
  GitHub remote.
- Left Phase 1 marked in progress pending Vercel preview deployment and
  end-to-end verification of existing roles and authentication flows.
