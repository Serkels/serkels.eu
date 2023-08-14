//

import { IllegalArgs } from "@/core/errors";
import { DatedEntryViewModel } from "@/core/models/DatedEntryProps";
import type { components } from "@1/strapi-openapi/v1";

export class OpportunityCategoriesViewModel {
  static from_server({
    id,
    attributes,
  }: components["schemas"]["OpportunityCategoryListResponseDataItem"]) {
    if (id === undefined) throw new IllegalArgs("id undefined", {});
    if (attributes === undefined) throw new IllegalArgs("attributes undefined");

    const { createdAt, name, slug, updatedAt } = attributes;
    return new OpportunityCategoriesViewModel(id, name, {
      ...DatedEntryViewModel.from_server({ createdAt, updatedAt }),
      slug,
    });
  }

  //

  readonly createdAt: Date = new Date();
  readonly slug: string;
  readonly updatedAt: Date = new Date();

  //

  constructor(
    public readonly id: number,
    public readonly name: string,

    data: Partial<OpportunityCategoriesViewModel>,
  ) {
    this.slug = name;
    Object.assign(this, data);
  }
}
