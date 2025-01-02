"use client";

import { TRPC_React } from ":trpc/client";
import { type Partner } from "@1.modules/profile.domain";
import { Button } from "@1.ui/react/button";
import { input, label } from "@1.ui/react/form/atom";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

//

export default function Partner_Editor({
  partner: initial,
}: {
  partner: Partner;
}) {
  const partner_id = initial.id;
  const utils = TRPC_React.useUtils();
  const router = useRouter();

  const query_partner = TRPC_React.partner.by_id.useQuery(partner_id, {
    select: ({ created_at, updated_at, id, profile_id, ...partner }) => partner,
  });
  const update_partner = TRPC_React.partner.me.update.useMutation();

  const partner = query_partner.data ?? initial;

  return (
    <Formik
      initialValues={{ ...partner }}
      onSubmit={async (values, formik) => {
        const data = await update_partner.mutateAsync({
          city: values.city ?? partner.city ?? undefined,
          link: values.link ?? partner.link ?? undefined,
        });
        await utils.partner.by_id.invalidate(partner_id);
        formik.resetForm({ values: data });
        router.refresh();
      }}
      validationSchema={toFormikValidationSchema(
        z.object({
          city: z.string().trim().min(2),
          link: z.string().trim().url().optional(),
        }),
      )}
    >
      {({ isSubmitting, dirty, errors, touched }) => (
        <Form className="grid grid-cols-1 gap-5">
          <fieldset>
            <label className={label()} htmlFor="city">
              Ville :
            </label>

            <Field
              className={input({
                className: "col-span-full ",
                wrong_value: Boolean(errors.city && touched.city),
              })}
              id="city"
              name="city"
              placeholder="Ville..."
              type="text"
              required
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
            <label className={label()} htmlFor="link">
              Site web :
            </label>

            <Field
              className={input({
                className: "col-span-full ",
                wrong_value: Boolean(errors.link && touched.link),
              })}
              id="link"
              name="link"
              placeholder="Site web..."
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
