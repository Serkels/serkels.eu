//

import { Field, type FieldAttributes } from "formik";
import { useOpportunityCategoriesQuery } from "~/app/opportunity/data/useOpportunityCategoriesQuery";
import {
  OTHER_CATEGORY_SLUGS,
  OpportunityCategoriesViewModel,
} from "~/app/opportunity/models/OpportunityCategoriesViewModel";

//

export function useOpportunityCategories() {
  const query_info = useOpportunityCategoriesQuery();
  const { data: all_categories } = query_info;

  const categories = all_categories?.map(
    OpportunityCategoriesViewModel.from_server,
  );

  const other_category = categories?.find(({ slug }) =>
    OTHER_CATEGORY_SLUGS.includes(
      slug as (typeof OTHER_CATEGORY_SLUGS)[number],
    ),
  );

  return { categories, other_category, query_info };
}

export function SelectCategoryField(props: FieldAttributes<{}>) {
  const {
    query_info: { isLoading },
    categories,
    other_category,
  } = useOpportunityCategories();

  if (isLoading || !categories || !other_category) {
    return null;
  }

  return (
    <Field component="select" {...props}>
      <option hidden value={""}>
        {props.placeholder}
      </option>
      {categories
        .filter(({ slug }) => slug !== other_category.slug)
        .map(({ name, id }) => (
          <option value={id} key={id}>
            {name}
          </option>
        ))}
      <option value={other_category.id}>{other_category.name}</option>
    </Field>
  );
}
