//

import { useOpportunityCategoriesQuery } from "@/app/opportunity/data/useOpportunityCategoriesQuery";
import {
  OTHER_CATEGORY_SLUGS,
  OpportunityCategoriesViewModel,
} from "@/app/opportunity/models/OpportunityCategoriesViewModel";
import { Button } from "@1/ui/components/Button";
import { Field, Form, Formik } from "formik";
import { useSearchParams } from "next/navigation";
import { SelectCategoryField } from "~/components/SelectCategoryField";

//

export function QACardFormBody({
  initialValues = {},
  onSubmit,
}: {
  initialValues?: { title?: string | undefined; category?: number | undefined };
  onSubmit: (values: { title: string; category: number }) => void;
}) {
  const { isLoading: is_loading_categories, data: all_categories } =
    useOpportunityCategoriesQuery();

  const searchParams = useSearchParams();

  //

  const categories = all_categories?.map(
    OpportunityCategoriesViewModel.from_server,
  );

  const other_category = categories?.find(({ slug }) =>
    OTHER_CATEGORY_SLUGS.includes(
      slug as (typeof OTHER_CATEGORY_SLUGS)[number],
    ),
  );

  if (is_loading_categories || !categories || !other_category) {
    return null;
  }

  const category = searchParams.get("category");
  const initial_category =
    initialValues.category ??
    categories?.find(({ slug }) => slug === category)?.id ??
    other_category.id;

  return (
    <Formik
      initialValues={{
        title: initialValues.title ?? "",
        category: initial_category,
      }}
      enableReinitialize
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="flex-1">
          <Field
            className="
              mb-7
              w-full 
              rounded-sm border border-solid border-[#dddddd] 
              px-4 py-3
              
              placeholder-black
              
              md:col-span-6
            "
            disabled={isSubmitting}
            name="title"
            placeholder="Pose une questions aux étudiants ..."
            required
          />
          <div className="flex justify-between">
            <SelectCategoryField
              className="min-w-[25%] border border-[#dddddd]"
              disabled={isSubmitting}
              name="category"
              required
            />
            <Field
              className="min-w-[25%] border border-[#dddddd]"
              component="select"
              disabled={isSubmitting}
              name="category"
              required
            >
              {categories
                .filter(({ slug }) => slug !== other_category.slug)
                .map(({ name, id }) => (
                  <option value={id} key={id}>
                    {name}
                  </option>
                ))}
              <option value={other_category.id}>Autres</option>
            </Field>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="max-w-fit"
            >
              Envoyer
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
