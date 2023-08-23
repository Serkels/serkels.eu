//

import { ProfileViewModel } from "@/app/my/models/ProfileViewModel";
import { OpportunityCategoriesViewModel } from "@/app/opportunity/models/OpportunityCategoriesViewModel";
import { BasicOpenApiViewModel } from "@/core/models/BasicOpenApiViewModel";
import { DatedEntryViewModel } from "@/core/models/DatedEntryProps";
import { IllegalArgs } from "@1/core/domain";

export interface ExchangeProps {
  readonly createdAt: Date;
  readonly description: string;
  readonly type: "research" | "proposal";
  readonly id: number;
  readonly profile: ProfileViewModel;
  readonly slug: string;
  readonly title: string;
  readonly location: string;
  readonly updatedAt: Date;
  readonly is_online: boolean;
  readonly category: OpportunityCategoriesViewModel;
  readonly in_exchange_of?: OpportunityCategoriesViewModel;
}

export class ExchangeViewModel extends BasicOpenApiViewModel<ExchangeProps> {
  static from_server({ id, attributes }: any) {
    if (id === undefined) throw new IllegalArgs("id undefined", {});
    if (attributes === undefined) throw new IllegalArgs("attributes undefined");

    const {
      createdAt,
      title,
      slug,
      description,
      category,
      updatedAt,
      profile,
      in_exchange_of,
    } = attributes;

    return new ExchangeViewModel({
      ...attributes,
      ...DatedEntryViewModel.from_server({ createdAt, updatedAt }),
      id,
      title,
      slug,
      description,
      profile: ProfileViewModel.from_server(profile.data),
      category: OpportunityCategoriesViewModel.from_server(category.data),
      in_exchange_of: in_exchange_of
        ? OpportunityCategoriesViewModel.from_server(in_exchange_of.data)
        : undefined,
    });
  }
}
