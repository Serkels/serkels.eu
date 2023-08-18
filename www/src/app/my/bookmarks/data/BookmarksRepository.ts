//

import { OpenAPIRepository } from "@/app/api/v1";
import type { components } from "@1/strapi-openapi/v1";
import type { _24_HOURS_ } from "@douglasduteil/datatypes...hours-to-seconds";

//

type BookmarkRequest = components["schemas"]["BookmarkRequest"];

//

export class BookmarksRepository extends OpenAPIRepository {
  static queryKey = ["bookmarks"];
  async load() {
    const { data: body } = await this.client.GET("/bookmarks", {
      headers: this.headers,
      next: { revalidate: 86400 satisfies _24_HOURS_ },
      params: {
        query: {
          sort: "createdAt:asc",
        },
      },
    });

    return body;
  }

  async save(data: BookmarkRequest["data"]) {
    const { data: body } = await this.client.POST("/bookmarks", {
      body: { data },
      headers: this.headers,
    });

    return body;
  }
  async delete(id: number) {
    const { data: body } = await this.client.DELETE("/bookmarks/{id}", {
      headers: this.headers,
      params: { path: { id } },
    });

    return body;
  }
}
