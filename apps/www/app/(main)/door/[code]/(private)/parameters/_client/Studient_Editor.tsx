"use client";

import { TRPC_React } from ":trpc/client";
import { Studient_Schema, type Studient } from "@1.modules/profile.domain";
import { Button } from "@1.ui/react/button";
import { input, label } from "@1.ui/react/form/atom";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

//

export default function Studient_Editor({
  student: initial,
}: {
  student: Studient;
}) {
  const student_id = initial.id;
  const utils = TRPC_React.useUtils();
  const router = useRouter();

  const query_student = TRPC_React.student.by_id.useQuery(student_id, {
    select: ({ created_at, updated_at, id, profile_id, ...student }) => student,
  });
  const update_student = TRPC_React.student.me.update.useMutation();

  const student = query_student.data ?? initial;
  const names = Studient_Schema.keyof().Enum;

  return (
    <Formik
      initialValues={{ ...student }}
      onSubmit={async (values, formik) => {
        const data = await update_student.mutateAsync({
          city: values.city ?? student.city ?? undefined,
          field_of_study:
            values.field_of_study ?? student.field_of_study ?? undefined,
          language: values.language ?? student.language ?? undefined,
          university: values.university ?? student.university ?? undefined,
        });
        await utils.student.by_id.invalidate(student_id);
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
            <label className={label()} htmlFor={names.university}>
              Université :
            </label>

            <Field
              className={input({
                className: "col-span-full",
                wrong_value: Boolean(errors.university && touched.university),
              })}
              id={names.university}
              name={names.university}
              placeholder="Université..."
              required
              type="text"
              disabled={isSubmitting}
            />
            <AnimatePresence>
              <motion.div
                key={names.university}
                className="overflow-hidden text-right"
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
              >
                <ErrorMessage name={names.university}>
                  {(msg) => <div className="text-danger">{msg}</div>}
                </ErrorMessage>
              </motion.div>
            </AnimatePresence>
          </fieldset>

          <fieldset>
            <label className={label()} htmlFor={names.field_of_study}>
              Domain d'étude :
            </label>

            <Field
              className={input({
                className: "col-span-full",
                wrong_value: Boolean(
                  errors.field_of_study && touched.field_of_study,
                ),
              })}
              id={names.field_of_study}
              name={names.field_of_study}
              placeholder="Domain d'étude..."
              type="text"
              disabled={isSubmitting}
            />
            <AnimatePresence>
              <motion.div
                key={names.field_of_study}
                className="overflow-hidden text-right"
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
              >
                <ErrorMessage name={names.field_of_study}>
                  {(msg) => <div className="text-danger">{msg}</div>}
                </ErrorMessage>
              </motion.div>
            </AnimatePresence>
          </fieldset>

          <fieldset>
            <label className={label()} htmlFor={names.city}>
              Ville :
            </label>

            <Field
              className={input({
                className: "col-span-full",
                wrong_value: Boolean(errors.city && touched.city),
              })}
              id={names.city}
              name={names.city}
              placeholder="Ville..."
              type="text"
              disabled={isSubmitting}
            />
            <AnimatePresence>
              <motion.div
                key={names.city}
                className="overflow-hidden text-right"
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
              >
                <ErrorMessage name={names.city}>
                  {(msg) => <div className="text-danger">{msg}</div>}
                </ErrorMessage>
              </motion.div>
            </AnimatePresence>
          </fieldset>

          <fieldset>
            <label className={label()} htmlFor={names.language}>
              Langue :
            </label>

            <Field
              className={input({
                className: "col-span-full",
                wrong_value: Boolean(errors.language && touched.language),
              })}
              id={names.language}
              name={names.language}
              placeholder="Nationalité..."
              type="text"
              disabled={isSubmitting}
            />
            <AnimatePresence>
              <motion.div
                key={names.language}
                className="overflow-hidden text-right"
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
              >
                <ErrorMessage name={names.language}>
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
