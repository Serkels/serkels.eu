import type { Exchange_Schema } from "@1/strapi-openapi";

//

export type Exchange_QueryProps = {
  filter?: { search?: string | undefined; category?: string | undefined };
  pagination?: { pageSize?: number; page?: number };
  sort?: `${keyof NonNullable<NonNullable<Exchange_Schema>>}:${
    | "asc"
    | "desc"}`[];
};
