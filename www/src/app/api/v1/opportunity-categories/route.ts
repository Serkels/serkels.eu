//
import { NextResponse, type NextRequest } from "next/server";

//
// export const runtime = "edge";
export async function GET(_req: NextRequest) {
  try {
    return await fetch(
      process.env["STRAPI_API_URL"] + "/api/opportunity-categories"
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", detail: error },
      { status: 500 }
    );
  }
}
