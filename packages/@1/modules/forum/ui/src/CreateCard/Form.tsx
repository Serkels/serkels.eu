"use client";

import type { Category } from "@1.modules/category.domain";
import { SelectCategoryField } from "@1.modules/category.ui/form/SelectCategoryField";
import { Button } from "@1.ui/react/button";
import { select } from "@1.ui/react/form/atom";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

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
      validationSchema={toFormikValidationSchema(
        z.object({
          title: z.string().trim().min(10).max(205),
        }),
      )}
    >
      {({ isSubmitting }) => (
        <Form className="flex-1">
          <div className="mb-7">
            <Field
              as="textarea"
              className="
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
            <ErrorMessage name="title">
              {(msg) => <div className="text-danger">{msg}</div>}
            </ErrorMessage>
          </div>
          <div className="flex justify-between">
            <SelectCategoryField
              categories={categories}
              type="question"
              disabled={isSubmitting}
              className={select({
                className: "w-auto min-w-[25%] border border-[#dddddd]",
              })}
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
