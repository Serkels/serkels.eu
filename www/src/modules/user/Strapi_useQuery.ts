//

import { AuthError } from "@1/core/error";
import {
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
    fetch: (client: ApiClient) => OpenApiOut;
    require_jwt: true;
    query_key: QueryKey;
    mapper: z.ZodEffects<ZodTypeAny, DomainOut>;
    domain_deps?: DependencyList;
  }) {
    const { mapper } = endpoint;
    const info = { data: { pages: [{ data: {} }] } };
    const [infinite_list, set_infinite_list] = useState<DomainOut>();

    useEffect(() => {
      const { data } = info;
      if (!data) return;
      if (!mapper) throw new AuthError("mapper not reconized");

      const result = mapper.parse(data.pages.map((page) => page.data).flat());

      set_infinite_list(result);
    }, [mapper, info.data, set_infinite_list]);
    return { info, infinite_list };
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

  #mutate<OpenApiOut, DomainOut, Variables>(endpoint: {
    fetch: (client: ApiClient, variables: Variables) => OpenApiOut;
    require_jwt: true;
    query_key: QueryKey;
    mapper: z.ZodEffects<ZodTypeAny, DomainOut>;
    domain_deps?: DependencyList;
  }) {
    // const { data: session } = useSession();

    // const mutation_fn = async (message: string) => {
    //   this.#log("mutation_fn", { message });

    //   const trace = tracer({
    //     name: `Create Message for the inbox ${this.repository.thread_id}`,
    //   });

    //   trace.startChild({
    //     op: "create record",
    //   });

    //   try {
    //     await this.repository.create({ content: message });
    //   } finally {
    //     trace[Symbol.dispose]();
    //   }
    // };

    // const mutation_result = useMutation(
    //   useCallback(create_message, [this.repository, session?.user?.id]),
    // );

    // const query_client = useQueryClient();
    // useEffect(() => {
    //   console.log({ mutation_result });
    //   query_client.invalidateQueries(
    //     Inbox_QueryKeys.messages(this.repository.thread_id),
    //   );
    // }, [mutation_result.isSuccess]);
    // return mutation_result;

    const { fetch } = endpoint;

    const mutationFn: MutationFunction<OpenApiOut, Variables> = async (
      variables,
    ) => {
      debug("load_list_query_fn");
      return fetch(this.repository.client, variables);
    };

    // const info = useMutation({
    //   mutationFn: useCallback(load_query_fn, [
    //     this.repository,
    //     ...(domain_deps ?? []),
    //   ]),
    // });

    // const [data, set_data] = useState<DomainOut>();

    // useEffect(() => {
    //   const { data: query_data } = info;
    //   if (!query_data) return;
    //   if (!mapper) throw new AuthError("mapper not reconized");

    //   const result = mapper.parse(query_data);

    //   set_data(result);
    // }, [mapper, info.data, set_data]);

    const info = useMutation({
      mutationFn,
    });
    return { info };
  }
}
