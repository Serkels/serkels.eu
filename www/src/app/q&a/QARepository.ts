//

import { OpenAPIRepository, type ApiClient } from "@/app/api/v1";
import type { components } from "@1/strapi-openapi/v1";
import type { _1_HOUR_ } from "@douglasduteil/datatypes...hours-to-seconds";

//

type QuestionRequestBody = components["schemas"]["QuestionRequest"]["data"];
type CommentRequest = components["schemas"]["CommentRequest"];

//

export class QARepository extends OpenAPIRepository {
  static queryKey = ["q&a"];
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
  async save(
    owner: string | number,
    data: { title: string; category?: number },
  ) {
    const {
      response,
      data: body,
      error: errorBody,
    } = await this.client.POST("/questions", {
      body: {
        data: { ...data, owner: String(owner) },
      },
      headers: this.headers,
      params: {},
    });

    if (errorBody) {
      throw new Error(
        [errorBody.error.message, "from " + response.url].join("\n"),
      );
    }

    return body;
  }

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

  //

  async save_response(id: number, data: CommentRequest) {
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
}

export class AnswerRepository extends OpenAPIRepository {
  constructor(
    client: ApiClient,
    public question_id: number,
    jwt?: string,
  ) {
    super(client, jwt);

    this.queryKey = [...QARepository.queryKey, Number(question_id), "answers"];
  }
  queryKey = [...QARepository.queryKey, NaN, "answers"] as const;

  async load() {
    const {
      data: body,
      error,
      response,
    } = await this.client.GET("/question/{id}/answers", {
      params: {
        path: { id: this.question_id },
        query: {
          sort: ["createdAt:desc"],
        },
      },
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
    } = await this.client.GET("/question/answers/{id}", {
      params: { path: { id } },
      headers,
    });

    if (error) {
      console.error(error, "from " + response.url);
    }

    return body;
  }
}
