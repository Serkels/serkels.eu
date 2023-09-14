//

import { InputError } from "@1/core/error";
import type { Category_ItemSchema } from "@1/strapi-openapi";
import { z } from "zod";
import { z_strapi_entity_data } from "../../../common";
import { Strapi_Timestamps } from "../../../common/record";
import { Category } from "../../domain";

//

export const Category_Record = z
  .object({
    name: z.string(),
    slug: z.string(),
  })
  .merge(Strapi_Timestamps)
  .describe("Category Record");
export type Category_Record = z.TypeOf<typeof Category_Record>;

export const Category_DataRecord = z_strapi_entity_data(Category_Record);
export type Category_DataRecord = z.TypeOf<typeof Category_DataRecord>;
export type Category_DataInputProps = z.input<typeof Category_DataRecord>;

//

export function category_to_domain(
  response_data: Category_ItemSchema,
): Category {
  const { id, attributes } = response_data ?? {
    id: Number.MAX_SAFE_INTEGER,
    attributes: {},
  };

  const domain = Category.create({
    ...Category_Record.parse(attributes),
    id: Number(id),
  });

  if (domain.isFail()) {
    throw new InputError("Category_Record.to_domain", {
      cause: domain.error(),
    });
  }

  return domain.value();
}
