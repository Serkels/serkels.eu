//

import { HTTPError } from "@1/core/error";
import type { Strapi_Query_Params } from "@1/modules/common";
import type { Profile_UpdateRecord } from "@1/modules/profile/infra/strapi";
import type { Profile_Schema } from "@1/strapi-openapi";
import { type ApiClient } from "~/app/api/v1";
import type { OpenAPI_Repository } from "~/app/api/v1/OpenAPI.repository";
import type { Profile_Repository } from "./profile.repository";

/**
 * @example
 * ```
 * export class User_useQuery extends Strapi_useQuery {
 *   by_id = {
 *     useQuery: (id: number) =>
 *       this.query({
 *         fetch: User_Repository.by_id.bind(null, id),
 *         mapper: Profile_DataRecord.transform(data_to_domain),
 *         query_key: User_Repository.keys.by_id(id),
 *         domain_deps: [id],
 *         require_jwt: true,
 *       }),
 *   };
 * }
 *
 * ```
 *
 * @example
 * ```
 * const queryClient = getQueryClient();
 * await queryClient.prefetchQuery(
 *   User_Repository.keys.by_id(id),
 *   () => User_Repository.by_id(id, fromServer),
 * );
 * const dehydratedState = dehydrate(queryClient);
 *
 * ```
 *
 * @deprecated use {@link Profile_Repository}
 */
export class User_Repository_Legacy {
  static keys = {
    all: ["profile"] as const,
    by_id: (id: number) => [...this.keys.all, "profile", String(id)] as const,
    contacts: () => [...this.keys.all, "contacts"] as const,
  };

  //

  constructor(public repository: OpenAPI_Repository) {}

  //

  static async list<Query extends object>(client: ApiClient, query: Query) {
    const res = await client.GET("/user-profiles", {
      params: { query },
    });
    return res.data;
  }

  static async by_id(id: number, client: ApiClient) {
    const res = await client.GET("/user-profiles/{id}", {
      params: { path: { id } },
    });
    return res.data;
  }

  async update(data: Profile_UpdateRecord) {
    const res = await this.repository.client.PUT("/user-profiles/me", {
      body: { data },
      headers: this.repository.headers,
    });
    return res.data;
  }

  async update_image(body: FormData) {
    const res = await fetch("/api/v1/upload", {
      method: "POST",
      body,
      headers: this.repository.headers,
    });
    try {
      const data = await res.json();
      if (res.ok) return data;
      throw new HTTPError("update_image", { cause: await res.json() });
    } catch (e) {
      throw new HTTPError("update_image", { cause: await res.text() });
    }
  }

  async contacts_list(query: Strapi_Query_Params<Profile_Schema>) {
    const pagination = {
      page: query.pagination?.page,
      pageSize: query.pagination?.pageSize,
    };

    const res = await this.repository.client.GET("/user-profiles/me/contacts", {
      headers: this.repository.headers,
      params: {
        query: {
          pagination,
        },
      },
    });

    //

    if (res.error) {
      const body = res.error;
      throw new HTTPError(
        `${res.response.url} ${res.response.status} : ${body.error.name}`,
        { cause: body.error },
      );
    }

    return res.data;
  }
}
