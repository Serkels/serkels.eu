import {
  Fail,
  IllegalArgs,
  Result,
  type ErrorInstance,
  type IAdapter,
} from "@1/core/domain";
import type { Exchange_ItemSchema } from "@1/strapi-openapi";
import { Category } from "../../../category/domain";
import { category_to_domain } from "../../../category/infra/strapi";
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

    const { createdAt, updatedAt, type, when, slug, ...other_props } =
      attributes;

    const profile = new Profile_SchemaToDomain().fromItemDto(
      attributes.profile?.data,
    );
    if (profile.isFail())
      return Fail(
        new IllegalArgs("Exchange_ItemSchemaToDomain/profile_to_domain", {
          cause: profile.error(),
        }),
      );

    const category = attributes.category?.data
      ? category_to_domain(attributes.category.data)
      : Category.all;

    const in_exchange_of = attributes.in_exchange_of?.data
      ? category_to_domain(attributes.in_exchange_of.data)
      : undefined;

    return Exchange.create({
      ...other_props,
      //c
      createdAt: createdAt ? new Date(createdAt) : new Date(NaN),
      updatedAt: updatedAt ? new Date(updatedAt) : new Date(NaN),
      //
      id,
      slug: String(slug),
      category,
      in_exchange_of,
      profile: profile.value(),
      type: Type.create(type).value(),
      when: when ? new Date(when) : new Date(NaN),
    });
  }
}
