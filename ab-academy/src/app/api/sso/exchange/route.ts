import { AuthEventType, Prisma, Role } from "@prisma/client";
import { recordAuthEvent } from "@/lib/auth/audit";
import { authJson } from "@/lib/auth/responses";
import { isJsonRequest } from "@/lib/auth/request-security";
import { prisma } from "@/lib/prisma";
import { getSsoConfig, secretMatches } from "@/lib/sso/config";
import {
  createPkceChallenge,
  hashAuthorizationCode,
  isValidPkceVerifier,
} from "@/lib/sso/crypto";

type ExchangedIdentity = {
  userId: string;
  name: string;
  email: string;
  role: Role;
};

const CODE_PATTERN = /^[A-Za-z0-9_-]{43}$/;

function readClientCredentials(request: Request) {
  const authorization = request.headers.get("authorization") ?? "";
  if (!authorization.startsWith("Basic ")) return null;

  try {
    const decoded = Buffer.from(authorization.slice(6), "base64").toString("utf8");
    const separator = decoded.indexOf(":");
    if (separator < 0) return null;
    return {
      clientId: decoded.slice(0, separator),
      secret: decoded.slice(separator + 1),
    };
  } catch {
    return null;
  }
}

function rejected(status = 400) {
  return authJson({ error: "Authorization exchange rejected." }, { status });
}

export async function POST(request: Request) {
  const config = getSsoConfig();
  if (!config.enabled) return authJson({ error: "Not found." }, { status: 404 });
  if (!isJsonRequest(request)) {
    return authJson(
      { error: "Content-Type must be application/json." },
      { status: 415 }
    );
  }

  const credentials = readClientCredentials(request);
  if (
    !credentials ||
    credentials.clientId !== config.clientId ||
    !secretMatches(credentials.secret, config.clientSecret)
  ) {
    return rejected(401);
  }

  const body = await request.json().catch(() => null);
  const code = typeof body?.code === "string" ? body.code : "";
  const redirectUri =
    typeof body?.redirect_uri === "string" ? body.redirect_uri : "";
  const verifier =
    typeof body?.code_verifier === "string" ? body.code_verifier : "";

  if (
    !CODE_PATTERN.test(code) ||
    !config.redirectUris.has(redirectUri) ||
    !isValidPkceVerifier(verifier)
  ) {
    return rejected();
  }

  const codeHash = hashAuthorizationCode(code);
  const candidate = await prisma.authorizationCode.findUnique({
    where: { codeHash },
    select: { codeChallenge: true },
  });

  if (
    !candidate ||
    !secretMatches(createPkceChallenge(verifier), candidate.codeChallenge)
  ) {
    await recordAuthEvent({
      type: AuthEventType.AUTHORIZATION_EXCHANGE_REJECTED,
    });
    return rejected();
  }

  const now = new Date();
  const rows = await prisma.$queryRaw<ExchangedIdentity[]>(Prisma.sql`
    WITH eligible AS (
      SELECT
        ac."id",
        u."id" AS "userId",
        u."name",
        u."email",
        u."role"
      FROM "AuthorizationCode" ac
      INNER JOIN "User" u ON u."id" = ac."userId"
      WHERE ac."codeHash" = ${codeHash}
        AND ac."clientId" = ${config.clientId}
        AND ac."redirectUri" = ${redirectUri}
        AND ac."usedAt" IS NULL
        AND ac."expiresAt" > ${now}
        AND u."isActive" = true
        AND u."role" IN ('EMPLOYEE'::"Role", 'ADMIN'::"Role")
      FOR UPDATE OF ac, u
    ),
    consumed AS (
      UPDATE "AuthorizationCode" ac
      SET "usedAt" = ${now}
      FROM eligible
      WHERE ac."id" = eligible."id"
      RETURNING
        eligible."userId",
        eligible."name",
        eligible."email",
        eligible."role"
    )
    SELECT * FROM consumed
  `);
  const identity = rows[0];

  if (!identity) {
    await recordAuthEvent({
      type: AuthEventType.AUTHORIZATION_EXCHANGE_REJECTED,
    });
    return rejected();
  }

  await recordAuthEvent({
    type: AuthEventType.AUTHORIZATION_CODE_EXCHANGED,
    userId: identity.userId,
  });
  return authJson({ user: identity });
}

export const dynamic = "force-dynamic";
