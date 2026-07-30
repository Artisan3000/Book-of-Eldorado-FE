# API Contracts Reference

Implementation: `Book-of-Eldorado-FE/ab-academy/src/app/api/sso/`

Status: deferred reference. Implemented in code and disabled unless `ARTISAN_SSO_ENABLED=true`; production enablement is unconfirmed. The current T99/resources MVP must not depend on these endpoints.

## `GET /api/sso/authorize`

Required query parameters:

- `client_id` — configured client ID; default in code is `artisan-employee-portal`
- `redirect_uri` — exact configured URI
- `response_type=code`
- `state` — required, maximum 512 characters
- `code_challenge` — valid PKCE challenge
- `code_challenge_method=S256`

Behavior:

- No Academy session → stores a signed five-minute resume cookie and redirects to Academy login.
- Ineligible role → `403` JSON.
- Eligible `EMPLOYEE` or `ADMIN` → creates a one-time code and returns a `303` redirect to `redirect_uri?code=...&state=...`.
- Invalid request → `400` JSON. Disabled SSO → `404` JSON.

## `GET /api/sso/resume`

- Reads and clears the signed `academy_sso_resume` cookie.
- Valid request → `303` back to `/api/sso/authorize`.
- Missing, invalid, or expired request → `400` JSON.
- Disabled SSO → `404` JSON.

## `POST /api/sso/exchange`

Headers:

- `Authorization: Basic <base64(client_id:client_secret)>`
- `Content-Type: application/json`

JSON body:

```json
{
  "code": "<authorization code>",
  "redirect_uri": "<exact registered URI>",
  "code_verifier": "<PKCE verifier>"
}
```

Success JSON:

```json
{
  "user": {
    "userId": "<Academy user ID>",
    "name": "<name>",
    "email": "<email>",
    "role": "EMPLOYEE"
  }
}
```

The role may be `EMPLOYEE` or `ADMIN`. Codes are short-lived, single-use, client/redirect-bound, and consumed atomically.

Errors:

- Invalid client credentials → `401`
- Non-JSON request → `415`
- Invalid, expired, used, ineligible, or mismatched exchange → `400`
- Disabled SSO → `404`

## Consumer Rules

- Do not use these endpoints for the current careers MVP without a new accepted cross-repo decision.
- Verify current code and enabled deployment before integration.
- Preserve `state`; never put it through the ordinary login `next` parameter.
- Keep the client secret and exchange server-side.
- Do not stub a different identity payload, eligibility rule, or token format in Artisan without an accepted decision.
- Error payloads are intentionally generic; do not depend on finer error reasons.
