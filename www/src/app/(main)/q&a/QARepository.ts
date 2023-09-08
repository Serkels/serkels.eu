//

import type { components } from "@1/strapi-openapi/v1";
import type { _1_HOUR_ } from "@douglasduteil/datatypes...hours-to-seconds";
import debug from "debug";
import { OpenAPIRepository, type ApiClient } from "~/app/api/v1";

//

type QuestionRequestBody = components["schemas"]["QuestionRequest"]["data"];
type CommentRequest = components["schemas"]["CommentRequest"];

//

export class QARepository extends OpenAPIRepository {
  static queryKey = ["question"];
  async load({
    category,
    limit,
    page,
    pageSize,
    search,
  }:
    | {
        category?: string | undefined;
        limit?: number | undefined;
        page: undefined;
        pageSize: undefined;
        search?: string | undefined;
      }
    | {
        category?: string | undefined;
        limit: undefined;
        page?: number;
        pageSize?: number;
        search?: string | undefined;
      }) {
    const {
      data: body,
      error,
      response,
    } = await this.client.GET("/questions", {
      params: {
        query: {
          pagination: {
            limit,
            page,
            pageSize,
          },
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
          sort: ["createdAt:desc"],
        } as any,
      },
      next: { revalidate: 3600 satisfies _1_HOUR_ },
    });

    if (error) {
      console.error(error, "from " + response.url);
    }

    return body?.data ?? [];
  }

  async loadOne(id: number) {
    const {
      data: body,
      error: errorBody,
      response,
    } = await this.client.GET("/questions/{id}", { params: { path: { id } } });

    if (errorBody) {
      throw new Error(
        [errorBody.error.message, "from " + response.url].join("\n"),
      );
    }

    return body?.data;
  }

  //

  async edit(id: number, data: QuestionRequestBody) {
    const {
      response,
      data: body,
      error: errorBody,
    } = await this.client.PUT("/questions/{id}", {
      body: {
        data,
      },
      headers: this.headers,
      params: { path: { id } },
    });

    if (errorBody) {
      throw new Error(
        [errorBody.error.message, "from " + response.url].join("\n"),
      );
    }

    return body;
  }

  async delete(id: number) {
    const {
      response,
      data: body,
      error: errorBody,
    } = await this.client.DELETE("/questions/{id}", {
      headers: this.headers,
      params: { path: { id } },
    });

    if (errorBody) {
      throw new Error(
        [errorBody.error.message, "from " + response.url].join("\n"),
      );
    }

    return body;
  }
}

export class AnswerRepository extends OpenAPIRepository {
  #log = debug(`~:modules:question:${AnswerRepository}`);
  static queryKey = ["answer"] as const;
  constructor(client: ApiClient, jwt?: string) {
    super(client, jwt);
    this.#log("new", jwt ? "🗝️" : "🔒");
  }

  async load(question_id: number) {
    const {
      data: body,
      error,
      response,
    } = await this.client.GET("/question/{id}/answers", {
      headers: this.headers,
      params: {
        path: { id: question_id },
        query: {
          sort: ["createdAt:desc"],
        },
      } as any,
    });

    if (error) {
      console.error(error, "from " + response.url);
    }

    return body?.data;
  }

  async loadOne(id: number) {
    const { headers } = this;
    const {
      data: body,
      error,
      response,
    } = await this.client.GET("/answer/{id}", {
      params: { path: { id } },
      headers,
    });

    if (error) {
      console.error(error, "from " + response.url);
    }

    return body;
  }

  //

  async save(id: number, data: CommentRequest) {
    const {
      response,
      data: body,
      error: errorBody,
    } = await this.client.POST("/question/{id}/answers", {
      body: data,
      headers: this.headers,
      params: {
        path: { id },
      },
    });

    if (errorBody) {
      throw new Error(
        [errorBody.error.message, "from " + response.url].join("\n"),
      );
    }

    return body;
  }

  async delete(id: number) {
    const {
      response,
      data: body,
      error: errorBody,
    } = await this.client.DELETE("/answer/{id}", {
      headers: this.headers,
      params: { path: { id } },
    });

    if (errorBody) {
      throw new Error(
        [errorBody.error.message, "from " + response.url].join("\n"),
      );
    }

    return body;
  }
}
