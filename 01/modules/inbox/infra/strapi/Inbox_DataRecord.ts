import { IllegalArgs, InputError } from "@1/core/error";
import { z } from "zod";
import { z_strapi_entity_data } from "../../../common";
import { Strapi_Timestamps } from "../../../common/record";
import { Inbox } from "../../domain";

//
const Inbox_DataRecord = z_strapi_entity_data(
  z
    .object(
      {
        thread: z.any(),
        // thread: z.any().optional(),
        // author: z
        //   .object({ id: z.coerce.number() })
        //   .passthrough()
        //   .transform((author) =>
        //     Profile_Mapper.parse({
        //       data: { id: author.id, attributes: author },
        //     }),
        //   ),
      },
      { description: "Inbox Record" },
    )
    .merge(Strapi_Timestamps),
);

export const Inbox_Mapper = Inbox_DataRecord.transform(function to_domain({
  data,
}): Inbox {
  if (!data)
    throw new InputError("Inbox_Mapper", {
      errors: [new IllegalArgs("data undefined")],
    });

  const domain = Inbox.create({
    ...data.attributes,
    id: data.id,
    thread: {} as any,
  });

  if (domain.isFail()) {
    throw new InputError("Inbox_Mapper", { cause: domain.error() });
  }

  return domain.value();
});
