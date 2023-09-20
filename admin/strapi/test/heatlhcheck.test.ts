//
import Strapi from "@strapi/strapi";
import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import fs from "fs";
// import { setupStrapi, stopStrapi } from "./../helpers/strapi";

let instance;
export async function setupStrapi() {
  if (!instance) {
    await Strapi({
      appDir: process.cwd(),
      distDir: process.cwd() + "/dist",
      autoReload: false,
      serveAdminPanel: false,
    }).load();
    instance = strapi;

    await instance.server.mount();
  }
  return instance;
}

async function cleanupStrapi() {
  const dbSettings = strapi.config.get("database.connection");

  await strapi.server.httpServer.close();

  await strapi.db.connection.destroy();

  if (dbSettings && dbSettings.connection && dbSettings.connection.filename) {
    const tmpDbFile = dbSettings.connection.filename;
    if (fs.existsSync(tmpDbFile)) {
      fs.unlinkSync(tmpDbFile);
    }
  }
}

beforeAll(async () => {
  await setupStrapi(); // singleton so it can be called many times
});

afterAll(async () => {
  await cleanupStrapi();
});

describe("Strapi is defined", () => {
  it("just works", () => {
    // const
    expect(strapi).toBeDefined();
  });
});
