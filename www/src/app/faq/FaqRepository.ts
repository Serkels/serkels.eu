//

import { GET } from "@/app/api/v1";
import type { _1_HOUR_ } from "@douglasduteil/datatypes...hours-to-seconds";

//

export class FaqRepository {
  static async load({
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
    } = await GET("/questions", {
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

    console.error(error, "from " + response.url);
    if (error) {
      console.error(error, "from " + response.url);
    }

    return body?.data ?? [];
  }
}
