import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { hashPassword, hashSessionToken, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE_NAME } from "@/lib/session-cookie";

const MIN_PASSWORD_LENGTH = 8;

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
  }

  const session = await prisma.session.findUnique({
    where: {
      tokenHash: hashSessionToken(sessionToken),
    },
    include: {
      user: true,
    },
  });

  if (!session || session.expiresAt <= new Date() || !session.user.isActive) {
    return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const currentPassword =
    typeof body?.currentPassword === "string" ? body.currentPassword : "";
  const newPassword = typeof body?.newPassword === "string" ? body.newPassword : "";
  const confirmPassword =
    typeof body?.confirmPassword === "string" ? body.confirmPassword : "";

  if (!currentPassword || !newPassword || !confirmPassword) {
    return NextResponse.json(
      { error: "Current password, new password, and confirmation are required." },
      { status: 400 }
    );
  }

  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json(
      { error: `New password must be at least ${MIN_PASSWORD_LENGTH} characters.` },
      { status: 400 }
    );
  }

  if (newPassword !== confirmPassword) {
    return NextResponse.json(
      { error: "New password and confirmation do not match." },
      { status: 400 }
    );
  }

  const passwordMatches = await verifyPassword(
    currentPassword,
    session.user.passwordHash
  );

  if (!passwordMatches) {
    return NextResponse.json(
      { error: "Current password is incorrect." },
      { status: 401 }
    );
  }

  const nextPasswordHash = await hashPassword(newPassword);

  await prisma.$transaction([
    prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        passwordHash: nextPasswordHash,
      },
    }),
    prisma.session.deleteMany({
      where: {
        userId: session.user.id,
        id: {
          not: session.id,
        },
      },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
