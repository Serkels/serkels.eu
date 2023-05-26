//

import type { HattipHandler } from "@hattip/core";
import { createRouter } from "@hattip/router";
import devServer from "virtual:vite-dev-server";
import { renderPage } from "vite-plugin-ssr/server";
//

const router = createRouter();

//
router.use((ctx) => {
  // console.log(devServer.middlewares.handle);
  devServer.middlewares.handle(
    new Request(ctx.request),
    new Response(),
    ctx.next
  );
});

router.get(async (ctx) => {
  const { request, next } = ctx;
  const { url: urlOriginal } = request;
  // const pageContextInit = { urlOriginal: url }
  // if (url.includes("@react-refresh")) return next();
  const pageContextInit = {
    urlOriginal,
  };
  const pageContext = await renderPage(pageContextInit);
  const { httpResponse } = pageContext;
  if (!httpResponse) return next();
  const { statusCode, body, contentType } = httpResponse;
  // res.setHeader("Content-Type", contentType);
  // res.status(statusCode).send(body);
  const headers = new Headers();
  headers.set("Content-Type", contentType);
  return new Response(body, { headers });
});

export const handler: HattipHandler = router.buildHandler();
export default handler;
