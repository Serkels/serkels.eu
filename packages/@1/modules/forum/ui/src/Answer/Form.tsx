"use client";

import { Button } from "@1.ui/react/button";
import { Field, Form, Formik } from "formik";

//

export function CreateAnswerForm({
  initialValues = {},
  onSubmit,
}: {
  initialValues?: { content?: string };
  onSubmit: (values: { content: string }) => void;
}) {
  return (
    <Formik
      initialValues={{
        content: initialValues.content ?? "",
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
            name="content"
            placeholder="Pose une questions aux étudiants ..."
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
        </Form>
      )}
    </Formik>
  );
}
