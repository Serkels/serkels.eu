//

import { HTTPError } from "@1/core/error";
import type { StrapiRepository } from "~/core/StrapiRepository";

//

export class Categories_Repository {
  constructor(public repository: StrapiRepository) {}
  static keys = {
    all: ["categories"] as const,
    exchange() {
      return [...this.all, "exchange"] as const;
    },
    opportunity() {
      return [...this.all, "opportunity"] as const;
    },
    question() {
      return [...this.all, "question"] as const;
    },
  };

  //

  async exchange() {
    const {
      data: body,
      error: errorBody,
      response,
    } = await this.repository.client.GET("/categories;exchange", {
      headers: this.repository.headers,
    });

    if (errorBody) {
      throw new HTTPError(
        [errorBody.error.message, "from " + response.url].join("\n"),
        { cause: errorBody.error },
      );
    }

    const categories = body.data?.attributes?.categories?.data;
    if (!categories) {
      throw new HTTPError("Empty response");
    }

    return categories;
  }

  async opportunity() {
    const {
      data: body,
      error: errorBody,
      response,
    } = await this.repository.client.GET("/categories;opportunity", {
      headers: this.repository.headers,
    });

    if (errorBody) {
      throw new HTTPError(
        [errorBody.error.message, "from " + response.url].join("\n"),
        { cause: errorBody.error },
      );
    }

    const categories = body.data?.attributes?.categories?.data;
    if (!categories) {
      throw new HTTPError("Empty response");
    }

    return categories;
  }

  async question() {
    const {
      data: body,
      error: errorBody,
      response,
    } = await this.repository.client.GET("/categories;question", {
      headers: this.repository.headers,
    });

    if (errorBody) {
      throw new HTTPError(
        [errorBody.error.message, "from " + response.url].join("\n"),
        { cause: errorBody.error },
      );
    }

    const categories = body.data?.attributes?.categories?.data;
    if (!categories) {
      throw new HTTPError("Empty response");
    }

    return categories;
  }
}
