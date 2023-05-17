import { chromium, type Browser, type Page } from "playwright";
import type { ViteDevServer } from "vite";

import { createServer } from "vite";
import { afterAll, beforeAll, beforeEach, test } from "vitest";

//

export interface PlaywrightLikeVitestContext {
  browser: Browser;
  localhost: (pathname: string) => string;
  page: Page;
}

//

let server: ViteDevServer;
let browser: Browser;
let page: Page;

const _afterAll = () =>
  afterAll(async () => {
    await browser.close();
    await stopServer(server);
  });

const _beforeAll = ({ headless }: { headless: boolean }) =>
  beforeAll(async () => {
    server = await createServer();
    await server.listen(0);
    browser = await chromium.launch({ headless });
    page = await browser.newPage();
  });

const _beforeEach = () =>
  beforeEach<PlaywrightLikeVitestContext>(async (context) => {
    context.browser = browser;
    context.page = page;
    context.localhost = (pathname) =>
      `http://localhost:${server.config.server.port}${pathname}`;
  });

const _test = test<PlaywrightLikeVitestContext>;

export {
  _afterAll as afterAll,
  _beforeAll as beforeAll,
  _beforeEach as beforeEach,
  _test as test,
};

//

async function stopServer(server: ViteDevServer) {
  return new Promise<void>((resolve, reject) =>
    server.httpServer?.close((err) => {
      if (err) reject(err);
      resolve();
    })
  );
}
