//

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
  constructor(public repository: StrapiRepository) {}
  static lsit<Query extends object>(client: ApiClient, query: Query) {
    return client.GET("/user-profiles", {
      params: { query },
    });
  }

  static by_id(id: number, client: ApiClient) {
    return client.GET("/user-profiles/{id}", {
      params: { path: { id } },
    });
  }
}
