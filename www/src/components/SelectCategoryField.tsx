//

import { useInject } from "@1/core/ui/di.context.client";
import type { Category_Type } from "@1/modules/category/domain";
import { Field, type FieldAttributes } from "formik";
import { Get_Category_UseCase } from "~/modules/categories/application/get_categories.use-case";
import { Get_Other_Category_UseCase } from "~/modules/categories/application/get_other_categories.use-case";

//

export function SelectCategoryField(
  props: FieldAttributes<{ type: Category_Type }>,
) {
  const { type, ...other_props } = props;
  const get_category = useInject(Get_Category_UseCase);
  const get_other_category = useInject(Get_Other_Category_UseCase);
  const categories = get_category.execute(type);
  const other_category = get_other_category.execute(type);

  return (
    <Field component="select" {...other_props}>
      <option hidden value={""}>
        {props.placeholder}
      </option>
      {categories
        .filter(({ slug }) => slug !== other_category.slug)
        .map(({ name, id }) => (
          <option value={String(id)} key={id}>
            {name}
          </option>
        ))}
      <option value={other_category.id}>{other_category.name}</option>
    </Field>
  );
}
