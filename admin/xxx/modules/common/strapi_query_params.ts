//

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
