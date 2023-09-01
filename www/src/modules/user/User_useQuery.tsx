import {
  Profile_DataRecord,
  data_to_domain,
} from "@1/modules/profile/infra/strapi";
import { User_Repository } from "./User_Repository";
import { Strapi_useQuery } from "./user.repository";

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
}
