//

import { HTTPError } from "@1/core/error";
import type { Partner_RequestSchema } from "@1/strapi-openapi";
import debug from "debug";
import type { OpenAPI_Repository } from "~/app/api/v1/OpenAPI.repository";
import { Lifecycle, inject, scoped } from "~/core/di";

//

@scoped(Lifecycle.ContainerScoped)
export class Partner_Repository {
  #log = debug(`~:modules:partner:Partner_Repository`);
  constructor(
    @inject("OpenAPI_Repository") private readonly openapi: OpenAPI_Repository,
  ) {
    this.#log("new");
  }

  async find_me() {
    const trace = this.#log.extend(`find_me`);
    trace("");

    const {
      data: body,
      error: errorBody,
      response,
    } = await this.openapi.client.GET("/partners/me", {
      headers: this.openapi.headers,
    });

    trace(response.status);
    if (errorBody) {
      trace(errorBody);
      throw new HTTPError(
        [errorBody.error.message, "from " + response.url].join("\n"),
        { cause: errorBody.error },
      );
    }

    return body?.data;
  }

  async create_me(data: Partner_RequestSchema["data"]) {
    const trace = this.#log.extend(`create_me`);

    trace("");
    const {
      data: body,
      error: errorBody,
      response,
    } = await this.openapi.client.PUT("/partners/me", {
      headers: this.openapi.headers,
      body: { data },
    });

    trace(response.status);
    if (errorBody) {
      trace(errorBody);
      throw new HTTPError(
        [errorBody.error.message, "from " + response.url].join("\n"),
        { cause: errorBody.error },
      );
    }

    return body?.data;
  }
}
