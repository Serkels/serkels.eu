//

import {
  Fail,
  Ok,
  Result,
  ValueObject,
  type ErrorInstance,
} from "@1/core/domain";
import { z } from "zod";
import { Strapi_ID, Strapi_Timestamps } from "../../common/record";

//

export const Category_PropsSchema = z
  .object({
    name: z.string(),
    slug: z.string(),
  })
  .merge(Strapi_ID)
  .merge(Strapi_Timestamps)
  .describe("Category Props");

//
type Props = z.TypeOf<typeof Category_PropsSchema>;
type Props_Input = z.input<typeof Category_PropsSchema>;

//

export class Category extends ValueObject<Props> {
  static override create(props: Props_Input): Result<Category, ErrorInstance> {
    try {
      return Ok(
        new Category(
          Category_PropsSchema.parse(props, {
            path: ["Deal.create(props)"],
          }),
        ),
      );
    } catch (error) {
      return Fail(error as ErrorInstance);
    }
  }

  //

  static all = Category.create({
    id: Number.MAX_SAFE_INTEGER,
    //
    name: "Tout",
    slug: "",
  }).value();

  static unknown = Category.create({
    id: Number.MAX_SAFE_INTEGER - 1,
    //
    name: "Inconnu",
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

export const CategoryType_Schema = z.union([
  z.literal("exchange"),
  z.literal("opportunity"),
  z.literal("question"),
]);

export type Category_Type = z.TypeOf<typeof CategoryType_Schema>;

//

export const OTHER_CATEGORY_SLUGS = ["other", "autres", "autre"] as const;
