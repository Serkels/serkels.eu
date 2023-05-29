//
import { NextResponse, type NextRequest } from "next/server";

//
// export const runtime = "edge";
export async function GET(
  _req: NextRequest,
  { params }: { params: { email: string } }
) {
  const { email } = params;
  console.log("Send Magic Email to ", email);
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
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", detail: error },
      { status: 500 }
    );
  }
}
