//

import { Fail, Ok, Result, ValueObject, type IAdapter } from "@1/core/domain";
import { IllegalArgs, InputError, type ErrorInstance } from "@1/core/error";
import type { Category_ItemSchema } from "@1/strapi-openapi";
import { z } from "zod";

//

export const Category_PropsSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
});

export type CategoryProps = z.TypeOf<typeof Category_PropsSchema>;

//

export class Category extends ValueObject<CategoryProps> {
  private constructor(props: CategoryProps) {
    super(props);
  }
  static override create(
    props: CategoryProps,
  ): Result<Category, ErrorInstance> {
    if (!this.isValidProps(props)) {
      return Fail(
        new IllegalArgs("Invalid props to create an instance of " + this.name),
      );
    }
    return Ok(new Category(props));
  }

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

export class Category_SchemaToDomain
  implements IAdapter<Category_ItemSchema, Category, ErrorInstance>
{
  fromItemDto(record: unknown): Result<Category, ErrorInstance> {
    try {
      const schema = z
        .object({ id: z.number(), attributes: z.any() })
        .parse(record);
      const domain = this.build(schema);
      if (domain.isFail())
        throw new InputError("Invalid domain", { cause: domain.error() });
      return domain;
    } catch (cause) {
      return Fail(new InputError("Profile_Schema Error", { cause }));
    }
  }

  build({
    id,
    attributes,
  }: Category_ItemSchema): Result<Category, ErrorInstance> {
    if (id === undefined) return Fail(new IllegalArgs("id undefined", {}));
    if (attributes === undefined)
      return Fail(new IllegalArgs("attributes undefined"));

    const { name, slug } = attributes;
    return Category.create({ id, name, slug });
  }
}
