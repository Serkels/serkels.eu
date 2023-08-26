import {
  Fail,
  IllegalArgs,
  Result,
  type ErrorInstance,
  type IAdapter,
} from "@1/core/domain";
import type { Exchange_DealSchema } from "@1/strapi-openapi";
import { Profile_SchemaToDomain } from "../../../profile/infra/strapi";
import { Deal } from "../../domain";

//

export class Exchange_DealSchemaToDomain
  implements IAdapter<Exchange_DealSchema, Deal, ErrorInstance>
{
  build({ id, attributes }: Exchange_DealSchema): Result<Deal, ErrorInstance> {
    if (id === undefined) return Fail(new IllegalArgs("id undefined", {}));
    if (attributes === undefined)
      return Fail(new IllegalArgs("attributes undefined"));

    const {
      createdAt,
      updatedAt,
      profile: raw_profile,
      ...other_props
    } = attributes;

    const profile_to_domain = new Profile_SchemaToDomain().fromItemDto(
      raw_profile?.data,
    );
    if (profile_to_domain.isFail())
      return Fail(
        new IllegalArgs("Exchange_DealSchemaToDomain/profile_to_domain", {
          cause: profile_to_domain.error(),
        }),
      );

    return Deal.create({
      ...other_props,
      //
      createdAt: createdAt ? new Date(createdAt) : new Date(NaN),
      updatedAt: updatedAt ? new Date(updatedAt) : new Date(NaN),
      //
      id,
      last_message: "Bonjour ! Je veux bien apprendre le français avec toi !",

      profile: profile_to_domain.value(),
    });
  }
}
