//

import { HTTPError } from "@1/core/domain";
import type { Exchange_CreateProps } from "@1/modules/exchange/domain";
import type {
  Exchange_DealListSchema,
  Exchange_DealSchema,
  Exchange_ItemSchema,
  Exchange_ListSchema,
} from "@1/strapi-openapi";
import debug from "debug";
import { Lifecycle, inject, scoped } from "tsyringe";
import { OpenAPI_Repository } from "~/app/api/v1/OpenAPI.repository";
import type { RepositoryPort } from "~/core";
import type { Exchanges_QueryProps } from "./Exchange_QueryProps";

//

@scoped(Lifecycle.ContainerScoped)
export class Exchange_Repository implements RepositoryPort {
  #log = debug(`~:modules:exchange:${Exchange_Repository.name}`);
  constructor(
    @inject(OpenAPI_Repository) private readonly openapi: OpenAPI_Repository,
  ) {
    this.#log("new");
  }

  get is_authorized() {
    return Boolean(this.openapi.jwt);
  }

  async create(data: Exchange_CreateProps) {
    this.#log("create", data);
    const { response, error: errorBody } = await this.openapi.client.POST(
      "/exchanges",
      {
        body: {
          data,
        },
        headers: this.openapi.headers,
        params: {},
      },
    );

    if (errorBody) {
      this.#log("create", errorBody);
      throw new HTTPError(
        [errorBody.error.message, "from " + response.url].join("\n"),
        { cause: errorBody.error },
      );
    }
  }

  async find_all({
    filter,
    sort,
    pagination,
  }: Exchanges_QueryProps): Promise<Exchange_ListSchema> {
    this.#log("findAll", filter);
    const { category, search } = filter ?? {};
    const {
      data: body,
      error: errorBody,
      response,
    } = await this.openapi.client.GET("/exchanges", {
      headers: this.openapi.headers,
      params: {
        query: {
          filters: {
            $and: [
              {
                category: {
                  slug: { $eq: category },
                },
              },
            ],
            $or: [
              {
                title: {
                  $containsi: search,
                },
              },
            ],
          },
          pagination: {
            page: pagination?.page,
            pageSize: pagination?.pageSize,
          },
          sort,
        } as any,
      },
    });

    if (errorBody) {
      this.#log("findAll", errorBody);
      throw new HTTPError(
        [errorBody.error.message, "from " + response.url].join("\n"),
        { cause: errorBody.error },
      );
    }

    return body;
  }

  async find_all_mine({
    filter,
    sort,
    pagination,
  }: Exchanges_QueryProps): Promise<Exchange_ListSchema> {
    this.#log("find_all_mine", filter);

    const {
      data: body,
      error: errorBody,
      response,
    } = await this.openapi.client.GET("/exchanges;participe", {
      headers: this.openapi.headers,
      params: {
        query: {
          pagination: {
            page: pagination?.page,
            pageSize: pagination?.pageSize,
          },
          sort,
        } as any,
      },
    });

    if (errorBody) {
      this.#log("find_all_mine", errorBody);
      throw new HTTPError(
        [errorBody.error.message, "from " + response.url].join("\n"),
        { cause: errorBody.error },
      );
    }

    return body;
  }

  async find_all_owned({
    filter,
    sort,
    pagination,
  }: Exchanges_QueryProps): Promise<Exchange_ListSchema> {
    this.#log("find_all_owned", filter);

    const {
      data: body,
      error: errorBody,
      response,
    } = await this.openapi.client.GET("/exchanges;owned", {
      headers: this.openapi.headers,
      params: {
        query: {
          pagination: {
            page: pagination?.page,
            pageSize: pagination?.pageSize,
          },
          sort,
        } as any,
      },
    });

    if (errorBody) {
      this.#log("find_all_owned", errorBody);
      throw new HTTPError(
        [errorBody.error.message, "from " + response.url].join("\n"),
        { cause: errorBody.error },
      );
    }

    return body;
  }

  async by_id(id: number): Promise<Exchange_ItemSchema | undefined> {
    this.#log("findById", id);
    const {
      data: body,
      error: errorBody,
      response,
    } = await this.openapi.client.GET("/exchanges/{id}", {
      headers: this.openapi.headers,
      params: {
        path: { id },
      },
    });

    if (errorBody) {
      this.#log("findById", errorBody);
      throw new HTTPError(
        [errorBody.error.message, "from " + response.url].join("\n"),
        { cause: errorBody.error },
      );
    }

    return body?.data;
  }

  async find_deal_by_participant(
    exchange_id: number,
    user_id: number,
  ): Promise<Exchange_DealListSchema> {
    this.#log("find_deal_by_participant", exchange_id);
    const {
      data: body,
      error: errorBody,
      response,
    } = await this.openapi.client.GET("/exchanges/{id}/deals", {
      headers: this.openapi.headers,
      params: {
        path: { id: exchange_id },
        query: {
          filters: {
            participant: user_id,
          },
        } as any,
      },
    });

    if (errorBody) {
      this.#log("deals", errorBody);
      throw new HTTPError(
        [errorBody.error.message, "from " + response.url].join("\n"),
        { cause: errorBody.error },
      );
    }

    return body;
  }

  async findDealById(id: number): Promise<Exchange_DealSchema | undefined> {
    this.#log("findDealById", id);
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
      this.#log("findDealById", errorBody);
      throw new HTTPError(
        [errorBody.error.message, "from " + response.url].join("\n"),
        { cause: errorBody.error },
      );
    }

    return body?.data;
  }
}
