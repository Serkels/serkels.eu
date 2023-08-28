//

import { HTTPError } from "@1/core/domain";
import type { Deal_CreateProps } from "@1/modules/deal/domain";
import type {
  Exchange_DealListSchema,
  Exchange_DealSchema,
} from "@1/strapi-openapi";
import debug from "debug";
import { OpenAPIRepository, type ApiClient } from "~/app/api/v1";
import type { RepositoryPort } from "~/core";

//

const log = debug("~:modules:exchange:Deal_Repository");
//

export class Deal_Repository
  extends OpenAPIRepository
  implements RepositoryPort
{
  constructor(client: ApiClient, jwt?: string | undefined) {
    super(client, jwt);
    log("new", jwt);
  }

  async create(data: Deal_CreateProps) {
    log("create", data);
    const { response, error: errorBody } = await this.client.POST(
      "/exchange-deals",
      {
        body: {
          data,
        },
        headers: this.headers,
        params: {},
      },
    );

    if (errorBody) {
      log("create", errorBody);
      throw new HTTPError(
        [errorBody.error.message, "from " + response.url].join("\n"),
        { cause: errorBody.error },
      );
    }
  }

  async find_all(exchange_id: number): Promise<Exchange_DealListSchema> {
    log("find_all", exchange_id);
    const {
      data: body,
      error: errorBody,
      response,
    } = await this.client.GET("/exchanges/{id}/deals", {
      headers: this.headers,
      params: {
        path: { id: exchange_id },
      },
    });

    if (errorBody) {
      log("find_all", errorBody);
      throw new HTTPError(
        [errorBody.error.message, "from " + response.url].join("\n"),
        { cause: errorBody.error },
      );
    }

    return body;
  }

  async find_by_id(id: number): Promise<Exchange_DealSchema | undefined> {
    log("find_by_id", id);
    const {
      data: body,
      error: errorBody,
      response,
    } = await this.client.GET("/exchange-deals/{id}", {
      headers: this.headers,
      params: {
        path: { id },
      },
    });

    if (errorBody) {
      log("find_by_id", errorBody);
      throw new HTTPError(
        [errorBody.error.message, "from " + response.url].join("\n"),
        { cause: errorBody.error },
      );
    }

    return body?.data;
  }
}
