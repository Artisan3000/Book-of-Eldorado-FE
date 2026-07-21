import { AuthEventType } from "@prisma/client";
import { recordAuthEvent } from "@/lib/auth/audit";
import { hashAuthIdentifier } from "@/lib/auth/identifiers";
import { getClientIp, requireBrowserMutation } from "@/lib/auth/request-security";
import { authJson } from "@/lib/auth/responses";
import { destroyCurrentSession, getCurrentUser } from "@/lib/session";

export async function POST(request: Request) {
  const requestError = requireBrowserMutation(request);
  if (requestError) return requestError;

  const user = await getCurrentUser();
  await destroyCurrentSession();
  await recordAuthEvent({
    type: AuthEventType.LOGOUT,
    userId: user?.id,
    ipHash: hashAuthIdentifier("ip", getClientIp(request)),
  });

  return authJson({ ok: true });
}
