//

import { HTTPError } from "@1/core/domain";
import type { Strapi_Query_Params } from "@1/modules/common";
import type { Message_Schema } from "@1/modules/inbox/infra/strapi";
import type { Comment_ListSchema } from "@1/strapi-openapi";
import debug from "debug";
import { OpenAPI_Repository } from "~/app/api/v1/OpenAPI.repository";
import type { RepositoryPort } from "~/core";
import { Lifecycle, inject, scoped, type InjectionToken } from "~/core/di";

//

@scoped(Lifecycle.ContainerScoped)
export class Deal_Message_Repository implements RepositoryPort {
  static DEAL_ID_TOKEN = Symbol("DEAL_ID_TOKEN") as InjectionToken<number>;

  #log = debug(`~:modules:exchange:${Deal_Message_Repository.name}`);

  constructor(
    @inject(OpenAPI_Repository) private readonly openapi: OpenAPI_Repository,
    @inject(Deal_Message_Repository.DEAL_ID_TOKEN)
    public readonly deal_id: number,
  ) {
    this.#log(`new:${this.deal_id}`);
  }

  get is_authorized() {
    return Boolean(this.openapi.jwt);
  }

  async create(body: { content: string }) {
    const trace = this.#log.extend(`create (${JSON.stringify(body)})`);

    trace("");
    const { response, error: errorBody } = await this.openapi.client.POST(
      "/deals/{id}/messages",
      {
        body,
        headers: this.openapi.headers,
        params: { path: { id: this.deal_id } },
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

  async find_all({
    pagination,
  }: Strapi_Query_Params<Message_Schema>): Promise<Comment_ListSchema> {
    const trace = this.#log.extend(`find_all (deal_id=${this.deal_id})`);

    trace("");
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
}
