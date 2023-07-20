//

import { NextResponse, type NextRequest } from "next/server";

//

export async function GET(
  _req: NextRequest,
  { params }: { params: { email: string } },
) {
  const { email } = params;

  try {
    return await fetch(
      process.env["STRAPI_API_URL"] + "/api/passwordless/send-link",
      {
        method: "POST",
        body: JSON.stringify({
          email,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", detail: error },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { email: string } },
) {
  const { email } = params;
  const res: { context: Record<string, unknown> } = await request.json();

  try {
    return await fetch(
      process.env["STRAPI_API_URL"] + "/api/passwordless/send-link",
      {
        method: "POST",
        body: JSON.stringify({ email, context: res.context }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", detail: error },
      { status: 500 },
    );
  }
}
