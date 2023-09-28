//

import debug from "debug";
import { Lifecycle, inject, scoped, type InjectionToken } from "~/core/di";
import type { ApiClient } from ".";

//

export const API_TOKEN = Symbol.for("api") as InjectionToken<ApiClient>;
export const JWT_TOKEN = Symbol.for("jwt") as InjectionToken<string>;

//

@scoped(Lifecycle.ContainerScoped)
export class OpenAPI_Repository {
  #log = debug(`~:app:api:OpenAPI_Repository`);
  constructor(
    @inject(API_TOKEN) public readonly client: ApiClient,
    @inject(JWT_TOKEN) public readonly jwt?: string,
  ) {
    this.#log("new", Boolean(jwt) ? "🗝️" : "🔒");
    if (jwt) {
      this.headers.set("Authorization", `Bearer ${this.jwt}`);
      this.#log("🎩");
    }
  }

  readonly headers = new Headers();
}
