//

import { HTTPError } from "@1/core/error";
import type { Profile_UpdateRecord } from "@1/modules/profile/infra/strapi";
import { type ApiClient } from "~/app/api/v1";
import type { StrapiRepository } from "~/core/StrapiRepository";

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
 */
export class User_Repository {
  static keys = {
    all: ["profile"] as const,
    by_id: (id: number) => ["profile", "by_id", String(id)] as const,
  };

  //

  constructor(public repository: StrapiRepository) {}

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

  static async update(
    headers: any,
    client: ApiClient,
    data: Profile_UpdateRecord,
  ) {
    const res = await client.PUT("/user-profiles/me", {
      params: {},
      body: { data: { image: null } },
      headers,
    });
    return res.data;
  }

  static async update_image(headers: any, client: ApiClient, body: FormData) {
    const res = await fetch("/api/v1/upload", {
      method: "POST",
      body: body,
      headers,
    });
    try {
      const data = await res.json();
      if (res.ok) return data;
      throw new HTTPError("update_image", { cause: await res.json() });
    } catch (e) {
      throw new HTTPError("update_image", { cause: await res.text() });
    }
  }
}
