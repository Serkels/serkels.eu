//

import {
  IllegalArgs,
  Result,
  ValueObject,
  type ErrorInstance,
} from "@1/core/domain";
import { z } from "zod";

//

export const Category_PropsSchema = z
  .object({
    id: z.number(),
    createdAt: z.date().default(new Date()),
    updatedAt: z.date().default(new Date()),
    //
    name: z.string().default(""),
    slug: z.string().default(""),
  })
  .describe("Category Props");

export type Category_Props = z.TypeOf<typeof Category_PropsSchema>;
export type Category_InputProps = z.input<typeof Category_PropsSchema>;

//

export class Category extends ValueObject<Category_Props> {
  static override create(
    props: Category_InputProps,
  ): Result<Category, ErrorInstance> {
    try {
      return Result.Ok(
        new Category(Category_PropsSchema.parse(props, { path: ["props"] })),
      );
    } catch (error) {
      console.error(error);
      return Result.fail(new IllegalArgs("Category", { cause: error }));
    }
  }

  //

  static all = Category.create({
    id: Number.MAX_SAFE_INTEGER,
    createdAt: new Date(0),
    updatedAt: new Date(0),
    //
    name: "Tout",
    slug: "",
  }).value();

  //

  static override isValidProps(props: any): boolean {
    return (
      !this.validator.isUndefined(props) &&
      !this.validator.isNull(props) &&
      Category_PropsSchema.safeParse(props).success
    );
  }

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

export const Category_Type = z.union([
  z.literal("exchange"),
  z.literal("opportunity"),
  z.literal("question"),
]);

export type Category_Type = z.TypeOf<typeof Category_Type>;

//

export const OTHER_CATEGORY_SLUGS = ["other", "autres", "autre"] as const;
