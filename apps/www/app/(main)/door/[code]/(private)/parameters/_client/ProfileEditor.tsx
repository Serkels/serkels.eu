"use client";

import { TRPC_React } from ":trpc/client";
import { type Profile } from "@1.modules/profile.domain";
import { Button } from "@1.ui/react/button";
import { input, label } from "@1.ui/react/form/atom";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

//

export default function ProfileEditor({
  profile: { id: profile_id },
}: {
  profile: Profile;
}) {
  const { update, data: session } = useSession();
  const router = useRouter();
  console.log({ session });
  const query_profile = TRPC_React.profile.by_id.useQuery(profile_id);
  const update_profile = TRPC_React.profile.me.update.useMutation();

  const profile = query_profile.data;
  if (!profile) return null;

  return (
    <Formik
      initialValues={{ ...profile, email: session?.user?.email }}
      onSubmit={async (values, formik) => {
        await update_profile.mutateAsync({ ...profile, ...values });
        await update();
        formik.resetForm();
        router.refresh();
      }}
      validationSchema={toFormikValidationSchema(
        z.object({
          name: z.string().min(1).trim(),
        }),
      )}
    >
      {({ isSubmitting, dirty, errors, touched }) => (
        <Form className="grid grid-cols-1 gap-5">
          <fieldset>
            <label className={label()} htmlFor="avatar">
              Nom :
            </label>

            <Field
              className={input({
                className: "col-span-full ",
                wrong_value: Boolean(errors.name && touched.name),
              })}
              id="name"
              name="name"
              placeholder="Prenom et Nom"
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
            <label className={label()} htmlFor="avatar">
              Email :
            </label>

            <Field
              className={input({
                className: "col-span-full ",
                wrong_value: Boolean(errors.name && touched.name),
              })}
              id="email"
              name="email"
              placeholder="Email..."
              required
              type="email"
              disabled={true}
              readOnly={true}
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
            <label className={label()} htmlFor="avatar">
              À propos :
            </label>

            <Field
              as="textarea"
              autoComplete="off"
              className={input({
                className: "col-span-full ",
                wrong_value: Boolean(errors.name && touched.name),
              })}
              id="bio"
              name="bio"
              placeholder="À propos..."
              type="text"
              rows={10}
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
          <div hidden={!dirty}></div>
        </Form>
      )}
    </Formik>
  );
}
