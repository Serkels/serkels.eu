//
import { NextResponse, type NextRequest } from "next/server";

//

async function handler(req: NextRequest) {
  const { pathname } = new URL(req.url);
  const path = pathname.replace("/api/v1/", "");
  const url = new URL(process.env["STRAPI_API_URL"] + "/api/" + path);

  try {
    return NextResponse.redirect(url);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", detail: error },
      { status: 500 }
    );
  }
}

export { handler as GET };
