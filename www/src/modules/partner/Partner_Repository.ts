//

import { HTTPError } from "@1/core/error";
import type { Partner_RequestSchema } from "@1/strapi-openapi";
import { OpenAPIRepository } from "~/app/api/v1";

//

export class Partner_Repository extends OpenAPIRepository {
  async find_me() {
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
