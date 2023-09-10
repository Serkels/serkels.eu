//

import { HTTPError } from "@1/core/domain";
import type { Question_ListSchema, Question_Schema } from "@1/strapi-openapi";
import debug from "debug";
import { type ApiClient } from "~/app/api/v1";
import {
  API_TOKEN,
  JWT_TOKEN,
  OpenAPI_Repository,
} from "~/app/api/v1/OpenAPI.repository";
import type { RepositoryPort } from "~/core";
import { Lifecycle, inject, scoped } from "~/core/di";
import type { Question_CreateProps, Question_Entity } from "./entity";

//

export type Question_QueryProps = {
  filter?: { search?: string | undefined; category?: string | undefined };
  pagination?: { pageSize?: number; page?: number };
  sort?: `${keyof NonNullable<NonNullable<Question_Schema>>}:${
    | "asc"
    | "desc"}`[];
};

//

@scoped(Lifecycle.ContainerScoped)
export class Question_Repository
  extends OpenAPI_Repository
  implements RepositoryPort
{
  #log = debug(`~:modules:question:${Question_Repository.name}`);

  constructor(
    @inject(API_TOKEN) client: ApiClient,
    @inject(JWT_TOKEN) jwt?: string | undefined,
  ) {
    super(client, jwt);
    this.#log("new", jwt ? "🗝️" : "🔒");
  }

  async create(entity: Question_CreateProps) {
    this.#log("create", entity);

    const { response, error: errorBody } = await this.client.POST(
      "/questions",
      {
        body: {
          data: entity,
        },
        headers: this.headers,
        params: {},
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

  async findAll({
    filter,
    sort,
    pagination,
  }: Question_QueryProps): Promise<Question_ListSchema> {
    this.#log("findAll", filter);
    const { category, search } = filter ?? {};
    const {
      data: body,
      error: errorBody,
      response,
    } = await this.client.GET("/questions", {
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
      this.#log("create", errorBody);
      throw new HTTPError(
        [errorBody.error.message, "from " + response.url].join("\n"),
        { cause: errorBody.error },
      );
    }

    return body;
  }

  delete(entity: Question_Entity): Promise<boolean> {
    entity;
    throw new Error("Method not implemented.");
  }
}
