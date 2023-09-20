//

import { IllegalArgs, InputError } from "@1/core/error";
import { z } from "zod";
import { z_strapi_entity_data } from "../../../common";
import { Strapi_Timestamps } from "../../../common/record";
import { Exchange_Mapper } from "../../../exchange/infra/strapi";
import { Message_Mapper } from "../../../inbox/infra/strapi";
import { Profile_Mapper } from "../../../profile/infra/strapi";
import { Deal } from "../../domain";

//

export const Deal_Record = z
  .object({
    exchange: Exchange_Mapper,
    last_message: Message_Mapper,
    profile: Profile_Mapper,
  })
  .merge(Strapi_Timestamps)
  .describe("Exchange Record");
export type Deal_Record = z.TypeOf<typeof Deal_Record>;

//

export const Deal_DataRecord = z_strapi_entity_data(Deal_Record);
export type Deal_DataRecord = z.TypeOf<typeof Deal_DataRecord>;

//

export const Deal_Mapper = Deal_DataRecord.transform(({ data }) => {
  if (!data)
    throw new InputError("Deal_Mapper", {
      errors: [new IllegalArgs("data undefined")],
    });

  const domain = Deal.create({
    ...data.attributes,
    id: data.id,
  } as any);

  if (domain.isFail()) {
    throw new InputError("Deal_Mapper", { cause: domain.error() });
  }

  return domain.value();
});
