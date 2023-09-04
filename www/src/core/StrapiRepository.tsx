//

import debug from "debug";
import { OpenAPIRepository, type ApiClient } from "~/app/api/v1";

//

export class StrapiRepository extends OpenAPIRepository {
  constructor(client: ApiClient, jwt: string | undefined) {
    super(client, jwt);
    this.#log("new");
  }
  #log = debug("~:modules:exchange:StrapiRootRepository");
}
