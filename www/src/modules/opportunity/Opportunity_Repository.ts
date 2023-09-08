//

import { OpenAPIRepository } from "~/app/api/v1";

//

export class Opportunity_Repository extends OpenAPIRepository {
  static keys = {
    all: ["opportunity"],
  };

  // async find_all() {
  //   const {
  //     data: body,
  //     error: errorBody,
  //     response,
  //   } = await this.client.GET("/opportunities", {
  //     headers: this.headers,
  //   });

  //   if (errorBody) {
  //     throw new HTTPError(
  //       [errorBody.error.message, "from " + response.url].join("\n"),
  //       { cause: errorBody.error },
  //     );
  //   }

  //   return body?.data;
  // }
}
