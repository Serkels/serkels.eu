//

import type { Category } from "@1.modules/category.domain";
import { Field, type FieldAttributes } from "formik";

export function OptionCategories({ categories }: { categories: Category[] }) {
  return categories.map(({ name, id }) => (
    <option value={String(id)} key={id}>
      {name}
    </option>
  ));
}

export function SelectCategoryField(
  props: FieldAttributes<{ categories: Category[]; placeholder?: string }>,
) {
  const { categories, ...other_props } = props;
  return (
    <Field component="select" {...other_props}>
      <option hidden value={""}>
        {props.placeholder}
      </option>
      {categories.map(({ name, id }) => (
        <option value={String(id)} key={id}>
          {name}
        </option>
      ))}
    </Field>
  );
}
