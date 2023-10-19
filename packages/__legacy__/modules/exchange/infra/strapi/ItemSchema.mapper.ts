import { Ok, Result, type ErrorInstance, type IAdapter } from "@1/core/domain";
import type { Exchange_ItemSchema } from "@1/strapi-openapi";
import { Exchange } from "../../domain";
import { Exchange_Record } from "./Exchange_Record";

//

export class Exchange_ItemSchemaToDomain
  implements IAdapter<Exchange_ItemSchema, Exchange, ErrorInstance>
{
  build(data: Exchange_ItemSchema): Result<Exchange, ErrorInstance> {
    const dto = Exchange_Record.parse({ data });
    return dto ? Ok(dto) : Ok(Exchange.zero);
  }
  // build(data: Exchange_ItemSchema): Result<Exchange, ErrorInstance> {
  //   try {
  //     return Ok(
  //       Exchange_Record.parse(
  //         { data },
  //         {
  //           path: [
  //             ...JSON.stringify({ data }, null, 2)
  //               .replaceAll('"', '"')
  //               .split("\n"),

  //             "=",
  //             "data",
  //           ],
  //         },
  //       ),
  //     );
  //   } catch (error) {
  //     return Fail(
  //       new IllegalArgs("Exchange_ItemSchemaToDomain.build", {
  //         cause: error,
  //       }),
  //     );
  //   }
  // }
  // build({
  //   id,
  //   attributes,
  // }: Exchange_ItemSchema): Result<Exchange, ErrorInstance> {
  // if (id === undefined) return Fail(new IllegalArgs("id undefined", {}));
  // if (attributes === undefined)
  //   return Fail(new IllegalArgs("attributes undefined"));

  // const { createdAt, updatedAt, type, when, slug, ...other_props } =
  //   attributes;

  // let profile: Profile;
  // try {
  //   profile = Profile_Record.parse(attributes.profile);
  // } catch (error) {
  //   return Fail(
  //     new IllegalArgs("Exchange_ItemSchemaToDomain/profile_to_domain", {
  //       cause: error,
  //     }),
  //   );
  // }

  // const category = attributes.category?.data
  //   ? category_to_domain(attributes.category.data)
  //   : Category.all;

  // const in_exchange_of = attributes.in_exchange_of?.data
  //   ? category_to_domain(attributes.in_exchange_of.data)
  //   : undefined;

  // return Exchange.create({
  //   ...other_props,
  //   //c
  //   createdAt: createdAt ? new Date(createdAt) : new Date(NaN),
  //   updatedAt: updatedAt ? new Date(updatedAt) : new Date(NaN),
  //   //
  //   id,
  //   slug: String(slug),
  //   category,
  //   in_exchange_of,
  //   profile,
  //   type: "proposal",
  //   location: "",
  //   // type: Type.create(type).value(),
  //   when: when ? new Date(when) : new Date(NaN),
  // });
  // }
}
