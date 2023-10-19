//

import { Result, ValueObject } from "@1/core/domain";
import { ZodError, z } from "zod";
import { Entity_Schema } from "../../common/record";

//

export const Category_PropsSchema = Entity_Schema.merge(
  z.object(
    {
      name: z.string(),
      slug: z.string(),
    },
    { description: "Category" },
  ),
).describe("Category Props");

//
type Props = z.TypeOf<typeof Category_PropsSchema>;
type Props_Input = z.input<typeof Category_PropsSchema>;

//

export class Category extends ValueObject<Props> {
  static override create(props: Props_Input): Result<Category, ZodError> {
    const result = Category_PropsSchema.safeParse(props, {
      path: ["<Category.create>", "props"],
    });
    if (result.success) {
      return Result.Ok(new Category(result.data));
    } else {
      return Result.fail(result.error);
    }
  }

  //

  static all = z.instanceof(Category).parse(
    Category.create({
      name: "Tout",
      slug: "",
    }).value(),
  );

  static unknown = z.instanceof(Category).parse(
    Category.create({
      name: "Inconnu",
      slug: "unknown",
    }).value(),
  );

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
    return Number(this.props.id);
  }

  get name() {
    return this.props.name;
  }

  get slug() {
    return this.props.slug;
  }
}

//

export const CategoryType_Schema = z.union([
  z.literal("exchange"),
  z.literal("opportunity"),
  z.literal("question"),
]);

export type Category_Type = z.TypeOf<typeof CategoryType_Schema>;

//

export const OTHER_CATEGORY_SLUGS = ["other", "autres", "autre"] as const;
