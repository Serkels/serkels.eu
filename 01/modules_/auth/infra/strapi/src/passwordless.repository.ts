//

import { HTTPError, type OpenAPI_Repository } from "@1/core_";
import type { ApiClient } from "@1/strapi-openapi";
import debug from "debug";
import { Lifecycle, injectable, scoped } from "tsyringe";

//

@scoped(Lifecycle.ContainerScoped)
@injectable()
export class Passwordless_Repository {
  #log = debug(`~:modules:partner:Partner_Repository`);
  constructor(private readonly openapi: OpenAPI_Repository<ApiClient>) {
    this.#log("new");
  }

  async send(loginToken: string) {
    const trace = this.#log.extend(`login`);
    trace("");

    const {
      data: body,
      error: errorBody,
      response,
    } = await this.openapi.client.GET("/passwordless/login", {
      params: { query: { loginToken } },
    });

    trace(response.status);
    if (errorBody) {
      trace(errorBody);
      throw new HTTPError(
        [errorBody.error.message, "from " + response.url].join("\n"),
        { cause: errorBody.error },
      );
    }

    return body;
  }

  async login(loginToken: string) {
    const trace = this.#log.extend(`login`);
    trace("");

    const {
      data: body,
      error: errorBody,
      response,
    } = await this.openapi.client.GET("/passwordless/login", {
      params: { query: { loginToken } },
    });

    trace(response.status);
    if (errorBody) {
      trace(errorBody);
      throw new HTTPError(
        [errorBody.error.message, "from " + response.url].join("\n"),
        { cause: errorBody.error },
      );
    }

    return body;
  }
}
