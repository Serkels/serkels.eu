//

import { InputError } from "@1/core/error";
import { z } from "zod";
import { z_strapi_entity_data } from "../../../common";
import { Strapi_Timestamps } from "../../../common/record";
import { Bookmark } from "../../domain";

//

export const Bookmark_Record = z
  .object({
    name: z.string(),
    slug: z.string(),
  })
  .merge(Strapi_Timestamps)
  .describe("Category Record");
export type Bookmark_Record = z.TypeOf<typeof Bookmark_Record>;

export const Bookmark_DataRecord = z_strapi_entity_data(Bookmark_Record);
export type Bookmark_DataRecord = z.TypeOf<typeof Bookmark_DataRecord>;

//

export function bookmark_to_domain({ data }: Bookmark_DataRecord): Bookmark {
  const { id, attributes } = data ?? { id: NaN, attributes: {} };

  const domain = Bookmark.create({
    ...Bookmark.zero.toObject(),
    ...attributes,
    id,
  });

  if (domain.isFail()) {
    throw new InputError("Category_Record.to_domain", {
      cause: domain.error(),
    });
  }

  return domain.value();
}
