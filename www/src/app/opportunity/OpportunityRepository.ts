//

import { GET } from "@/app/api/v1";
import type {
  _1_HOUR_,
  _24_HOURS_,
} from "@douglasduteil/datatypes...hours-to-seconds";

//

export class OpportunityCategories {
  static async load() {
    const { data: body } = await GET("/opportunity-categories", {
      params: {},
      next: { revalidate: 86400 satisfies _24_HOURS_ },
    });

    if (!body) return [];
    if (!body.data) return [];

    return body.data.map(({ id, attributes }) => ({ id, ...attributes }));
  }
}

//

export class Opportunity {
  static async loadFromSlug(slug: string) {
    const { data: body, response } = await GET("/opportunities", {
      params: {
        query: {
          populate: "*",
          filters: { slug: { $eq: slug } },
        },
      },
      next: { revalidate: 86400 satisfies _24_HOURS_ },
    });

    if (!response.ok || !body || !body.data || !body.data[0]) {
      throw new Error("Not Found");
    }

    return body.data[0];
  }
}

export class Opportunities {
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
    } = await GET("/opportunities", {
      params: {
        query: {
          populate: {
            partner: {
              populate: "avatar",
            },
            opportunity_category: "*",
            cover: "*",
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
                description: {
                  $containsi: search,
                },
              },
            ],
          },
          sort: ["expireAt:desc"],
        } as any,
      },
      next: { revalidate: 3600 satisfies _1_HOUR_ },
    });

    if (error) {
      console.error(error, "from " + response.url);
    }
    if (!body) return [];
    if (!body.data) return [];

    return body.data.map(({ id, attributes }) => ({ id, ...attributes }));
  }
}
