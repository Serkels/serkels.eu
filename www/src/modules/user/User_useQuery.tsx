import {
  Profile_DataRecord,
  Profile_UpdateRecord,
  data_to_domain,
} from "@1/modules/profile/infra/strapi";
import type { ApiClient } from "~/app/api/v1";
import { Strapi_useQuery } from "./Strapi_useQuery";
import { User_Repository } from "./User_Repository";

/**
 * @example
 * ```
 * const {by_id} = new User_useQuery(new StrapiRepository(fromClient, ""));
 * cosnt {info, data: user} = by_id.useQuery(0);
 *
 *
 * ```
 *
 * @example
 * ```
 * const {by_id} = useUserData();
 * cosnt {info, data: user} = by_id.useQuery(0);
 *
 * ```
 */
export class User_useQuery extends Strapi_useQuery {
  by_id = {
    useQuery: (id: number) =>
      this.query({
        fetch: User_Repository.by_id.bind(null, id),
        mapper: Profile_DataRecord.transform(data_to_domain),
        query_key: User_Repository.keys.by_id(id),
        domain_deps: [id],
        require_jwt: true,
      }),
  };

  update = {
    useMutation: () =>
      this.mutate({
        fetch: (client, data: Profile_UpdateRecord) => {
          User_Repository.update(this.repository.headers, client, data);
        },
        mapper: Profile_DataRecord.transform(data_to_domain),
        query_key: User_Repository.keys.all,
        domain_deps: [],
        require_jwt: true,
      }),
  };

  update_avatar = {
    useMutation: () => {
      return this.mutate({
        fetch: (client: ApiClient, formData: FormData) =>
          User_Repository.update_image(
            this.repository.headers,
            client,
            formData,
          ),
        mapper: Profile_DataRecord.transform(data_to_domain),
        query_key: User_Repository.keys.all,
        domain_deps: [],
        require_jwt: true,
      });
    },
  };
}
