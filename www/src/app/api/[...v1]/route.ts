//

import type { NextApiRequest, NextApiResponse } from "next";
// import type {  headers, cookies } from "next/headers";

function handler(req: NextApiRequest, res: NextApiResponse, options: any) {
  // const redirect = response.headers.get("Location")
  // if (body?.json === "true" && redirect) {
  //   response.headers.delete("Location")
  //   response.headers.set("Content-Type", "application/json")
  //   return new Response(JSON.stringify({ url: redirect }), {
  //     headers: response.headers,
  //   })
  // }

  console.log(req);

  return new Response(JSON.stringify({ url: process.env["STRAPI_API_URL"] }), {
    // headers: response.headers,
  });
}
export { handler as GET, handler as POST };
