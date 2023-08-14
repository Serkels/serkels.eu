//

import { IllegalArgs } from "@/core/errors";
import { BasicOpenApiViewModel } from "@/core/models/BasicOpenApiViewModel";
import type { components } from "@1/strapi-openapi/v1";

//

export interface ProfileProps {
  id: number;
  firstname: string;
  lastname: string;
  university: string;
}

export class ProfileViewModel extends BasicOpenApiViewModel<ProfileProps> {
  static from_server({
    id,
    attributes,
  }: components["schemas"]["UserProfileListResponseDataItem"]) {
    if (id === undefined) throw new IllegalArgs("id undefined", {});
    if (attributes === undefined) throw new IllegalArgs("attributes undefined");

    const { firstname, lastname, university } = attributes;
    return new ProfileViewModel({
      // ...attributes,
      id,
      firstname,
      lastname,
      university: university ?? "Non communiqué",
    });
  }

  get name() {
    return `${this.firstname} ${this.lastname}`;
  }

  get image() {
    return `/api/v1/avatars/u/${this.id}`;
  }
}
