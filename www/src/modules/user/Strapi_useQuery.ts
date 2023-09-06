//

import { AuthError } from "@1/core/error";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  type MutationFunction,
  type QueryFunction,
  type QueryKey,
} from "@tanstack/react-query";
import debug from "debug";
import { useCallback, useEffect, useState, type DependencyList } from "react";
import type { ZodTypeAny, z } from "zod";
import { type ApiClient } from "~/app/api/v1";
import { StrapiRepository } from "~/core/StrapiRepository";

//

export class Strapi_useQuery {
  constructor(public repository: StrapiRepository) {
    this.#log("new");
  }
  protected infinite_query = this.#infinite_query.bind(this);
  protected query = this.#query.bind(this);
  protected mutate = this.#mutate.bind(this);

  #log = debug("~:modules:exchange:Strapi_useQuery");

  #infinite_query<OpenApiOut, DomainOut>(endpoint: {
    fetch: () => OpenApiOut;

    query_key: QueryKey;
    mapper: z.ZodEffects<ZodTypeAny, DomainOut>;
    domain_deps?: DependencyList;
  }) {
    const { fetch, query_key: queryKey, domain_deps } = endpoint;

    const load_infinite_list_query_fn = () => {
      debug("load_infinite_list_query_fn");
      return fetch();
    };

    return useInfiniteQuery({
      queryFn: useCallback(load_infinite_list_query_fn, [
        this.repository,
        ...(domain_deps ?? []),
      ]),
      queryKey,
    });
  }

  #query<OpenApiOut, DomainOut>(endpoint: {
    fetch: (client: ApiClient) => OpenApiOut;
    require_jwt: true;
    query_key: QueryKey;
    mapper: z.ZodEffects<ZodTypeAny, DomainOut>;
    domain_deps?: DependencyList;
  }) {
    const {
      mapper,
      require_jwt,
      query_key: queryKey,
      fetch,
      domain_deps,
    } = endpoint;

    const load_query_fn: QueryFunction<
      OpenApiOut | undefined,
      typeof queryKey,
      number
    > = async () => {
      debug("load_list_query_fn");
      return fetch(this.repository.client);
    };

    const info = useQuery({
      enabled: require_jwt && Boolean(this.repository.jwt),
      queryFn: useCallback(load_query_fn, [
        this.repository,
        ...(domain_deps ?? []),
      ]),
      queryKey,
      staleTime: Infinity,
    });

    const [data, set_data] = useState<DomainOut>();

    useEffect(() => {
      const { data: query_data } = info;
      if (!query_data) return;
      if (!mapper) throw new AuthError("mapper not reconized");

      const result = mapper.parse(query_data);

      set_data(result);
    }, [mapper, info.data, set_data]);

    return { info, data };
  }

  #mutate<Variables, OpenApiOut>(endpoint: {
    fetch: (variables: Variables) => OpenApiOut;
  }) {
    const { fetch } = endpoint;

    const mutationFn: MutationFunction<OpenApiOut, Variables> = async (
      variables,
    ) => {
      debug("mutationFn");
      return fetch(variables);
    };

    const info = useMutation({
      mutationFn,
    });
    return { info };
  }
}
