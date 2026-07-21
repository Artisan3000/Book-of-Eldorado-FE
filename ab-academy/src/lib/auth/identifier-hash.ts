import { createHmac } from "node:crypto";

export type IdentifierKind = "account" | "ip";

export function isStrongIdentifierSecret(secret: string | undefined) {
  return Boolean(secret && Buffer.byteLength(secret, "utf8") >= 32);
}

export function createIdentifierHash(
  secret: string,
  kind: IdentifierKind,
  value: string
) {
  return createHmac("sha256", secret)
    .update(`${kind}\0${value}`)
    .digest("hex");
}
