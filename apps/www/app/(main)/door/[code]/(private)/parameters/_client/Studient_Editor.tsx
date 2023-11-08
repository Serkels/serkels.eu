"use client";

import { TRPC_React } from ":trpc/client";
import { type Studient } from "@1.modules/profile.domain";
import { Button } from "@1.ui/react/button";
import { input, label } from "@1.ui/react/form/atom";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

//

export default function Studient_Editor({
  studient: initial,
}: {
  studient: Studient;
}) {
  const studient_id = initial.id;
  const utils = TRPC_React.useUtils();
  const router = useRouter();

  const query_studient = TRPC_React.studient.by_id.useQuery(studient_id, {
    select: ({ created_at, updated_at, id, profile_id, ...studient }) =>
      studient,
  });
  const update_studient = TRPC_React.studient.me.update.useMutation();

  const studient = query_studient.data ?? initial;

  return (
    <Formik
      initialValues={{ ...studient }}
      onSubmit={async (values, formik) => {
        const data = await update_studient.mutateAsync({
          citizenship: values.citizenship ?? studient.citizenship ?? undefined,
          city: values.city ?? studient.city ?? undefined,
          field_of_study:
            values.field_of_study ?? studient.field_of_study ?? undefined,
          university: values.university ?? studient.university ?? undefined,
        });
        await utils.studient.by_id.invalidate(studient_id);
        formik.resetForm({ values: data });
        router.refresh();
      }}
      validationSchema={toFormikValidationSchema(
        z.object({
          citizenship: z.string().trim().optional(),
          city: z.string().trim().optional(),
          field_of_study: z.string().trim().optional(),
          university: z.string().min(2).trim(),
        }),
      )}
    >
      {({ isSubmitting, dirty, errors, touched }) => (
        <Form className="grid grid-cols-1 gap-5">
          <fieldset>
            <label className={label()} htmlFor="university">
              Université :
            </label>

            <Field
              className={input({
                className: "col-span-full ",
                error: Boolean(errors.university && touched.university),
              })}
              id="university"
              name="university"
              placeholder="Université..."
              required
              type="text"
              disabled={isSubmitting}
            />
            <AnimatePresence>
              <motion.div
                key="name"
                className="overflow-hidden text-right"
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
              >
                <ErrorMessage name="name">
                  {(msg) => <div className="text-danger">{msg}</div>}
                </ErrorMessage>
              </motion.div>
            </AnimatePresence>
          </fieldset>

          <fieldset>
            <label className={label()} htmlFor="field_of_study">
              Domain d'étude :
            </label>

            <Field
              className={input({
                className: "col-span-full ",
                error: Boolean(errors.field_of_study && touched.field_of_study),
              })}
              id="field_of_study"
              name="field_of_study"
              placeholder="Domain d'étude..."
              type="text"
              disabled={isSubmitting}
            />
            <AnimatePresence>
              <motion.div
                key="name"
                className="overflow-hidden text-right"
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
              >
                <ErrorMessage name="name">
                  {(msg) => <div className="text-danger">{msg}</div>}
                </ErrorMessage>
              </motion.div>
            </AnimatePresence>
          </fieldset>

          <fieldset>
            <label className={label()} htmlFor="city">
              Ville :
            </label>

            <Field
              className={input({
                className: "col-span-full ",
                error: Boolean(errors.city && touched.city),
              })}
              id="city"
              name="city"
              placeholder="Ville..."
              type="text"
              disabled={isSubmitting}
            />
            <AnimatePresence>
              <motion.div
                key="name"
                className="overflow-hidden text-right"
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
              >
                <ErrorMessage name="name">
                  {(msg) => <div className="text-danger">{msg}</div>}
                </ErrorMessage>
              </motion.div>
            </AnimatePresence>
          </fieldset>

          <fieldset>
            <label className={label()} htmlFor="citizenship">
              Nationalité :
            </label>

            <Field
              className={input({
                className: "col-span-full ",
                error: Boolean(errors.citizenship && touched.citizenship),
              })}
              id="citizenship"
              name="citizenship"
              placeholder="Nationalité..."
              type="text"
              disabled={isSubmitting}
            />
            <AnimatePresence>
              <motion.div
                key="name"
                className="overflow-hidden text-right"
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
              >
                <ErrorMessage name="name">
                  {(msg) => <div className="text-danger">{msg}</div>}
                </ErrorMessage>
              </motion.div>
            </AnimatePresence>
          </fieldset>

          <motion.div
            className="overflow-hidden text-right"
            animate={{ height: dirty ? "auto" : 0 }}
            initial={{ height: 0 }}
          >
            <Button intent="primary" type="submit" isDisabled={isSubmitting}>
              Sauvegarder
            </Button>
          </motion.div>
        </Form>
      )}
    </Formik>
  );
}
