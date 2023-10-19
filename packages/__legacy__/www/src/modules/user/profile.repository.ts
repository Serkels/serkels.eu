//

import { Lifecycle, inject, scoped } from "@1/core/di";
import { HTTPError } from "@1/core/error";
import debug from "debug";
import { OpenAPI_Repository } from "~/app/api/v1/OpenAPI.repository";

//

@scoped(Lifecycle.ContainerScoped)
export class Profile_Repository {
  #log = debug(`~:modules:user:${Profile_Repository.name}`);
  constructor(
    @inject(OpenAPI_Repository) private readonly openapi: OpenAPI_Repository,
  ) {
    this.#log("new");
  }

  static keys = {
    all: ["profile"] as const,
    profile(id: number | string) {
      return [...this.all, "profile", String(id)] as const;
    },
  };

  get is_authorized() {
    return Boolean(this.openapi.jwt);
  }

  async find_by_id(id: number) {
    const trace = this.#log.extend(`find_by_id(deal_id=${id})`);
    trace("");
    const {
      data: body,
      error: errorBody,
      response,
    } = await this.openapi.client.GET("/user-profiles/{id}", {
      params: {
        path: { id },
      },
    });

    trace(response.status);
    if (errorBody) {
      trace(errorBody);
      throw new HTTPError(
        [errorBody.error.message, "from " + response.url].join("\n"),
        { cause: errorBody.error },
      );
    }

    return body.data;
  }
}
