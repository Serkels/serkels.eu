//

import { useInject } from "@1/core/ui/di.context.client";
import { Button } from "@1/ui/components/Button";
import { Field, Form, Formik } from "formik";
import { useSearchParams } from "next/navigation";
import { SelectCategoryField } from "~/components/SelectCategoryField";
import { Get_Category_UseCase } from "~/modules/categories/application/get_categories.use-case";
import { Get_Other_Category_UseCase } from "~/modules/categories/application/get_other_categories.use-case";

//

export function QACardFormBody({
  initialValues = {},
  onSubmit,
}: {
  initialValues?: { title?: string | undefined; category?: number | undefined };
  onSubmit: (values: { title: string; category: number }) => void;
}) {
  const get_category = useInject(Get_Category_UseCase);
  const get_other_category = useInject(Get_Other_Category_UseCase);
  const search_params = useSearchParams() ?? new URLSearchParams();

  //

  const categories = get_category.execute("question");
  const other_category = get_other_category.execute("question");
  const category = search_params.get("category");
  const initial_category =
    initialValues.category ??
    categories.find(({ slug }) => slug === category)?.id ??
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
              type="question"
              className="min-w-[25%] border border-[#dddddd]"
              disabled={isSubmitting}
              placeholder=""
              name="category"
              required
            />

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
