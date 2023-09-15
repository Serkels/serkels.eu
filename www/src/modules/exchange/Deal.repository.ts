//

import { HTTPError } from "@1/core/domain";
import type { Deal_CreateProps } from "@1/modules/deal/domain";
import type {
  Exchange_DealListSchema,
  Exchange_DealSchema,
} from "@1/strapi-openapi";
import debug from "debug";
import { Lifecycle, inject, scoped } from "tsyringe";
import { OpenAPI_Repository } from "~/app/api/v1/OpenAPI.repository";
import { Bookmarks_Repository } from "../bookmarks/bookmarks.repository";

//

const log = debug("~:modules:exchange:Deal_Repository");
//


@scoped(Lifecycle.ContainerScoped)
export class Deal_Repository {
  #log = debug(`~:modules:deal:${Bookmarks_Repository.name}`);
  constructor(
    @inject(OpenAPI_Repository) private readonly openapi: OpenAPI_Repository,
  ) {
    this.#log("new");
  }


  get is_authorized() {
    return Boolean(this.openapi.jwt);
  }

  async create(data: Deal_CreateProps) {
    log("create", data);
    const { response, error: errorBody } = await this.openapi.client.POST(
      "/exchange-deals",
      {
        body: {
          data,
        },
        headers: this.openapi.headers,
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
    } = await this.openapi.client.GET("/exchanges/{id}/deals", {
      headers: this.openapi.headers,
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
    } = await this.openapi.client.GET("/exchange-deals/{id}", {
      headers: this.openapi.headers,
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
