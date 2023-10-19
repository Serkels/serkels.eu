//

import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { fromServer } from "~/app/api/v1";

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
  const res: { context: Record<string, unknown> } = await request.json();

  try {
    const email = z
      .string()
      .email()
      .parse(params.email, { path: ["params.email"] });

    const { response, error: errorBody } = await fromServer.POST(
      "/passwordless/send-link",
      {
        body: { email, context: res.context },
      },
    );

    if (errorBody)
      return NextResponse.json(
        {
          error: errorBody.error.name,
          detail: errorBody.error.details,
          message: errorBody.error.message,
        },
        { status: errorBody.error.status },
      );

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", detail: error },
      { status: 500 },
    );
  }
}
