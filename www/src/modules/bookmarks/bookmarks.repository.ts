//

import { Lifecycle, inject, scoped } from "@1/core/di";
import { HTTPError } from "@1/core/error";
import { Bookmark_Category } from "@1/modules/bookmark/domain";
import type { Strapi_Query_Params } from "@1/modules/common";
import type { _24_HOURS_ } from "@douglasduteil/datatypes...hours-to-seconds";
import debug from "debug";
import type { FetchOptions } from "openapi-fetch";
import { match } from "ts-pattern";
import { OpenAPI_Repository } from "~/app/api/v1/OpenAPI.repository";

//

@scoped(Lifecycle.ContainerScoped)
export class Bookmarks_Repository {
  #log = debug(`~:modules:bookmarks:${Bookmarks_Repository.name}`);
  constructor(
    @inject(OpenAPI_Repository) private readonly openapi: OpenAPI_Repository,
  ) {
    this.#log("new");
  }

  static keys = {
    all: ["bookmark"] as const,
    exchange() {
      return [...this.all, "exchanges"] as const;
    },
    opportunity() {
      return [...this.all, "opportunities"] as const;
    },
    check(type: Bookmark_Category, id: number) {
      return [...this.all, type, String(id)] as const;
    },
  };

  get is_authorized() {
    return Boolean(this.openapi.jwt);
  }

  async find_exchange_bookmarks(query: Strapi_Query_Params<any>) {
    const pagination = {
      page: query.pagination?.page,
      pageSize: query.pagination?.pageSize,
    };

    const {
      data: body,
      error: errorBody,
      response,
    } = await this.openapi.client.GET("/bookmark/exchanges", {
      headers: this.openapi.headers,
      params: {
        query: {
          pagination,
        },
      },
    });

    if (errorBody) {
      throw new HTTPError(
        [errorBody.error.message, "from " + response.url].join("\n"),
        { cause: errorBody.error },
      );
    }

    if (!body.data || !body.meta) {
      throw new HTTPError("Empty response");
    }

    return body;
  }

  async find_opportunity_bookmarks(query: Strapi_Query_Params<any>) {
    const pagination = {
      page: query.pagination?.page,
      pageSize: query.pagination?.pageSize,
    };

    const populate = {
      category: true,
      cover: true,
      localizations: true,
      partner: {
        populate: { avatar: true },
      },
      profile: true,
    };

    const {
      data: body,
      error: errorBody,
      response,
    } = await this.openapi.client.GET("/bookmark/opportunities", {
      headers: this.openapi.headers,
      params: {
        query: {
          pagination,
          populate,
        },
      },
    });

    if (errorBody) {
      throw new HTTPError(
        [errorBody.error.message, "from " + response.url].join("\n"),
        { cause: errorBody.error },
      );
    }

    if (!body.data || !body.meta) {
      throw new HTTPError("Empty response");
    }

    return body;
  }

  async load() {
    const { data: body } = await this.openapi.client.GET("/bookmarks", {
      headers: this.openapi.headers,
      next: { revalidate: 86400 satisfies _24_HOURS_ },
      params: {
        query: {
          sort: "createdAt:asc",
        },
      },
    });

    return body;
  }

  async save(type: Bookmark_Category, id: number) {
    this.#log(`save ${type} ${id}`);
    const init: FetchOptions<{ parameters: { path: { id: number } } }> = {
      headers: this.openapi.headers,
      params: { path: { id } },
      parseAs: "text",
    };

    const { response, error: errorBody } = await match(type)
      .with("exchange", () =>
        this.openapi.client.POST("/bookmark/exchanges/{id}", init),
      )
      .with("opportunity", () =>
        this.openapi.client.POST("/bookmark/opportunities/{id}", init),
      )
      .exhaustive();

    if (errorBody) {
      throw new HTTPError(
        [errorBody.error.message, "from " + response.url].join("\n"),
        { cause: errorBody.error },
      );
    }

    return { ok: response.ok };
  }
  async delete(type: Bookmark_Category, id: number) {
    this.#log(`delete ${type} ${id}`);
    const init: FetchOptions<{ parameters: { path: { id: number } } }> = {
      headers: this.openapi.headers,
      params: { path: { id } },
      parseAs: "text",
    };

    const { response, error: errorBody } = await match(type)
      .with("exchange", () =>
        this.openapi.client.DELETE("/bookmark/exchanges/{id}", init),
      )
      .with("opportunity", () =>
        this.openapi.client.DELETE("/bookmark/opportunities/{id}", init),
      )
      .exhaustive();

    if (errorBody) {
      throw new HTTPError(
        [errorBody.error.message, "from " + response.url].join("\n"),
        { cause: errorBody.error },
      );
    }

    return { ok: response.ok };
  }
  async check(type: Bookmark_Category, id: number) {
    this.#log(`check ${type} ${id}`);
    const init: FetchOptions<{ parameters: { path: { id: number } } }> = {
      headers: this.openapi.headers,
      params: { path: { id } },
      parseAs: "text",
    };
    const { response } = await match(type)
      .with("exchange", () =>
        this.openapi.client.GET("/bookmark/exchanges/{id}", init),
      )
      .with("opportunity", () =>
        this.openapi.client.GET("/bookmark/opportunities/{id}", init),
      )
      .exhaustive();

    return { ok: response.ok };
  }
}
