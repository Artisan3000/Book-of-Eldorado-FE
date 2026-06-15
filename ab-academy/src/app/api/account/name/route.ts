import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

const MAX_NAME_PART_LENGTH = 80;

function cleanNamePart(value: unknown) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const firstName = cleanNamePart(body?.firstName);
  const lastName = cleanNamePart(body?.lastName);

  if (!firstName || !lastName) {
    return NextResponse.json(
      { error: "First name and last name are required." },
      { status: 400 }
    );
  }

  if (
    firstName.length > MAX_NAME_PART_LENGTH ||
    lastName.length > MAX_NAME_PART_LENGTH
  ) {
    return NextResponse.json(
      { error: "First name and last name must be 80 characters or fewer." },
      { status: 400 }
    );
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      name: `${firstName} ${lastName}`,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  return NextResponse.json({ user: updatedUser });
}
