//

import type { ApiClient } from "@/app/api/v1";
import type { _1_HOUR_ } from "@douglasduteil/datatypes...hours-to-seconds";

export class UserProfileRepository {
  constructor(private client: ApiClient) {}

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
