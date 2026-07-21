import "server-only";

import { LoginThrottleScope, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { hashAuthIdentifier } from "./identifiers";

type ThrottlePolicy = {
  limit: number;
  windowSeconds: number;
  blockSeconds: number;
};

type ThrottleIdentity = {
  accountHash: string;
  ipHash: string;
};

type ThrottleDecision = ThrottleIdentity & {
  blocked: boolean;
  retryAfterSeconds: number;
};

type UpdatedThrottle = {
  blockedUntil: Date | null;
};

function readBoundedInteger(
  name: string,
  fallback: number,
  minimum: number,
  maximum: number
) {
  const value = Number.parseInt(process.env[name] ?? "", 10);

  if (!Number.isFinite(value) || value < minimum) return fallback;

  return Math.min(value, maximum);
}

function accountPolicy(): ThrottlePolicy {
  return {
    limit: readBoundedInteger("AUTH_ACCOUNT_FAILURE_LIMIT", 5, 2, 100),
    windowSeconds: readBoundedInteger("AUTH_FAILURE_WINDOW_SECONDS", 900, 1, 86400),
    blockSeconds: readBoundedInteger("AUTH_BLOCK_SECONDS", 900, 1, 86400),
  };
}

function ipPolicy(): ThrottlePolicy {
  return {
    limit: readBoundedInteger("AUTH_IP_FAILURE_LIMIT", 25, 2, 1000),
    windowSeconds: readBoundedInteger("AUTH_FAILURE_WINDOW_SECONDS", 900, 1, 86400),
    blockSeconds: readBoundedInteger("AUTH_BLOCK_SECONDS", 900, 1, 86400),
  };
}

export function getThrottleIdentity(email: string, ip: string): ThrottleIdentity {
  return {
    accountHash: hashAuthIdentifier("account", email),
    ipHash: hashAuthIdentifier("ip", ip),
  };
}

function retryAfter(blockedUntil: Date | null, now: Date) {
  if (!blockedUntil || blockedUntil <= now) return 0;

  return Math.max(1, Math.ceil((blockedUntil.getTime() - now.getTime()) / 1000));
}

export async function checkLoginThrottle(
  identity: ThrottleIdentity,
  now = new Date()
): Promise<ThrottleDecision> {
  const [account, ip] = await Promise.all([
    prisma.loginThrottle.findUnique({ where: { keyHash: identity.accountHash } }),
    prisma.loginThrottle.findUnique({ where: { keyHash: identity.ipHash } }),
  ]);
  const retryAfterSeconds = Math.max(
    retryAfter(account?.blockedUntil ?? null, now),
    retryAfter(ip?.blockedUntil ?? null, now)
  );

  return {
    ...identity,
    blocked: retryAfterSeconds > 0,
    retryAfterSeconds,
  };
}

async function recordFailure(
  keyHash: string,
  scope: LoginThrottleScope,
  policy: ThrottlePolicy,
  now: Date
) {
  const windowCutoff = new Date(now.getTime() - policy.windowSeconds * 1000);
  const nextBlockedUntil = new Date(now.getTime() + policy.blockSeconds * 1000);
  const rows = await prisma.$queryRaw<UpdatedThrottle[]>(Prisma.sql`
    INSERT INTO "LoginThrottle" (
      "keyHash", "scope", "failureCount", "windowStartedAt", "blockedUntil", "updatedAt"
    ) VALUES (
      ${keyHash}, CAST(${scope} AS "LoginThrottleScope"), 1, ${now}, NULL, ${now}
    )
    ON CONFLICT ("keyHash") DO UPDATE SET
      "scope" = EXCLUDED."scope",
      "failureCount" = CASE
        WHEN "LoginThrottle"."windowStartedAt" <= ${windowCutoff} THEN 1
        ELSE "LoginThrottle"."failureCount" + 1
      END,
      "windowStartedAt" = CASE
        WHEN "LoginThrottle"."windowStartedAt" <= ${windowCutoff} THEN ${now}
        ELSE "LoginThrottle"."windowStartedAt"
      END,
      "blockedUntil" = CASE
        WHEN "LoginThrottle"."blockedUntil" > ${now}
          THEN "LoginThrottle"."blockedUntil"
        WHEN (
          CASE
            WHEN "LoginThrottle"."windowStartedAt" <= ${windowCutoff} THEN 1
            ELSE "LoginThrottle"."failureCount" + 1
          END
        ) >= ${policy.limit}
          THEN ${nextBlockedUntil}
        ELSE NULL
      END,
      "updatedAt" = ${now}
    RETURNING "blockedUntil"
  `);

  return retryAfter(rows[0]?.blockedUntil ?? null, now);
}

export async function recordLoginFailure(
  identity: ThrottleIdentity,
  now = new Date()
) {
  const [accountRetry, ipRetry] = await Promise.all([
    recordFailure(
      identity.accountHash,
      LoginThrottleScope.ACCOUNT,
      accountPolicy(),
      now
    ),
    recordFailure(identity.ipHash, LoginThrottleScope.IP, ipPolicy(), now),
  ]);

  return Math.max(accountRetry, ipRetry);
}

export async function clearSuccessfulAccountThrottle(accountHash: string) {
  await prisma.loginThrottle.deleteMany({ where: { keyHash: accountHash } });
}
