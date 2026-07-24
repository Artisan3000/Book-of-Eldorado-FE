import "server-only";

import { AuthEventType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type AuthEventInput = {
  type: AuthEventType;
  userId?: string | null;
  identifierHash?: string | null;
  ipHash?: string | null;
};

export async function recordAuthEvent(input: AuthEventInput) {
  try {
    await prisma.authEvent.create({
      data: {
        type: input.type,
        userId: input.userId ?? null,
        identifierHash: input.identifierHash ?? null,
        ipHash: input.ipHash ?? null,
      },
    });
  } catch (error) {
    console.error("Unable to record authentication event.", error);
  }
}
