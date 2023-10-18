//

import { NextResponse } from "next/server";

// A faulty API route to test Sentry's error monitoring

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (id) throw new Error(`Sentry Example API Route Error ${id}`);

  return NextResponse.json({ data: "Testing Sentry Error..." });
}
