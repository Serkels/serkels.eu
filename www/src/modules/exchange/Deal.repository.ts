//

import { Lifecycle, inject, scoped } from "@1/core/di";
import { HTTPError } from "@1/core/domain";
import type { Strapi_Query_Params } from "@1/modules/common";
import type { Deal_CreateProps } from "@1/modules/deal/domain";
import type {
  Exchange_DealListSchema,
  Exchange_Deal_ItemSchema,
  Exchange_Deal_Schema,
} from "@1/strapi-openapi";
import debug from "debug";
import { OpenAPI_Repository } from "~/app/api/v1/OpenAPI.repository";
import { Exchange_Repository } from "./Exchange_Repository";

//

export type Deal_QueryProps = Strapi_Query_Params<
  Pick<Exchange_Deal_Schema, "updatedAt">
>;

// @registry([
//   {
//     token: Exchange_Repository.EXCHANGE_ID_TOKEN,
//     useValue: NaN,
//     // options: { lifecycle: Lifecycle.ContainerScoped },
//   },
// ])

@scoped(Lifecycle.ContainerScoped)
export class Deal_Repository {
  #log = debug(`~:modules:deal:${Deal_Repository.name}`);
  constructor(
    @inject(OpenAPI_Repository) private readonly openapi: OpenAPI_Repository,
    @inject(Exchange_Repository.EXCHANGE_ID_TOKEN)
    public readonly exchange_id: number,
  ) {
    this.#log("new");
  }

  get is_authorized() {
    return Boolean(this.openapi.jwt);
  }

  async create(data: Deal_CreateProps) {
    const trace = this.#log.extend(`create(data=${data.exchange})`);

    trace("");
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

    trace(response.status);
    if (errorBody) {
      trace(errorBody);
      throw new HTTPError(
        [errorBody.error.message, "from " + response.url].join("\n"),
        { cause: errorBody.error },
      );
    }
  }

  async find_all(
    exchange_id: number,
    query: Deal_QueryProps,
  ): Promise<Exchange_DealListSchema> {
    const pagination = {
      page: query.pagination?.page,
      pageSize: query.pagination?.pageSize,
    };
    const sort = query.sort;

    const trace = this.#log.extend(
      `find_all(` +
        `exchange_id=${exchange_id},` +
        `pageSize=${pagination?.pageSize},` +
        `page=${pagination?.page},` +
        `sort=${sort}` +
        `)`,
    );

    trace("");
    const {
      data: body,
      error: errorBody,
      response,
    } = await this.openapi.client.GET("/exchanges/{id}/deals", {
      headers: this.openapi.headers,
      params: {
        path: { id: exchange_id },
        query: {
          pagination,
          sort,
        } as any,
      },
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

  async find_by_id(
    deal_id: number,
  ): Promise<Exchange_Deal_ItemSchema | undefined> {
    const { exchange_id } = this;
    const trace = this.#log.extend(
      `find_by_id(exchange_id=${exchange_id},deal_id=${deal_id})`,
    );
    trace("");
    const {
      data: body,
      error: errorBody,
      response,
    } = await this.openapi.client.GET(
      "/exchanges/{exchange_id}/deals/{deal_id}",
      {
        headers: this.openapi.headers,
        params: {
          path: { deal_id, exchange_id },
        },
      },
    );

    trace(response.status);
    if (errorBody) {
      trace(errorBody);
      throw new HTTPError(
        [errorBody.error.message, "from " + response.url].join("\n"),
        { cause: errorBody.error },
      );
    }

    return body.data;
  }
}
