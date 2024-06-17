"use client";

import { Button } from "@1.ui/react/button";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

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
      validationSchema={toFormikValidationSchema(
        z.object({
          content: z.string().trim().min(10).max(705),
        }),
      )}
    >
      {({ isSubmitting }) => (
        <Form className="flex-1">
          <fieldset className="mb-7">
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
              name="content"
              placeholder="Pose une question aux étudiant.e.s ..."
              required
            />
            <ErrorMessage name="content">
              {(msg) => <div className="text-danger">{msg}</div>}
            </ErrorMessage>
          </fieldset>
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
