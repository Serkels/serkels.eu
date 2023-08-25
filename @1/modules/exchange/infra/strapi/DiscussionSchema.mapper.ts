import {
  Fail,
  IllegalArgs,
  Result,
  type ErrorInstance,
  type IAdapter,
} from "@1/core/domain";
import type { Exchange_DiscussionSchema } from "@1/strapi-openapi";
import { Discussion } from "../../../discussion/domain";
import { Profile_SchemaToDomain } from "../../../profile/infra/strapi";

//

export class Exchange_DiscussionSchemaToDomain
  implements IAdapter<Exchange_DiscussionSchema, Discussion, ErrorInstance>
{
  build({
    id,
    attributes,
  }: Exchange_DiscussionSchema): Result<Discussion, ErrorInstance> {
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
        new IllegalArgs("Exchange_ItemSchemaToDomain/profile_to_domain", {
          cause: profile_to_domain.error(),
        }),
      );

    return Discussion.create({
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
