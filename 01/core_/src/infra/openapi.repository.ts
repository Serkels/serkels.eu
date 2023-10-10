//

// TODO(douglasduteil): remove import "reflect-metadata";
// Should not be here...
import "reflect-metadata";

//

import { TRPCError } from "@trpc/server";
import debug from "debug";
import type { FetchResponse } from "openapi-fetch";
import { Lifecycle, inject, scoped } from "tsyringe";

//

@scoped(Lifecycle.ContainerScoped)
export class OpenAPI_Repository<Client> {
  #log = debug(`~:corre:infra:OpenAPI_Repository`);

  static readonly TOKEN = {
    CLIENT: Symbol.for("client"),
    JWT: Symbol.for("jwt"),
  };

  constructor(
    @inject(OpenAPI_Repository.TOKEN.CLIENT) public readonly client: Client,
    @inject(OpenAPI_Repository.TOKEN.JWT) public readonly jwt?: string,
  ) {
    this.#log("new", Boolean(jwt) ? "🗝️" : "🔒");
    if (jwt) {
      this.headers.set("Authorization", `Bearer ${this.jwt}`);
      this.#log("🎩");
    }
  }

  readonly headers = new Headers();

  async fetch<T>(fetch_response: Promise<FetchResponse<T>>) {
    const trace = this.#log.extend("fetch");

    const { data, error: errorBody, response } = await fetch_response;

    trace(`${response.url} ${response.status}`);
    if (errorBody) {
      trace("ERROR", errorBody);
      const { error } = errorBody as any as { error: Error };
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: [error.message, "from " + response.url].join("\n"),
        cause: error,
      });
    }
    return data;
  }
}
