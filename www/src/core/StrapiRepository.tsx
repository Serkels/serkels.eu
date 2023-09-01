//

import type { _1_HOUR_ } from "@douglasduteil/datatypes...hours-to-seconds";
import debug from "debug";
import { OpenAPIRepository, type ApiClient } from "~/app/api/v1";

//

export class StrapiRepository extends OpenAPIRepository {
  constructor(client: ApiClient, jwt: string | undefined) {
    super(client, jwt);
    this.#log("new");
  }
  #log = debug("~:modules:exchange:StrapiRootRepository");

  async loadById(id: number | string) {
    const {
      data: body,
      error,
      response,
    } = await this.client.GET(`/user-profiles/{id}`, {
      params: {
        path: { id: Number(id) },
      },
      next: { revalidate: 3600 satisfies _1_HOUR_ },
    });

    if (error) {
      console.error(error, "from " + response.url);
    }

    return body?.data;
  }
}
