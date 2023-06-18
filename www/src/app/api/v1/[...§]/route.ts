//

import { NextResponse } from "next/server";

// import type {  headers, cookies } from "next/headers";

async function handler() {
  return await fetch(
    new URL(process.env["STRAPI_API_URL"] + "/api/opportunity-categories")
  );
}
function _handler(request: Request) {
  // const redirect = response.headers.get("Location")
  // if (body?.json === "true" && redirect) {
  //   response.headers.delete("Location")
  //   response.headers.set("Content-Type", "application/json")
  //   return new Response(JSON.stringify({ url: redirect }), {
  //     headers: response.headers,
  //   })
  // }

  // console.log(req);
  console.log(import.meta.url);
  console.log(process.env["STRAPI_API_URL"]);
  // console.log(request.url);
  // console.log(new URL(process.env["STRAPI_API_URL"], request.url));
  // console.log(request.url.toString());
  // console.log(import.meta.url);
  // console.log(req.url);

  return NextResponse.redirect(
    new URL("http://localhost:1337/api/opportunity-categories", request.url)
    // new URL(process.env["STRAPI_API_URL"], request.url)
  );

  // return new Response(JSON.stringify({ url: process.env["STRAPI_API_URL"] }), {
  // headers: response.headers,
  // });
}
export { handler as GET, handler as POST };
