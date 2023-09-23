//

import { HTTPError } from "@1/core/domain";
import type { Strapi_Query_Params } from "@1/modules/common";
import type { Message_Schema } from "@1/modules/inbox/infra/strapi";
import type { Comment_ListSchema } from "@1/strapi-openapi";
import debug from "debug";
import { Lifecycle, inject, scoped } from "tsyringe";
import { OpenAPI_Repository } from "~/app/api/v1/OpenAPI.repository";
import type { RepositoryPort } from "~/core";

//

@scoped(Lifecycle.ContainerScoped)
export class Deal_Message_Repository implements RepositoryPort {
  static DEAL_ID_TOKEN = Symbol("DEAL_ID_TOKEN");

  #log = debug(`~:modules:exchange:${Deal_Message_Repository.name}`);
  constructor(
    @inject(OpenAPI_Repository) private readonly openapi: OpenAPI_Repository,
    @inject(Deal_Message_Repository.DEAL_ID_TOKEN)
    public readonly deal_id: number,
  ) {
    this.#log("new");
  }

  get is_authorized() {
    return Boolean(this.openapi.jwt);
  }

  async create(body: { content: string }) {
    this.#log("create", body);
    const { response, error: errorBody } = await this.openapi.client.POST(
      "/deals/{id}/messages",
      {
        body,
        headers: this.openapi.headers,
        params: { path: { id: this.deal_id } },
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
    pagination,
  }: Strapi_Query_Params<Message_Schema>): Promise<Comment_ListSchema> {
    this.#log("find_messages (deal_id=%d)", this.deal_id);
    const {
      data: body,
      error: errorBody,
      response,
    } = await this.openapi.client.GET("/deals/{id}/messages", {
      headers: this.openapi.headers,
      params: {
        path: { id: this.deal_id },
        query: {
          pagination: {
            page: pagination?.page,
            pageSize: pagination?.pageSize,
            withCount: true,
          } as any,
          sort: ["createdAt:desc"],
        },
      },
    });

    if (errorBody) {
      this.#log("find_messages (deal_id=%d)", this.deal_id, errorBody);
      throw new HTTPError(
        [errorBody.error.message, "from " + response.url].join("\n"),
        { cause: errorBody.error },
      );
    }

    this.#log("find_messages (deal_id=%d) 200", this.deal_id);
    return body;
  }
}
