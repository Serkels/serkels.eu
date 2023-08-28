import {
  Fail,
  IllegalArgs,
  Result,
  type ErrorInstance,
  type IAdapter,
} from "@1/core/domain";
import type { Exchange_ItemSchema } from "@1/strapi-openapi";
import { Category_SchemaToDomain } from "../../../common";
import { Profile_SchemaToDomain } from "../../../profile/infra/strapi";
import { Exchange } from "../../domain";
import { Type } from "../../domain/Type.value";

//

export class Exchange_ItemSchemaToDomain
  implements IAdapter<Exchange_ItemSchema, Exchange, ErrorInstance>
{
  build({
    id,
    attributes,
  }: Exchange_ItemSchema): Result<Exchange, ErrorInstance> {
    if (id === undefined) return Fail(new IllegalArgs("id undefined", {}));
    if (attributes === undefined)
      return Fail(new IllegalArgs("attributes undefined"));

    const {
      createdAt,
      category: raw_category,
      updatedAt,
      profile: raw_profile,
      type,
      in_exchange_of,
      when,
      slug,
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

    const category_to_domain = new Category_SchemaToDomain().fromItemDto(
      raw_category?.data,
    );
    if (category_to_domain.isFail())
      return Fail(
        new IllegalArgs("Exchange_ItemSchemaToDomain/category_to_domain", {
          cause: category_to_domain.error(),
        }),
      );

    const in_exchange_of_to_domain = new Category_SchemaToDomain().fromItemDto(
      in_exchange_of?.data,
    );

    return Exchange.create({
      ...other_props,
      //
      createdAt: createdAt ? new Date(createdAt) : new Date(NaN),
      updatedAt: updatedAt ? new Date(updatedAt) : new Date(NaN),
      //
      id,
      slug: String(slug),
      category: category_to_domain.value(),
      in_exchange_of: in_exchange_of_to_domain.isFail()
        ? undefined
        : in_exchange_of_to_domain.value(),
      profile: profile_to_domain.value(),
      type: Type.create(type).value(),
      when: when ? new Date(when) : new Date(NaN),
    });
  }
}
