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

export const z_strapi_flatten_page_data = <Z extends ZodTypeAny>(
  attributes: Z,
) => z.array(z.object({ attributes, id: z.number() }));

export type Strapi_flatten_page_data<Z extends ZodTypeAny> = ReturnType<
  typeof z_strapi_flatten_page_data<Z>
>;

export const z_strapi_entity = <Z extends ZodTypeAny>(attributes: Z) =>
  z.object({ attributes, id: ID_Schema }, { description: "Strapi Entity" });
export const z_strapi_entity_data = <Z extends ZodTypeAny>(attributes: Z) =>
  z.object(
    { data: z_strapi_entity(attributes).nullish() },
    { description: "Strapi Entity Data Maybe" },
  );
export const z_strapi_entity_data_strict = <Z extends ZodTypeAny>(
  attributes: Z,
) =>
  z.object(
    { data: z_strapi_entity(attributes) },
    { description: "Strapi Entity Data" },
  );
export type Strapi_entity_data<Z extends ZodTypeAny> = ReturnType<
  typeof z_strapi_entity_data<Z>
>;
export const z_strapi_collection = <Z extends ReturnType<typeof z.object>>(
  attributes: Z,
) =>
  z.object({
    data: z.array(z_strapi_entity(attributes), {
      description: "Strapi Collection",
    }),
  });

// export const StrapiDataEntity = z_strapi_entity_data(
//   z.object({}, { description: "Strapi unknown attributes" }).passthrough(),
// );

export const StrapiFlattenDataEntity = z
  .object({
    id: ID_Schema,
  })
  .and(z.any());
// export const StrapiFlattenDataEntity = z.object({
//   attributes: z.any(),
//   id: ID_Schema,
// });
// export const StrapiFDataEntity = StrapiDataEntity.transform(
//   ({ data: { attributes, id } }) => ({ id: , ...attributes }),
// );
// z
// .preprocess(
//   (data) => {
//     const {
//       data: { attributes, id },
//     } = data as z.input<typeof StrapiDataEntity>;
//     return { id, ...attributes };
//   },
//   StrapiFlattenDataEntity,
//   { description: "StrapiFlattenDataEntity" },
// )
// .pipe(StrapiFlattenDataEntity)

// export const StrapiEntity = () =>
// StrapiDataEntity
//   .refine((value) => {
//     try {
//       return StrapiDataEntity.safeParse(value).success;
//     } catch (error) {
//       return false;
//     }
//   }).transform(
//       ({ data: { attributes, id } }) => {
//         debugger;
//         console.log({ attributes, id });
//         return { id, ...attributes };
//       },
//     );
// export const StrapiEntity = () =>
// StrapiDataEntity
//   .refine((value) => {
//     try {
//       return StrapiDataEntity.safeParse(value).success;
//     } catch (error) {
//       return false;
//     }
//   }).transform(
//       ({ data: { attributes, id } }) => {
//         debugger;
//         console.log({ attributes, id });
//         return { id, ...attributes };
//       },
//     );
export const StrapiDataEntity = z.object(
  {
    data: z
      .object(
        {
          attributes: z.any(),
          id: Entity_Schema.shape.id,
        },
        { description: "Strapi Entity" },
      )
      .nullable(),
  },
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
