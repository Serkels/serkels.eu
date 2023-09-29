//

import { Lifecycle, inject, scoped } from "@1/core/di";
import { HTTPError } from "@1/core/domain";
import type { Strapi_Query_Params } from "@1/modules/common";
import type { Message_Schema } from "@1/modules/inbox/infra/strapi";
import type { Inbox_ItemSchema, Inbox_ListSchema } from "@1/strapi-openapi";
import debug from "debug";
import { match } from "ts-pattern";
import { OpenAPI_Repository } from "~/app/api/v1/OpenAPI.repository";

//

@scoped(Lifecycle.ContainerScoped)
export class Inbox_Repository {
  #log = debug(`~:modules:inbox:${Inbox_Repository.name}`);
  constructor(
    @inject(OpenAPI_Repository) private readonly openapi: OpenAPI_Repository,
  ) {
    this.#log("new");
  }
  get is_authorized() {
    return Boolean(this.openapi.jwt);
  }

  async create(profile_id: number) {
    this.#log("create", profile_id);
    const {
      data: body,
      response,
      error: errorBody,
    } = await this.openapi.client.POST("/inbox/to/{profile_id}", {
      headers: this.openapi.headers,
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
    this.#log("find_by_participant", profile_id);
    const {
      data: body,
      response,
      error: errorBody,
    } = await this.openapi.client.GET("/inboxes", {
      headers: this.openapi.headers,
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

  async find_all(
    query: Strapi_Query_Params<Message_Schema>,
  ): Promise<Inbox_ListSchema> {
    const pagination = {
      page: query.pagination?.page,
      pageSize: query.pagination?.pageSize,
    };
    const sort = query.sort;

    //

    const trace = this.#log.extend(
      `find_all(pageSize=${pagination?.pageSize}, page=${pagination?.page})`,
    );

    trace("");
    const {
      data: body,
      error: errorBody,
      response,
    } = await this.openapi.client.GET("/inboxes", {
      headers: this.openapi.headers,
      params: {
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

  //

  async find_by_id(id: number): Promise<Inbox_ItemSchema | undefined> {
    const trace = this.#log.extend(`find_by_id(id=${id})`);

    trace("");
    const {
      data: body,
      error: errorBody,
      response,
    } = await this.openapi.client.GET("/inboxes/{id}", {
      headers: this.openapi.headers,
      params: {
        path: { id },
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

    return body?.data;
  }
}
