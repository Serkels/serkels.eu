import {
  Fail,
  IllegalArgs,
  Result,
  type ErrorInstance,
  type IAdapter,
} from "@1/core/domain";
import type { Exchange_DealSchema } from "@1/strapi-openapi";
import {
  Exchange_DataRecord,
  Exchange_ItemSchemaToDomain,
} from "../../../exchange/infra/strapi";
import { Message_Mapper } from "../../../inbox/infra/strapi";
import { Profile_SchemaToDomain } from "../../../profile/infra/strapi";
import { Deal } from "../../domain";

//

export class Exchange_DealSchemaToDomain
  implements IAdapter<Exchange_DealSchema, Deal, ErrorInstance>
{
  #profile_mapper = new Profile_SchemaToDomain();
  #exchange_mapper = new Exchange_ItemSchemaToDomain();
  build({ id, attributes }: Exchange_DealSchema): Result<Deal, ErrorInstance> {
    if (id === undefined) return Fail(new IllegalArgs("id undefined", {}));
    if (attributes === undefined)
      return Fail(new IllegalArgs("attributes undefined"));

    const { createdAt, updatedAt, last_message, ...other_props } = attributes;

    const profile = this.#profile_mapper.fromItemDto(attributes.profile?.data);
    if (profile.isFail())
      return Fail(
        new IllegalArgs("Exchange_DealSchemaToDomain/profile", {
          cause: profile.error(),
        }),
      );

    const exchange_record = Exchange_DataRecord.parse(attributes.exchange);

    if (!exchange_record.data)
      return Fail(
        new IllegalArgs("Exchange_DealSchemaToDomain/exchange not found"),
      );
    const exchange = this.#exchange_mapper.build({
      id: exchange_record.data.id,
      attributes: exchange_record.data.attributes,
    } as any);

    const message = Message_Mapper.parse(last_message?.data);

    return Deal.create({
      ...other_props,
      //
      createdAt: createdAt ? new Date(createdAt) : new Date(NaN),
      updatedAt: updatedAt ? new Date(updatedAt) : new Date(NaN),
      //
      id,
      last_message: message,

      profile: profile.value(),
      exchange: exchange.value(),
    });
  }
}
