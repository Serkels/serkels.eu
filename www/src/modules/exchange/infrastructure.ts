//

import { HTTPError } from "@1/core/domain";
import type { Exchange_CreateProps } from "@1/modules/exchange/domain";
import debug from "debug";
import { OpenAPIRepository, type ApiClient } from "~/app/api/v1";
import type { RepositoryPort } from "~/core";
// import type { ExchangeListSchema, Exchange_DTO } from "./dto";
// import type { Exchange_CreateProps, Exchange_Entity } from "./entity";

//

const log = debug("~:modules:exchange:Exchange_Repository");
type Exchange_DTO = unknown;
//

export type Exchange_QueryProps = {
  filter?: { search?: string | undefined; category?: string | undefined };
  pagination?: { pageSize?: number; page?: number };
  sort?: `${keyof NonNullable<NonNullable<Exchange_DTO>>}:${"asc" | "desc"}`[];
};

export class Exchange_Repository
  extends OpenAPIRepository
  implements RepositoryPort
{
  constructor(client: ApiClient, jwt?: string | undefined) {
    super(client, jwt);
    log("new", jwt);
  }

  async create(entity: Exchange_CreateProps) {
    log("create", entity);

    const { response, error: errorBody } = await this.client.POST(
      "/exchanges",
      {
        body: {
          data: entity,
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
}
