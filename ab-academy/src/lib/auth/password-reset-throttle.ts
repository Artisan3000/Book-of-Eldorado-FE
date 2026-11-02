import "server-only";

import { checkLoginThrottle, recordLoginFailure } from "./login-throttle";
import { hashAuthIdentifier } from "./identifiers";

function namespacedHash(kind: "account" | "ip", value: string) {
  return hashAuthIdentifier(kind, `password-reset:${value}`);
}

export function getPasswordResetThrottleIdentity(email: string, ip: string) {
  return {
    accountHash: namespacedHash("account", email),
    ipHash: namespacedHash("ip", ip),
  };
}

export { checkLoginThrottle, recordLoginFailure };
