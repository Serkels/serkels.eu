//

import { z, type ZodTypeAny } from "zod";

export type Strapi_Query_Params<
  Schema extends Record<string, unknown>,
  SchemaAttributes extends string & keyof Schema = Extract<
    keyof Schema,
    string
  >,
> = {
  pagination?: { pageSize?: number; page?: number };
  sort?: `${SchemaAttributes}:${"asc" | "desc"}`[];
};

export const z_strapi_flatten_page_data = <Z extends ZodTypeAny>(
  attributes: Z,
) => z.array(z.object({ attributes, id: z.number() }));

export type Strapi_flatten_page_data<Z extends ZodTypeAny> = ReturnType<
  typeof z_strapi_flatten_page_data<Z>
>;

export const z_strapi_entity = <Z extends ZodTypeAny>(attributes: Z) =>
  z.object({ attributes, id: z.coerce.number() });
export const z_strapi_entity_data = <Z extends ZodTypeAny>(attributes: Z) =>
  z.object({ data: z_strapi_entity(attributes) });
export type Strapi_entity_data<Z extends ZodTypeAny> = ReturnType<
  typeof z_strapi_entity_data<Z>
>;
export const z_strapi_collection = <Z extends ReturnType<typeof z.object>>(
  attributes: Z,
) =>
  z.object({
    data: z.array(z_strapi_entity(attributes)),
  });
