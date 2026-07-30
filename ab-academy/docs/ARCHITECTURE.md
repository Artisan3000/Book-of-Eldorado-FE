# Academy Architecture Reference

Last updated: 2026-07-30

Application root: `Book-of-Eldorado-FE/ab-academy/`

## Purpose

- This repository owns the Academy application and supplies Academy auth/data constraints to Artisan Labs FE.
- Artisan Labs FE is the primary website and day-to-day feature integration repository.
- Academy integration work must use the contracts documented here; it must not infer a second identity or data system.

## Current Careers MVP Boundary

- Duhon works in feature branches created from Artisan Labs FE.
- T99 forms and resources/policies are implemented under the existing Artisan `/careers` portal.
- Duhon manages T99 requirements and content with the appropriate HR stakeholders.
- Existing Artisan login and portal access remain unchanged.
- No Academy runtime integration, account creation, or SSO work is required for this MVP.
- Checklists, meeting tools, and other prototype modules are out of scope.
- Brian owns the production database and approves SQL after joint review with Duhon.

## Academy Systems

- Next.js App Router pages and APIs — `src/app/`
- Email/password authentication and request security — `src/lib/auth.ts`, `src/lib/auth/`
- Database-backed sessions and role checks — `src/lib/session.ts`, `src/lib/current-user.ts`, `src/lib/roles.ts`
- Prisma/PostgreSQL schema and migrations — `prisma/`
- Courses, enrollments, lessons, Vimeo playback, and progress — `src/lib/data/`, `src/app/(account)/student/`
- Academy-side PKCE authorization bridge — `src/app/api/sso/`, `src/lib/sso/`

## Ownership Boundary

### Academy Owns

- Credential verification and password hashes
- Academy users, roles, sessions, courses, enrollments, and progress
- Academy Prisma schema and Neon migrations
- Authorization-code issuance, eligibility checks, and code exchange
- Academy host-only cookies

### Artisan Labs FE Owns

- Main-site and employee-portal UI
- `/careers` portal features, including the current T99 and resources MVP
- Current Artisan login and portal session behavior
- Careers-owned persistence approved by Brian
- If SSO is approved later: the authorization request, callback, PKCE state/verifier, and Artisan host-only session

Artisan must not receive passwords, Academy session tokens, or direct Neon credentials. Cookies are not shared across subdomains.

## Integration Touchpoints

- Academy origin: `https://academy.artisanbarber.com`
- Artisan origin: `https://www.artisanbarber.com`
- Deferred Academy endpoints: `/api/sso/authorize`, `/api/sso/resume`, `/api/sso/exchange`
- Portal-eligible Academy roles: `EMPLOYEE`, `ADMIN`
- Detailed contracts: [`API_CONTRACTS_REFERENCE.md`](API_CONTRACTS_REFERENCE.md)

## Current Status

- Academy login, roles, throttling, auditing, and sessions are documented as deployed.
- The Academy SSO bridge exists in code but is disabled by default.
- The current careers MVP must not depend on Academy SSO.
- Artisan Labs FE contains the active careers implementation; its exact deployed SSO state remains unconfirmed here.

## Unclear — Confirm With Team

- Whether the SSO migration and configuration are deployed after 2026-07-27
- Whether the Academy SSO bridge is enabled in any environment
- Exact T99 form definitions and HR requirements; Duhon owns clarification
- Final resource acknowledgement and version-history requirements
