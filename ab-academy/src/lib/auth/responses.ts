import { NextResponse } from "next/server";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store",
  Pragma: "no-cache",
};

export function authJson(
  body: unknown,
  init: ResponseInit = {}
) {
  const headers = new Headers(init.headers);

  for (const [name, value] of Object.entries(NO_STORE_HEADERS)) {
    headers.set(name, value);
  }

  return NextResponse.json(body, { ...init, headers });
}
