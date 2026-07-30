# Contributing

This file applies to changes in the Academy repository. Current T99/resources work belongs in Artisan Labs FE; see [`REPO_BOUNDARY.md`](REPO_BOUNDARY.md).

## Before You Code

- [ ] Read [`ARCHITECTURE.md`](ARCHITECTURE.md).
- [ ] Update from the default branch.
- [ ] Inspect the affected routes, shared code, auth rules, schema, migrations, and tests.
- [ ] Confirm unclear requirements before they affect auth, data, public behavior, or deployment.

## Rules

- Implement at the final location in this repository.
- Extend existing Next.js, Prisma/PostgreSQL, auth, session, and role patterns.
- Do not add a parallel auth, login, session, user, role, schema, ORM, database, or storage system without an `Accepted` entry in [`DECISIONS.md`](DECISIONS.md).
- An isolated prototype is exploration only. It is not implementation delivery unless a prototype-only handoff was explicitly approved.
- The contributor—not the reviewer—must port approved prototype work into this repository.
- Mark assumptions as `Assumption` and unknowns as `Unclear — confirm with team`.
- Keep each branch and PR focused. Exclude unrelated refactors and formatting churn.

## Before Review

- [ ] Complete [`HANDOFF_CHECKLIST.md`](HANDOFF_CHECKLIST.md).
- [ ] Open a PR using [`PR_TEMPLATE.md`](PR_TEMPLATE.md).
- [ ] Record required architecture or product decisions in [`DECISIONS.md`](DECISIONS.md).
