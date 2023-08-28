import type { Exchange_Schema } from "@1/strapi-openapi";

//

export type Exchanges_QueryProps = {
  filter?: { search?: string | undefined; category?: string | undefined };
  pagination?: { pageSize?: number; page?: number };
  sort?: `${keyof NonNullable<NonNullable<Exchange_Schema>>}:${
    | "asc"
    | "desc"}`[];
};

export type Deals_QueryProps = {
  filter?: { search?: string | undefined; category?: string | undefined };
  pagination?: { pageSize?: number; page?: number };
  sort?: `${keyof NonNullable<NonNullable<Exchange_Schema>>}:${
    | "asc"
    | "desc"}`[];
};

export type Messages_QueryProps = {
  filter?: { search?: string | undefined; category?: string | undefined };
  pagination?: { pageSize?: number; page?: number };
  sort?: `${keyof NonNullable<NonNullable<Exchange_Schema>>}:${
    | "asc"
    | "desc"}`[];
};
