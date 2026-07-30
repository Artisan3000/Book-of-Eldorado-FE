# Shared Decision Log

Use for decisions that affect Academy and Artisan Labs FE. Append entries; do not rewrite history. Statuses: `Proposed`, `Accepted`, `Deferred`, `Rejected`, `Superseded`.

## 2026-07-30 — Careers MVP Scope and Repository

- **Decision:** Build T99 forms and resources/policies under `/careers` in Artisan Labs FE. Preserve existing Artisan login and portal access.
- **Affected repos:** Artisan Labs FE
- **Owner:** Brian; implementation by Duhon
- **Status:** Accepted
- **Context:** These are the two missing MVP areas in the current portal direction.
- **Consequences:** Account creation, checklists, meeting tools, new auth/SSO work, and other prototype modules are out of scope.
- **Superseded by:** None

## 2026-07-30 — Duhon Delivery Route

- **Decision:** Duhon works from feature branches created from Artisan Labs FE.
- **Affected repos:** Artisan Labs FE
- **Owner:** Duhon
- **Status:** Accepted
- **Context:** Final implementation must fit the production integration repository.
- **Consequences:** No disconnected prototype handoff is accepted as implementation delivery.
- **Superseded by:** None

## 2026-07-30 — Careers Database Approval

- **Decision:** Duhon and Brian deliberate on proposed SQL; Brian approves it, owns the production database, and controls migration.
- **Affected repos:** Artisan Labs FE; Academy only if a later decision assigns Academy data ownership
- **Owner:** Brian
- **Status:** Accepted
- **Context:** Artisan currently has no confirmed application schema for T99/resources.
- **Consequences:** Duhon’s SQL is a proposal until approved. No production migration or Academy schema change occurs automatically.
- **Superseded by:** None

## 2026-07-30 — T99 and Resource Requirements

- **Decision:** Duhon owns clarification and management of T99 requirements with HR. Resources are expected to require acknowledgement and version tracking, but the exact rules remain unconfirmed.
- **Affected repos:** Artisan Labs FE
- **Owner:** Duhon for T99; resource policy owner unconfirmed
- **Status:** Proposed
- **Context:** Exact forms, fields, files, permissions, acknowledgement events, and version lifecycle are not yet documented.
- **Consequences:** Do not finalize schema or acceptance criteria until the missing requirements are confirmed.
- **Superseded by:** None

## 2026-07-30 — SSO Expansion Deferred

- **Decision:** Do not add or change Academy SSO for the current careers MVP.
- **Affected repos:** Academy, Artisan Labs FE
- **Owner:** Brian
- **Status:** Deferred
- **Context:** Existing Artisan login is sufficient for current work; Academy SSO can be revisited later if needed.
- **Consequences:** T99/resources must not depend on the Academy SSO endpoints.
- **Superseded by:** None

## 2026-07-27 — Academy Owns Credentials and Academy Data

- **Decision:** Academy remains the sole owner of credential verification, Academy identity/roles, Prisma models, and Neon migrations.
- **Affected repos:** Academy, Artisan Labs FE
- **Owner:** Team; individual owner unconfirmed
- **Status:** Accepted
- **Context:** Prevent passwords, session tokens, or database credentials from crossing into Artisan.
- **Consequences:** Artisan consumes an approved identity contract; it does not duplicate or directly query Academy auth/data.
- **Superseded by:** None

## 2026-07-27 — Separate Host-Only Sessions if SSO Is Activated

- **Decision:** Academy and Artisan use separate host-only sessions; cookies are not shared across subdomains.
- **Affected repos:** Academy, Artisan Labs FE
- **Owner:** Team; individual owner unconfirmed
- **Status:** Deferred
- **Context:** Artisan receives identity through a short-lived authorization-code exchange.
- **Consequences:** Artisan owns its callback and local session. Academy session tokens never enter Artisan.
- **Superseded by:** None

## 2026-07-27 — Artisan Portal Eligibility if SSO Is Activated

- **Decision:** Only active `EMPLOYEE` and `ADMIN` Academy users may authorize the Artisan employee portal.
- **Affected repos:** Academy, Artisan Labs FE
- **Owner:** Team; individual owner unconfirmed
- **Status:** Deferred
- **Context:** Eligibility must be enforced by the identity authority.
- **Consequences:** Academy enforces roles server-side; Artisan must not substitute client-side eligibility.
- **Superseded by:** None

---

## YYYY-MM-DD — Title

- **Decision:**
- **Affected repos:**
- **Owner:**
- **Status:** Proposed
- **Context:**
- **Consequences:**
- **Superseded by:** None
