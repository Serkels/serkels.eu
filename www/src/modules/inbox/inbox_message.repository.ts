//

import { HTTPError } from "@1/core/domain";
import type { Strapi_Query_Params } from "@1/modules/common";
import type { Message_Schema } from "@1/modules/inbox/infra/strapi";
import type { Comment_ListSchema } from "@1/strapi-openapi";
import debug from "debug";
import { OpenAPIRepository, type ApiClient } from "~/app/api/v1";
import type { RepositoryPort } from "~/core";

//

const log = debug("~:modules:exchange:Inbox_Message_Repository");

//

export class Inbox_Message_Repository
  extends OpenAPIRepository
  implements RepositoryPort
{
  constructor(
    client: ApiClient,
    jwt: string | undefined,
    public thread_id: number,
  ) {
    super(client, jwt);
    log("new", jwt);
  }

  async create(body: { content: string }) {
    log("create", body);
    const { response, error: errorBody } = await this.client.POST(
      "/inbox/{id}/messages",
      {
        body,
        headers: this.headers,
        params: { path: { id: this.thread_id } },
      },
    );

    if (errorBody) {
      log("create", errorBody);
      throw new HTTPError(
        [errorBody.error.message, "from " + response.url].join("\n"),
        { cause: errorBody.error },
      );
    }
    return Promise.resolve();
  }

  async find_all({
    pagination,
  }: Strapi_Query_Params<Message_Schema>): Promise<Comment_ListSchema> {
    const trace = log.extend(
      `find_all(thread_id=${this.thread_id}, pageSize=${pagination?.pageSize}, page=${pagination?.page})`,
    );

    trace("");
    const {
      data: body,
      error: errorBody,
      response,
    } = await this.client.GET("/inbox/{id}/messages", {
      headers: this.headers,
      params: {
        path: { id: this.thread_id },
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
      trace(errorBody);
      throw new HTTPError(
        [errorBody.error.message, "from " + response.url].join("\n"),
        { cause: errorBody.error },
      );
    }

    trace("200");
    return body;
  }
}
