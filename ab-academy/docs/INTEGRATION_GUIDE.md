# Integration Guide

Application root: `Book-of-Eldorado-FE/ab-academy/`.

This guide applies only to Academy implementation. Current T99/resources work belongs in Artisan Labs FE; see [`REPO_BOUNDARY.md`](REPO_BOUNDARY.md).

## Put Code Here

- Marketing pages → `src/app/(marketing)/`
- Public course pages → `src/app/(learning)/`
- Role portals → `src/app/(account)/<role>/`
- API handlers → `src/app/api/<matching-route>/`
- Route-only components → beside the route
- Shared UI → `src/app/components/`
- Shared server/domain logic → `src/lib/`
- Course/student queries → `src/lib/data/`
- Auth/request security → `src/lib/auth.ts`, `src/lib/auth/`
- Sessions/roles → `src/lib/session.ts`, `src/lib/current-user.ts`, `src/lib/roles.ts`
- Schema, migrations, seeds, DB scripts → `prisma/`
- Static assets → `public/`

## Reuse

- bcrypt credential checks
- Database-backed opaque sessions
- Central role groups and server-side guards
- Login throttling and auth audit events
- Prisma and the existing PostgreSQL database

## Approval Required

- New identity, login, session, user, role, ORM, database, or storage systems
- Schema changes and their checked-in migrations
- Changes to migration history, proxy protection, or production environment contracts
- New dependencies or broad root-configuration changes

Record approved architecture changes in [`DECISIONS.md`](DECISIONS.md).

## Confirm Before Building

- SSO deployment, configuration, and latest migration status
- Payment and enrollment behavior
- Missing resource links
- Production approval of placeholder marketing content

Mark these `Unclear — confirm with team` until confirmed.

## Prototype Rule

- Use an isolated prototype only for explicitly requested exploration.
- A prototype-only handoff is not implementation delivery unless explicitly approved.
- For implementation delivery, move the work into the paths above and include tests, configuration, migrations, failure states, and verification.
