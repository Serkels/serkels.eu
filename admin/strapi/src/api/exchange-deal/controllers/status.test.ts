//

/// <reference types="bun-types" />

import Strapi from "@strapi/strapi";
import { expect, test } from "bun:test";
import request from "supertest";

test.skip("should return hello world", async () => {
  const strapi = Strapi({});
  await request(strapi.server.httpServer)
    .get("/api/exchange/")
    .expect(200) // Expect response http code 200
    .then((data) => {
      expect(data.text).toBe("Hello World!"); // expect the response text
    });
});
