# AI Collaboration Guide

This repository is the source of truth for Academy auth, identity, roles, schema, and Academy-side SSO behavior. Artisan Labs FE remains the primary UI and feature integration repository.

Current task boundary: Duhon implements T99 and resources/policies from Artisan Labs FE branches. Existing login remains unchanged; SSO is deferred.

## Give the AI

- [`ARCHITECTURE.md`](ARCHITECTURE.md)
- The owning repo for each requested behavior
- Relevant auth, schema, and API references
- Target branch/commit and deployment status
- Acceptance criteria and required checks

## Require the AI To

- Inspect the owning repo before generating code.
- Preserve the Academy/Artisan ownership boundary.
- Reuse confirmed contracts; never fill missing contracts with plausible behavior.
- Label assumptions `Assumption` and gaps `Unclear — confirm with team`.
- Stop when uncertainty affects identity, roles, data ownership, API payloads, migrations, secrets, or rollout order.
- Keep passwords, Academy sessions, client secrets, and database credentials in their documented server-side boundaries.
- State whether behavior is implemented, deployed, enabled, mocked, or unverified.

## Reject Output That

- Creates substitute Academy auth, users, roles, schema, or storage in Artisan.
- Connects Artisan directly to Academy Neon.
- Invents endpoint fields, token formats, sync behavior, or deployment status.
- Treats disabled Academy SSO code as a confirmed live contract.
- Delivers implementation outside an Artisan Labs FE branch.
- Leaves cross-repo ownership or integration work for the reviewer to discover.

Record new cross-repo architecture choices in [`SHARED_DECISIONS.md`](SHARED_DECISIONS.md) before implementation.
