//

import { HTTPError } from "@1/core/error";
import type { Strapi_Query_Params } from "@1/modules/common";
import debug from "debug";
import { Lifecycle, inject, scoped } from "tsyringe";
import { OpenAPI_Repository } from "~/app/api/v1/OpenAPI.repository";

//

@scoped(Lifecycle.ContainerScoped)
export class Opportunity_Repository {
  #log = debug(`~:modules:opportunity:${Opportunity_Repository.name}`);
  constructor(
    @inject(OpenAPI_Repository) private readonly openapi: OpenAPI_Repository,
  ) {
    this.#log("new");
  }

  static keys = {
    all: ["opportunities"],
  };

  async find_all(
    query: Strapi_Query_Params<{
      category: string;
      search: string;
      expireAt: Date;
    }>,
  ) {
    const pagination = {
      page: query.pagination?.page,
      pageSize: query.pagination?.pageSize,
    };

    const filters = {
      $and: [
        {
          category: {
            slug: { $eq: query.filters?.category },
          },
        },
      ],
      $or: [
        {
          title: {
            $containsi: query.filters?.search,
          },
        },
        {
          description: {
            $containsi: query.filters?.search,
          },
        },
      ],
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
    } = await this.openapi.client.GET("/opportunities", {
      headers: this.openapi.headers,
      params: {
        query: {
          pagination,
          populate,
          filters,
        } as any,
      },
    });

    if (errorBody) {
      throw new HTTPError(
        [errorBody.error.message, "from " + response.url].join("\n"),
        { cause: errorBody.error },
      );
    }

    return body;
  }

  async find_by_slug(slug: string) {
    const filters = { slug: { $eq: slug } };
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
    } = await this.openapi.client.GET("/opportunities", {
      headers: this.openapi.headers,
      params: {
        query: {
          filters,
          populate,
        } as any,
      },
    });

    if (errorBody) {
      throw new HTTPError(
        [errorBody.error.message, "from " + response.url].join("\n"),
        { cause: errorBody.error },
      );
    }

    const opportunity = body.data?.at(0);
    if (!opportunity) {
      throw new HTTPError("Empty response");
    }
    return opportunity;
  }
}
