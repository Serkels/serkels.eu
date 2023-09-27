import { Profile_Record } from "@1/modules/profile/infra/strapi";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Strapi_useQuery } from "./Strapi_useQuery";
import { User_Repository_Legacy } from "./User_Repository";

import { getNextPageParam, getPreviousPageParam } from "~/core/use-query";

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
  user_repository = new User_Repository_Legacy(this.repository);
  by_id = {
    useQuery: (id: number) =>
      this.query({
        fetch: User_Repository_Legacy.by_id.bind(null, id),
        mapper: Profile_Record,
        query_key: User_Repository_Legacy.keys.by_id(id),
        domain_deps: [id],
        require_jwt: true,
      }),
  };

  contacts = {
    useInfiniteQuery: ({ pageSize }: { pageSize: number }) =>
      useInfiniteQuery({
        queryFn: (options) =>
          this.user_repository.contacts_list({
            pagination: { pageSize, page: options.pageParam ?? 1 },
          }),
        getPreviousPageParam,
        getNextPageParam,
        queryKey: User_Repository_Legacy.keys.contacts(),
        staleTime: Infinity,
      }),
  };

  update = {
    useMutation: () =>
      this.mutate({
        fetch: (data: Profile_Record) => this.user_repository.update(data),
      }),
  };

  update_avatar = {
    useMutation: () => {
      return this.mutate({
        fetch: (formData: FormData) =>
          this.user_repository.update_image(formData),
      });
    },
  };
}
