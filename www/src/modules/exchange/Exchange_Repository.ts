//

import { HTTPError, type UID } from "@1/core/domain";
import type { Strapi_Query_Params } from "@1/modules/common";
import type { Exchange_CreateProps } from "@1/modules/exchange/domain";
import type {
  Exchange_DealListSchema,
  Exchange_Deal_ItemSchema,
  Exchange_ItemSchema,
  Exchange_ListSchema,
  Exchange_RequestSchema,
  Exchange_Schema,
} from "@1/strapi-openapi";
import debug from "debug";
import { OpenAPI_Repository } from "~/app/api/v1/OpenAPI.repository";
import type { RepositoryPort } from "~/core";
import { Lifecycle, inject, scoped, type InjectionToken } from "~/core/di";

//

export type Exchanges_QueryProps = Strapi_Query_Params<
  Pick<Exchange_Schema, "category" | "createdAt" | "title" | "updatedAt">
>;

//

@scoped(Lifecycle.ContainerScoped)
export class Exchange_Repository implements RepositoryPort {
  #log = debug(`~:modules:exchange:${Exchange_Repository.name}`);
  static EXCHANGE_ID_TOKEN = "EXCHANGE_ID_TOKEN" as InjectionToken<number>;

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
          data: data as Exchange_RequestSchema["data"],
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

  async update(id: number, data: Exchange_CreateProps) {
    this.#log("create", data);
    const { response, error: errorBody } = await this.openapi.client.PUT(
      "/exchanges/{id}",
      {
        body: {
          data: data as Exchange_RequestSchema["data"],
        },
        headers: this.openapi.headers,
        params: { path: { id } },
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
  async find_all(query: Exchanges_QueryProps): Promise<Exchange_ListSchema> {
    this.#log("find_all", query);

    const pagination = {
      page: query.pagination?.page,
      pageSize: query.pagination?.pageSize,
    };

    const filters = {
      $and: [
        {
          category: {
            slug: { $eq: query.filters?.category },
          },
        },
      ],
      $or: [
        {
          title: {
            $containsi: query.filters?.title,
          },
        },
      ],
    };

    const sort = query.sort;

    const {
      data: body,
      error: errorBody,
      response,
    } = await this.openapi.client.GET("/exchanges", {
      headers: this.openapi.headers,
      params: {
        query: {
          filters,
          pagination,
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

  async find_all_mine(
    query: Exchanges_QueryProps,
  ): Promise<Exchange_ListSchema> {
    this.#log("find_all_mine", query);

    const pagination = {
      page: query.pagination?.page,
      pageSize: query.pagination?.pageSize,
    };

    const sort = query.sort;

    const {
      data: body,
      error: errorBody,
      response,
    } = await this.openapi.client.GET("/exchanges;participe", {
      headers: this.openapi.headers,
      params: {
        query: {
          pagination,
          sort,
        },
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

  async find_all_owned(
    query: Exchanges_QueryProps,
  ): Promise<Exchange_ListSchema> {
    this.#log("find_all_owned", query);

    const pagination = {
      page: query.pagination?.page,
      pageSize: query.pagination?.pageSize,
    };

    const sort = query.sort;
    const {
      data: body,
      error: errorBody,
      response,
    } = await this.openapi.client.GET("/exchanges;owned", {
      headers: this.openapi.headers,
      params: {
        query: {
          pagination,
          sort,
        },
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

  async by_id(id: UID): Promise<Exchange_ItemSchema | undefined> {
    this.#log("findById", id.value());

    const {
      data: body,
      error: errorBody,
      response,
    } = await this.openapi.client.GET("/exchanges/{id}", {
      headers: this.openapi.headers,
      params: {
        path: { id: Number(id.value()) },
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
    exchange_id: UID,
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
        path: { id: Number(exchange_id) },
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

  async findDealById(
    id: number,
  ): Promise<Exchange_Deal_ItemSchema | undefined> {
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
