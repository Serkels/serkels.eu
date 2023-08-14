//

import { OpenAPIRepository } from "@/app/api/v1";
import type { components } from "@1/strapi-openapi/v1";
import type { _1_HOUR_ } from "@douglasduteil/datatypes...hours-to-seconds";

//

export class QARepository extends OpenAPIRepository {
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
                opportunity_category: {
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
          sort: ["updatedAt:desc"],
        } as any,
      },
      next: { revalidate: 3600 satisfies _1_HOUR_ },
    });

    if (error) {
      console.error(error, "from " + response.url);
    }

    return body?.data ?? [];
  }

  async save(
    jwt: string,
    owner: string | number,
    data: components["schemas"]["QuestionRequest"]["data"],
  ) {
    const headers = new Headers({ Authorization: `Bearer ${jwt}` });
    const {
      response,
      data: body,
      error: errorBody,
    } = await this.client.POST("/questions", {
      body: {
        data: { ...data, owner: String(owner) },
      },
      headers,
      params: {
        query: {
          populate: {
            opportunity_category: { fields: ["name"] },
            owner: "*",
          },
        },
      },
    });

    if (errorBody) {
      throw new Error(
        [errorBody.error.message, "from " + response.url].join("\n"),
      );
    }

    return body;
  }

  async save_response(
    jwt: string,
    id: number,
    data: components["schemas"]["CommentRequest"],
  ) {
    const headers = new Headers({ Authorization: `Bearer ${jwt}` });
    const {
      response,
      data: body,
      error: errorBody,
    } = await this.client.POST("/question/{id}/awnsers", {
      body: data,
      headers,
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

  //

  async loadResponsesOf(id: number) {
    const {
      data: body,
      error,
      response,
    } = await this.client.GET("/question/{id}/awnsers", {
      params: { path: { id } },
    });

    if (error) {
      console.error(error, "from " + response.url);
    }

    return body?.data ?? [];
  }

  //

  async count_awnsers(id: number) {
    const {
      data: body,
      error,
      response,
    } = await this.client.GET("/question/{id}/awnsers/count", {
      params: { path: { id } },
    });

    if (error) {
      console.error(error, "from " + response.url);
    }

    return Number(body);
  }
}
