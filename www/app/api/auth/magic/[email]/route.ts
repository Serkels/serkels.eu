//

import { appRouter, createContext } from ":api/trpc/[trpc]";
import { fromServer } from "app/api/v1";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

//

export async function GET(
  req: NextRequest,
  { params }: { params: { email: string } },
) {
  const { email } = params;

  const caller = appRouter.createCaller(await createContext({ req } as any));

  try {
    const sdf = await caller.passwordless.send_magic_link({ email });
    console.log({ sdf });
    return sdf;
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Internal Server Error", detail: error },
      { status: 500 },
    );
  }
  // console.log(result);
  // try {
  //   return await fetch(
  //     process.env["STRAPI_API_URL"] + "/api/passwordless/send-link",
  //     {
  //       method: "POST",
  //       body: JSON.stringify({
  //         email,
  //       }),
  //       headers: {
  //         "Content-type": "application/json; charset=UTF-8",
  //       },
  //     },
  //   );
  // } catch (error) {
  //   return NextResponse.json(
  //     { error: "Internal Server Error", detail: error },
  //     { status: 500 },
  //   );
  // }
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
