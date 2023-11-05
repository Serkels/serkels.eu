"use client";

import type { Category } from "@1.modules/category.domain";
import { SelectCategoryField } from "@1.modules/category.ui/form/SelectCategoryField";
import { Button } from "@1.ui/react/button";
import { Field, Form, Formik } from "formik";

//

export function CreateQuestionForm({
  categories,
  initialValues = {},
  onSubmit,
}: {
  categories: Category[];
  initialValues?: { title?: string; category?: string };
  onSubmit: (values: { title: string; category: string }) => void;
}) {
  return (
    <Formik
      initialValues={{
        title: initialValues.title ?? "",
        category: initialValues.category ?? "",
      }}
      enableReinitialize
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="flex-1">
          <Field
            as="textarea"
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
              categories={categories}
              type="question"
              className="min-w-[25%] border border-[#dddddd]"
              disabled={isSubmitting}
              // placeholder=""
              name="category"
              required
            />

            <Button
              type="submit"
              intent="primary"
              isDisabled={isSubmitting}
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
