//

import debug from "debug";
import { Lifecycle, inject, scoped } from "tsyringe";

//

@scoped(Lifecycle.ContainerScoped)
export class OpenAPI_Repository<Client> {
  #log = debug(`~:app:api:OpenAPI_Repository`);

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
}
