//

import { HTTPError } from "@1/core/domain";
import type { Strapi_Query_Params } from "@1/modules/common";
import type { Message_Schema } from "@1/modules/inbox/infra/strapi";
import type { Inbox_ItemSchema, Inbox_ListSchema } from "@1/strapi-openapi";
import debug from "debug";
import { match } from "ts-pattern";
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

  async create(profile_id: number) {
    log("create", profile_id);
    const {
      data: body,
      response,
      error: errorBody,
    } = await this.client.POST("/inbox/to/{profile_id}", {
      headers: this.headers,
      params: { path: { profile_id } },
    });

    //

    if (errorBody) {
      throw new HTTPError(
        `${response.url} ${response.status} : ${errorBody.error.name}`,
        { cause: errorBody.error },
      );
    }

    return body.data;
  }

  async find_by_participant(profile_id: number) {
    log("find_by_participant", profile_id);
    const {
      data: body,
      response,
      error: errorBody,
    } = await this.client.GET("/inboxes", {
      headers: this.headers,
      params: {
        query: {
          filters: {
            participant: profile_id,
          },
        },
      },
    });

    //

    if (errorBody) {
      throw new HTTPError(
        `${response.url} ${response.status} : ${errorBody.error.name}`,
        { cause: errorBody.error },
      );
    }

    return match(body.data)
      .with([], () => {
        throw new HTTPError(
          `${response.url} ${response.status} : Inbox@${profile_id} Not found`,
        );
      })
      .otherwise(() => body.data![0]);
  }

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

  //

  async find_by_id(id: number): Promise<Inbox_ItemSchema | undefined> {
    log("find_by_id", id);
    const {
      data: body,
      error: errorBody,
      response,
    } = await this.client.GET("/inboxes/{id}", {
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
