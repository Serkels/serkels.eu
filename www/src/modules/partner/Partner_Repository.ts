//

import { HTTPError } from "@1/core/error";
import type { Partner_RequestSchema } from "@1/strapi-openapi";
import debug from "debug";
import { OpenAPI_Repository } from "~/app/api/v1/OpenAPI.repository";

//

export class Partner_Repository extends OpenAPI_Repository {
  #log = debug(`~:modules:partner:${Partner_Repository.name}`);
  async find_me() {
    this.#log("find_me");

    const {
      data: body,
      error: errorBody,
      response,
    } = await this.client.GET("/partners/me", {
      headers: this.headers,
    });

    if (errorBody) {
      throw new HTTPError(
        [errorBody.error.message, "from " + response.url].join("\n"),
        { cause: errorBody.error },
      );
    }

    return body?.data;
  }

  async create_me(data: Partner_RequestSchema["data"]) {
    this.#log("create_me");

    const {
      data: body,
      error: errorBody,
      response,
    } = await this.client.PUT("/partners/me", {
      headers: this.headers,
      body: { data },
    });

    if (errorBody) {
      throw new HTTPError(
        [errorBody.error.message, "from " + response.url].join("\n"),
        { cause: errorBody.error },
      );
    }

    return body?.data;
  }
}
