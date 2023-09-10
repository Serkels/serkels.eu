//

import { HTTPError } from "@1/core/error";
import debug from "debug";
import { Lifecycle, inject, scoped } from "tsyringe";
import { OpenAPI_Repository } from "~/app/api/v1/OpenAPI.repository";

//

@scoped(Lifecycle.ContainerScoped)
export class Categories_Repository {
  #log = debug(`~:modules:categories:${Categories_Repository.name}`);

  constructor(
    @inject(OpenAPI_Repository)
    private readonly repository: OpenAPI_Repository,
  ) {
    this.#log("new");
  }

  //

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
    this.#log("exchange");
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
    this.#log("opportunity");
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
    this.#log("question");
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
