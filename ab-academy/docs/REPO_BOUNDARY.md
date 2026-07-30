# Repository Boundary

## Current Delivery

- Duhon works from feature branches created from Artisan Labs FE.
- Current MVP: T99 forms and resources/policies under `/careers`.
- Existing Artisan login and portal access remain unchanged.
- Academy SSO is deferred and is not an MVP dependency.

## Ownership

| Concern | Owner |
| --- | --- |
| Public site and `/careers` portal UI | Artisan Labs FE |
| T99 requirements and implementation | Duhon with HR; Artisan Labs FE |
| Resources, acknowledgements, and version tracking | Artisan Labs FE; exact policy owner unconfirmed |
| Careers SQL approval and production database | Brian |
| Academy credentials and identity validation | Academy |
| Academy users, roles, courses, and progress | Academy |
| Academy Prisma schema and Neon migrations | Academy |
| Future cross-repo auth/API contract | Shared decision |

## Rules

- Do not change login, account creation, user models, or SSO for the current MVP.
- Do not copy Academy auth or schema into Artisan.
- Do not apply careers SQL to Academy without an accepted ownership decision.
- Duhon’s SQL remains a proposal until Duhon and Brian review it and Brian approves migration.
- Do not deliver a disconnected prototype as implementation; use an Artisan Labs FE branch and PR.
- Record unknowns before coding. Do not infer HR forms, permissions, or data-retention rules.

## Unclear — Confirm Before Schema Approval

- Exact T99 forms, fields, workflow, permissions, and HR source material
- Resource file inventory and policy owner
- Who must acknowledge each resource
- Whether acknowledgement is per user, role, location, or document version
- Version publication, replacement, retention, and re-acknowledgement rules
