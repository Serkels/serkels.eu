//

import { Ok, Result, ValueObject, type ErrorInstance } from "@1/core/domain";
import { z } from "zod";

//

export class Category extends ValueObject<Category_Props> {
  static override create(
    props: Category_Props,
  ): Result<Category, ErrorInstance> {
    return Ok(new Category(props));
  }

  static zero = Category.create({
    id: NaN,
    createdAt: new Date(0),
    updatedAt: new Date(0),
    //
    name: "",
    slug: "",
  }).value();

  static all = Category.create({
    id: NaN,
    createdAt: new Date(0),
    updatedAt: new Date(0),
    //
    name: "Tout",
    slug: "",
  }).value();

  //

  get id() {
    return this.props.id;
  }

  get name() {
    return this.props.name;
  }

  get slug() {
    return this.props.slug;
  }
}

//

export const Category_PropsSchema = z
  .object({
    id: z.number(),
    createdAt: z.date(),
    updatedAt: z.date(),
    //
    name: z.string(),
    slug: z.string(),
  })
  .describe("Category Props");

export type Category_Props = z.TypeOf<typeof Category_PropsSchema>;

//

export const Category_Type = z.union([
  z.literal("exchange"),
  z.literal("opportunity"),
  z.literal("question"),
]);

export type Category_Type = z.TypeOf<typeof Category_Type>;

//

export const OTHER_CATEGORY_SLUGS = ["other", "autres", "autre"] as const;
