//

import { type ApiClient } from "@/app/api/v1";
import type { components } from "@1/strapi-openapi/v1";
import type { _1_HOUR_ } from "@douglasduteil/datatypes...hours-to-seconds";

//

export class QARepository {
  constructor(private client: ApiClient) {}

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
          populate: {
            opportunity_category: { fields: ["name", "slug"] },
            owner: { fields: ["email"] },
          },
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
            owner: { fields: ["email"] },
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
}
