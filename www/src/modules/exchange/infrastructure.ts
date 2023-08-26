//

import { HTTPError } from "@1/core/domain";
import type { Exchange_CreateProps } from "@1/modules/exchange/domain";
import type {
  Exchange_DealListSchema,
  Exchange_ItemSchema,
  Exchange_ListSchema,
} from "@1/strapi-openapi";
import debug from "debug";
import { OpenAPIRepository, type ApiClient } from "~/app/api/v1";
import type { RepositoryPort } from "~/core";
import type { Exchange_QueryProps } from "./Exchange_QueryProps";
// import type { ExchangeListSchema, Exchange_DTO } from "./dto";
// import type { Exchange_CreateProps, Exchange_Entity } from "./entity";

//

const log = debug("~:modules:exchange:Exchange_Repository");
//

export class Exchange_Repository
  extends OpenAPIRepository
  implements RepositoryPort
{
  constructor(client: ApiClient, jwt?: string | undefined) {
    super(client, jwt);
    log("new", jwt);
  }

  async create(data: Exchange_CreateProps) {
    log("create", data);
    const { response, error: errorBody } = await this.client.POST(
      "/exchanges",
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

  async findAll({
    filter,
    sort,
    pagination,
  }: Exchange_QueryProps): Promise<Exchange_ListSchema> {
    log("findAll", filter);
    const { category, search } = filter ?? {};
    const {
      data: body,
      error: errorBody,
      response,
    } = await this.client.GET("/exchanges", {
      headers: this.headers,
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
      log("findAll", errorBody);
      throw new HTTPError(
        [errorBody.error.message, "from " + response.url].join("\n"),
        { cause: errorBody.error },
      );
    }

    return body;
  }

  async findAllMine({
    filter,
    sort,
    pagination,
  }: Exchange_QueryProps): Promise<Exchange_ListSchema> {
    log("findAllMine", filter);

    const {
      data: body,
      error: errorBody,
      response,
    } = await this.client.GET("/my/exchanges", {
      headers: this.headers,
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
      log("findAllMine", errorBody);
      throw new HTTPError(
        [errorBody.error.message, "from " + response.url].join("\n"),
        { cause: errorBody.error },
      );
    }

    return body;
  }

  async findById(id: number): Promise<Exchange_ItemSchema | undefined> {
    log("findById", id);
    const {
      data: body,
      error: errorBody,
      response,
    } = await this.client.GET("/exchanges/{id}", {
      headers: this.headers,
      params: {
        path: { id },
      },
    });

    if (errorBody) {
      log("findById", errorBody);
      throw new HTTPError(
        [errorBody.error.message, "from " + response.url].join("\n"),
        { cause: errorBody.error },
      );
    }

    return body?.data;
  }

  async deals(id: number): Promise<Exchange_DealListSchema> {
    log("discussions", id);
    const {
      data: body,
      error: errorBody,
      response,
    } = await this.client.GET("/exchanges/{id}/deals", {
      headers: this.headers,
      params: {
        path: { id },
      },
    });

    if (errorBody) {
      log("create", errorBody);
      throw new HTTPError(
        [errorBody.error.message, "from " + response.url].join("\n"),
        { cause: errorBody.error },
      );
    }

    return body;
  }
}
