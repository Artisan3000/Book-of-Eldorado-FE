# Cross-Repo Integration Guide

## Current MVP Rule

- Build T99 and resources/policies in Artisan Labs FE under `/careers`.
- Preserve the existing Artisan login and portal boundary.
- Do not add an Academy dependency or SSO work for this MVP.
- Consult this repository only when work touches Academy identity, roles, data, or future integration.

## Choose the Correct Repository

| Change | Owning repo |
| --- | --- |
| Main website or employee-portal UI | Artisan Labs FE |
| T99 forms and workflow | Artisan Labs FE; requirements managed by Duhon/HR |
| Resources, acknowledgements, and version history | Artisan Labs FE |
| Careers database and approved SQL | Brian |
| Artisan callback and Artisan session | Artisan Labs FE |
| Password verification or Academy login | Academy |
| Academy roles and portal eligibility | Academy |
| Academy users, courses, enrollments, or progress | Academy |
| Academy schema or migrations | Academy |
| Authorization-code issue/exchange behavior | Academy |

If ownership is unclear, stop and record `Unclear — confirm with team` before coding.

## Before Cross-Repo Work

- [ ] Name the owning repo for each changed behavior.
- [ ] Link the Academy endpoint, model, role rule, or migration being consumed.
- [ ] Write request, response, error, redirect, and environment assumptions.
- [ ] Assign an owner for each repo.
- [ ] Define integration order and a shared verification case.
- [ ] Record durable decisions in [`SHARED_DECISIONS.md`](SHARED_DECISIONS.md).

## Coordination Rules

- Duhon works from branches created from Artisan Labs FE.
- Brian and Duhon review database design together; Brian approves SQL and owns production migration.
- Change the contract in its owning repo first.
- Update the consumer only after the new contract is reviewed, or use an explicitly versioned temporary contract.
- Do not copy Academy credential, session, user, or schema logic into Artisan.
- Do not deliver an isolated prototype as implementation; the current delivery path is an Artisan Labs FE branch and PR.
- Cross-repo delivery is complete only when both sides are integrated or the remaining side has an assigned owner, approved contract, and tracked work item.

## When Repos Are Out of Sync

- Treat deployed behavior as authoritative for production.
- Treat reviewed code as authoritative only for the branch/version that contains it.
- Keep disabled or undeployed behavior labeled as such.
- Do not silently code against the newer side.
- Pin the expected branch, commit, endpoint contract, and rollout order in both PRs.
