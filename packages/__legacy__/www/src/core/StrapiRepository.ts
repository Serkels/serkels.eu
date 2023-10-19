//

import debug from "debug";
import { type ApiClient } from "~/app/api/v1";
import { OpenAPI_Repository } from "~/app/api/v1/OpenAPI.repository";

//

export class StrapiRepository extends OpenAPI_Repository {
  constructor(client: ApiClient, jwt: string | undefined) {
    super(client, jwt);
    this.#log("new");
  }
  #log = debug("~:modules:exchange:StrapiRootRepository");
}
