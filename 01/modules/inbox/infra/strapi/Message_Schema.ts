//

import { IllegalArgs, InputError } from "@1/core/error";
import { z } from "zod";
import { z_strapi_entity, z_strapi_entity_data } from "../../../common";
import { Strapi_Timestamps } from "../../../common/record";
import { Profile_Mapper, Profile_Schema } from "../../../profile/infra/strapi";
import { Message } from "../../domain";

//

export const Message_Schema = z
  .object({
    id: z.number().optional(),
    content: z.string(),
    author: z_strapi_entity_data(Profile_Schema).optional(),
  })
  .merge(Strapi_Timestamps)
  .describe("Message Record");

export type Message_Schema = z.TypeOf<typeof Message_Schema>;

export const Message_DataSchema = z_strapi_entity(Message_Schema);

export type Message_DataSchema = z.TypeOf<typeof Message_DataSchema>;

//

export const MessageList_Schema = z.object({
  data: z.array(Message_Schema),
  meta: z.any(),
});

export type MessageList_Schema = z.TypeOf<typeof MessageList_Schema>;

//

const Message_DataRecord = z_strapi_entity_data(
  z
    .object({
      content: z.string(),
      author: z
        .object({ id: z.coerce.number() })
        .passthrough()
        .transform((author) =>
          Profile_Mapper.parse({ data: { id: author.id, attributes: author } }),
        ),
    })
    .merge(Strapi_Timestamps)
    .describe("Message Record"),
);

export const Message_Mapper = Message_DataRecord.transform(function to_domain({
  data,
}): Message {
  if (!data)
    throw new InputError("Message_Mapper", {
      errors: [new IllegalArgs("data undefined")],
    });

  const domain = Message.create({
    ...data.attributes,
    id: data.id,
  });

  if (domain.isFail()) {
    throw new InputError("Message_Mapper", { cause: domain.error() });
  }

  return domain.value();
});
