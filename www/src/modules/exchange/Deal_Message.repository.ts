//

import { HTTPError } from "@1/core/domain";
import type { Strapi_Query_Params } from "@1/modules/common";
import type { Message_Schema } from "@1/modules/inbox/infra/strapi";
import type { Comment_ListSchema } from "@1/strapi-openapi";
import debug from "debug";
import { type ApiClient } from "~/app/api/v1";
import { OpenAPI_Repository } from "~/app/api/v1/OpenAPI.repository";
import type { RepositoryPort } from "~/core";

//

const log = debug("~:modules:exchange:Deal_Message_Repository");
//

export class Deal_Message_Repository
  extends OpenAPI_Repository
  implements RepositoryPort
{
  constructor(
    client: ApiClient,
    jwt: string | undefined,
    public deal_id: number,
  ) {
    super(client, jwt);
    log("new", jwt);
  }

  async create(body: { content: string }) {
    log("create", body);
    const { response, error: errorBody } = await this.client.POST(
      "/deals/{id}/messages",
      {
        body,
        headers: this.headers,
        params: { path: { id: this.deal_id } },
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

  async find_all({
    pagination,
  }: Strapi_Query_Params<Message_Schema>): Promise<Comment_ListSchema> {
    log("find_messages (deal_id=%d)", this.deal_id);
    const {
      data: body,
      error: errorBody,
      response,
    } = await this.client.GET("/deals/{id}/messages", {
      headers: this.headers,
      params: {
        path: { id: this.deal_id },
        query: {
          pagination: {
            page: pagination?.page,
            pageSize: pagination?.pageSize,
            withCount: true,
          } as any,
          sort: "createdAt:desc",
        },
      },
    });

    if (errorBody) {
      log("find_messages (deal_id=%d)", this.deal_id, errorBody);
      throw new HTTPError(
        [errorBody.error.message, "from " + response.url].join("\n"),
        { cause: errorBody.error },
      );
    }

    log("find_messages (deal_id=%d) 200", this.deal_id);
    return body;
  }
}
