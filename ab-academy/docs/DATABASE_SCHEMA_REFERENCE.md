# Database Schema Reference

Source of truth: `Book-of-Eldorado-FE/ab-academy/prisma/schema.prisma`

## Academy Models

- `User` — name, unique email, password hash, role, active status
- `Session` — hashed token, user, expiration
- `LoginThrottle` — hashed account/IP throttle state
- `AuthEvent` — typed auth audit event with hashed identifiers
- `AuthorizationCode` — user, client, redirect URI, PKCE challenge, expiration, use time
- `Course` → `Module` → `Lesson`
- `Enrollment` — unique user/course relationship and status
- `LessonProgress` — unique enrollment/lesson status, timestamps, playback position

Roles: `ADMIN`, `INSTRUCTOR`, `STUDENT`, `EMPLOYEE`, `MEMBER`.

## Authority

- Academy owns these models, their relationships, and all Neon migrations.
- Academy schema is authoritative only for Academy-owned data.
- Artisan Labs FE owns careers-portal persistence approved for the current MVP.
- Artisan must not connect directly to Academy Neon, copy these tables, or treat this schema as an Artisan migration plan.
- If Artisan needs durable local data, define ownership, identifiers, synchronization, deletion, and staleness behavior in [`SHARED_DECISIONS.md`](SHARED_DECISIONS.md) first.

## Careers MVP Database Process

- Duhon supplies T99 requirements and proposed SQL from an Artisan Labs FE branch.
- Duhon and Brian review the design together before migration.
- Brian approves SQL, owns the production database, and controls production migration.
- Treat all proposed SQL as unapproved until that review is complete.
- Do not apply careers SQL to the Academy database unless a separate accepted decision assigns Academy ownership.
- Prefer no new persistence when static/configured content satisfies the confirmed requirement.

Before approval, document:

- Tables, relationships, and ownership
- Existing Artisan identifiers reused
- T99 fields and HR source requirements
- Resource version and acknowledgement records
- Migration and rollback plan
- Seed/mock data and destructive statements

## Change Rules

- [ ] Change `schema.prisma` in this repository.
- [ ] Add a new checked-in Prisma migration; never edit applied migration history.
- [ ] Document compatibility and rollout order for Artisan consumers.
- [ ] Deploy the Academy change before consumers require it.
- [ ] Verify the migration and affected API contract.

## Do Not Infer

- An Artisan-side user schema
- Shared primary keys beyond fields returned by a confirmed contract
- Replication or synchronization behavior
- Payment, billing, onboarding, or HR models
- T99 fields or workflow not confirmed by Duhon/HR
- Final acknowledgement or version-history rules
- Production availability of `AuthorizationCode`

Mark missing data contracts `Unclear — confirm with team`; do not invent matching tables in Artisan.
