//

import debug from "debug";
import { OpenAPIRepository, type ApiClient } from "~/app/api/v1";
import type { RepositoryPort } from "~/core";
import { HTTPError } from "~/core/errors";
import type { QuestionListSchema, Question_DTO } from "./dto";
import type { Question_CreateProps, Question_Entity } from "./entity";

//

const log = debug("~:modules:question:Question_Repository");

//

export type Question_QueryProps = {
  filter?: { search?: string | undefined; category?: string | undefined };
  pagination?: { pageSize?: number; page?: number };
  sort?: `${keyof NonNullable<NonNullable<Question_DTO>>}:${"asc" | "desc"}`[];
};

export class Question_Repository
  extends OpenAPIRepository
  implements RepositoryPort
{
  constructor(client: ApiClient, jwt: string | undefined) {
    super(client, jwt);
    log("new", jwt);
  }
  async create(entity: Question_CreateProps) {
    log("create", entity);

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
      log("create", errorBody);
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
  }: Question_QueryProps): Promise<QuestionListSchema> {
    log("findAll", filter);
    const {
      data: body,
      error: errorBody,
      response,
    } = await this.client.GET("/questions", {
      params: {
        query: {
          pagination: {
            page: pagination?.page,
            pageSize: pagination?.pageSize,
          },
          sort,
        } as any,
      },
    });

    if (errorBody) {
      log("create", errorBody);
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
