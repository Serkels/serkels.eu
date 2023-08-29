//

import { IllegalArgs } from "@1/core/domain";
import type { components } from "@1/strapi-openapi/v1";
import { BasicOpenApiViewModel } from "~/core/models/BasicOpenApiViewModel";
import { DatedEntryViewModel } from "~/core/models/DatedEntryProps";

export const OTHER_CATEGORY_SLUGS = ["other", "autres", "autre"] as const;

export interface OpportunityCategoriesProps {
  readonly createdAt: Date;
  readonly id: number;
  readonly name: string;
  readonly slug: string;
  readonly updatedAt: Date;
}

export class OpportunityCategoriesViewModel extends BasicOpenApiViewModel<OpportunityCategoriesProps> {
  static from_server({
    id,
    attributes,
  }: components["schemas"]["OpportunityCategoryListResponseDataItem"]) {
    if (id === undefined) throw new IllegalArgs("id undefined", {});
    if (attributes === undefined) throw new IllegalArgs("attributes undefined");

    const { createdAt, name, slug, updatedAt } = attributes;
    return new OpportunityCategoriesViewModel({
      ...DatedEntryViewModel.from_server({ createdAt, updatedAt }),
      id,
      name,
      slug,
    });
  }
}
