//

import Strapi from "@strapi/strapi";
import { expect, test } from "bun:test";
import request from "supertest";

test("should return hello world", async () => {
  debugger;
  const strapi = Strapi({
    appDir: process.cwd(),
    distDir: process.cwd() + "/dist",
    autoReload: false,
    serveAdminPanel: false,
  });
  await request(strapi.server.httpServer)
    .get(`/api/deals/42/messages`)
    .expect(200) // Expect response http code 200
    .then((data) => {
      expect(data.text).toBe("Hello World!"); // expect the response text
    });
});
