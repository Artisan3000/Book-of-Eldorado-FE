import "server-only";

import {
  createIdentifierHash,
  isStrongIdentifierSecret,
  type IdentifierKind,
} from "./identifier-hash";

function getIdentifierSecret() {
  const secret = process.env.AUTH_IDENTIFIER_HASH_SECRET;

  if (isStrongIdentifierSecret(secret)) return secret as string;

  if (process.env.NODE_ENV !== "production") {
    return "academy-development-identifier-secret-not-for-production";
  }

  throw new Error(
    "AUTH_IDENTIFIER_HASH_SECRET must be at least 32 bytes in production."
  );
}

export function hashAuthIdentifier(kind: IdentifierKind, value: string) {
  return createIdentifierHash(getIdentifierSecret(), kind, value);
}
