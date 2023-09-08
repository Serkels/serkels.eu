//

import { Button } from "@1/ui/components/Button";
import { Field, Form, Formik, type FieldAttributes } from "formik";
import { useSearchParams } from "next/navigation";
import { useInject } from "~/core/react";
import { Get_Category_UseCase } from "~/modules/question/application/get_categories.use-case";
import { Get_Other_Category_UseCase } from "~/modules/question/application/get_other_categories.use-case";

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

  const categories = get_category.execute();
  const other_category = get_other_category.execute();
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

export function SelectCategoryField(props: FieldAttributes<{}>) {
  const get_category = useInject(Get_Category_UseCase);
  const get_other_category = useInject(Get_Other_Category_UseCase);
  const categories = get_category.execute();
  const other_category = get_other_category.execute();

  return (
    <Field component="select" {...props}>
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
