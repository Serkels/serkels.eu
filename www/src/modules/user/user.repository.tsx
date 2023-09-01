//

import { AuthError } from "@1/core/error";
import { type Strapi_flatten_page_data } from "@1/modules/common";
import {
  Profile_DataRecord,
  data_to_domain,
} from "@1/modules/profile/infra/strapi";
import type { _1_HOUR_ } from "@douglasduteil/datatypes...hours-to-seconds";
import {
  useQuery,
  type QueryFunction,
  type QueryKey,
} from "@tanstack/react-query";
import debug from "debug";
import { useCallback, useEffect, useState, type DependencyList } from "react";
import type { ZodTypeAny, z } from "zod";
import { OpenAPIRepository, fromClient, type ApiClient } from "~/app/api/v1";

//

export class StrapiRepository extends OpenAPIRepository {
  constructor(client: ApiClient, jwt: string | undefined) {
    super(client, jwt);
    this.#log("new");
  }
  #log = debug("~:modules:exchange:StrapiRootRepository");

  async loadById(id: number | string) {
    const {
      data: body,
      error,
      response,
    } = await this.client.GET(`/user-profiles/{id}`, {
      params: {
        path: { id: Number(id) },
      },
      next: { revalidate: 3600 satisfies _1_HOUR_ },
    });

    if (error) {
      console.error(error, "from " + response.url);
    }

    return body?.data;
  }
}

export class User_Repository {
  constructor(public repository: StrapiRepository) {}
}

export class Strapi_useQuery {
  constructor(public repository: StrapiRepository) {}
  protected infinite_query = this.#infinite_query.bind(this);
  protected query = this.#query.bind(this);

  #infinite_query<Z extends ZodTypeAny>(endpoint: {
    queryKey: [];
    mapper: Strapi_flatten_page_data<Z>;
  }) {
    const { mapper } = endpoint;
    const info = { data: { pages: [{ data: {} }] } };
    const [infinite_list, set_infinite_list] = useState<z.TypeOf<Z>>();

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
}

export class User_useQuery extends Strapi_useQuery {
  list = {
    useQuery: (id: number) =>
      this.query({
        fetch: (client) =>
          client.GET("/inboxes", {
            params: { query: {} },
          }),
        mapper: Profile_DataRecord.transform(data_to_domain),
        query_key: [],
        domain_deps: [id],
        require_jwt: true,
      }),
  };
}

const sdf = new User_useQuery(new StrapiRepository(fromClient, ""));
sdf;
const zer = sdf.list.useQuery(0);
const info = zer.info;
const data = zer.data;
