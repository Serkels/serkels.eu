//

import { HTTPError } from "@1/core/domain";
import type { Strapi_Query_Params } from "@1/modules/common";
import type { Message_Schema } from "@1/modules/inbox/infra/strapi";
import type { Inbox_ListSchema } from "@1/strapi-openapi";
import debug from "debug";
import { OpenAPIRepository, type ApiClient } from "~/app/api/v1";
import type { RepositoryPort } from "~/core";

//

const log = debug("~:modules:exchange:Inbox_Repository");

//

export class Inbox_Repository
  extends OpenAPIRepository
  implements RepositoryPort
{
  constructor(client: ApiClient, jwt: string | undefined) {
    super(client, jwt);
    log("new", jwt);
  }

  // async create(body: { content: string }) {
  //   log("create", body);
  //   const { response, error: errorBody } = await this.client.POST(
  //     "/inbox/{id}/messages",
  //     {
  //       body,
  //       headers: this.headers,
  //       params: { path: { id: this.thread_id } },
  //     },
  //   );

  //   if (errorBody) {
  //     log("create", errorBody);
  //     throw new HTTPError(
  //       [errorBody.error.message, "from " + response.url].join("\n"),
  //       { cause: errorBody.error },
  //     );
  //   }
  //   return Promise.resolve();
  // }

  async find_all({
    pagination,
  }: Strapi_Query_Params<Message_Schema>): Promise<Inbox_ListSchema> {
    const trace = log.extend(
      `find_all(pageSize=${pagination?.pageSize}, page=${pagination?.page})`,
    );

    trace("");
    const {
      data: body,
      error: errorBody,
      response,
    } = await this.client.GET("/inboxes", {
      headers: this.headers,
      params: {
        query: {
          pagination: {
            page: pagination?.page,
            pageSize: pagination?.pageSize,
            withCount: true,
          },
          sort: "updatedAt:desc",
        } as any,
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
