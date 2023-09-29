//

import { ID_Schema } from "@1/core/domain";
import { z, type ZodTypeAny } from "zod";
import { Entity_Schema } from "./record";

export type Strapi_Query_Params<
  Schema extends Record<string, unknown>,
  SchemaAttributes extends string & keyof Schema = Extract<
    keyof Schema,
    string
  >,
> = {
  pagination?: { pageSize?: number; page?: number };
  sort?: `${SchemaAttributes}:${"asc" | "desc"}`[];
  filters?: Partial<Record<SchemaAttributes, unknown>>;
};

/**
 *
 * @deprecated use {@link StrapiEntity}
 */
export const z_strapi_flatten_page_data = <Z extends ZodTypeAny>(
  attributes: Z,
) => z.array(z.object({ attributes, id: z.number() }));

/**
 *
 * @deprecated use {@link StrapiEntity}
 */
export const z_strapi_entity = <Z extends ZodTypeAny>(attributes: Z) =>
  z.object({ attributes, id: ID_Schema }, { description: "Strapi Entity" });

/**
 *
 * @deprecated use {@link StrapiEntity}
 */
export const z_strapi_entity_data = <Z extends ZodTypeAny>(attributes: Z) =>
  z.object(
    { data: z_strapi_entity(attributes).nullish() },
    { description: "Strapi Entity Data Maybe" },
  );

export const StrapiEntity = <Z extends ZodTypeAny>(attributes: Z) =>
  z.object(
    {
      data: z
        .object(
          {
            attributes: attributes,
            id: Entity_Schema.shape.id,
          },
          { description: "Strapi Entity" },
        )
        .nullable(),
    },
    { description: "Strapi Entity Data Maybe" },
  );
