//

import { IllegalArgs, InputError } from "@1/core/error";
import { z } from "zod";
import { Category_Mapper } from "../../../category/infra/strapi";
import { z_strapi_entity_data } from "../../../common";
import { Strapi_Timestamps } from "../../../common/record";
import { Profile_Mapper } from "../../../profile/infra/strapi";
import { Exchange } from "../../domain";

//

export const Exchange_Record = z
  .object({
    available_places: z.coerce.number(),
    category: Category_Mapper, //Category_DataRecord,
    description: z.string(),
    in_exchange_of: Category_Mapper.optional(),
    is_online: z.boolean(),
    location: z.string(),
    places: z.coerce.number(),
    profile: Profile_Mapper,
    slug: z.string(),
    title: z.string(),
    type: z.union([z.literal("proposal"), z.literal("research")]),
    when: z.coerce.date(),
  })
  .merge(Strapi_Timestamps)
  .describe("Exchange Record");
export type Exchange_Record = z.TypeOf<typeof Exchange_Record>;

export const Exchange_DataRecord = z_strapi_entity_data(Exchange_Record);
export type Exchange_DataRecord = z.TypeOf<typeof Exchange_DataRecord>;

//

export const Exchange_Mapper = Exchange_DataRecord.transform(({ data }) => {
  if (!data)
    throw new InputError("Exchange_Mapper", {
      errors: [new IllegalArgs("data undefined")],
    });

  const domain = Exchange.create({
    ...data.attributes,
    id: data.id,
  } as any);

  if (domain.isFail()) {
    throw new InputError("Exchange_Mapper", { cause: domain.error() });
  }

  return domain.value();
});
