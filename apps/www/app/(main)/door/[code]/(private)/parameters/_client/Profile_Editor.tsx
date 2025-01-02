"use client";

import { TRPC_React } from ":trpc/client";
import { useSession } from "@1.modules/auth.next/react";
import { PROFILE_ROLES, type Profile } from "@1.modules/profile.domain";
import { Button } from "@1.ui/react/button";
import { input, label } from "@1.ui/react/form/atom";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { match } from "ts-pattern";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

//

export default function Profile_Editor({
  profile: initial,
}: {
  profile: Profile;
}) {
  const { id: profile_id, role } = initial;
  const { update, data: session } = useSession();
  const utils = TRPC_React.useUtils();
  const router = useRouter();

  const query_profile = TRPC_React.profile.by_id.useQuery(profile_id, {
    select: ({ bio, name }) => ({ bio, name }),
  });
  const update_profile = TRPC_React.profile.me.update.useMutation();

  const profile = query_profile.data ?? initial;

  return (
    <Formik
      initialValues={{ ...profile, email: session?.user?.email }}
      onSubmit={async (values, formik) => {
        const data = await update_profile.mutateAsync({
          ...values,
        });
        await utils.profile.by_id.invalidate(profile_id);
        await update();
        formik.resetForm({ values: { ...data, email: values.email } });
        router.refresh();
      }}
      validationSchema={toFormikValidationSchema(
        z.object({
          bio: z.string().trim().optional(),
          name: z.string().min(1).trim(),
          email: z.string().email(),
        }),
      )}
    >
      {({ isSubmitting, dirty, errors, touched }) => (
        <Form className="grid grid-cols-1 gap-5">
          <fieldset>
            <label className={label()} htmlFor="name">
              {match(role)
                .with(PROFILE_ROLES.Enum.ADMIN, () => "Nom")
                .with(
                  PROFILE_ROLES.Enum.PARTNER,
                  () => "Nom de l'établissement",
                )
                .with(PROFILE_ROLES.Enum.STUDENT, () => "Nom")
                .exhaustive()}{" "}
              :
            </label>

            <Field
              className={input({
                className: "col-span-full",
                wrong_value: Boolean(errors.name && touched.name),
              })}
              id="name"
              name="name"
              placeholder={match(role)
                .with(PROFILE_ROLES.Enum.ADMIN, () => "ADMIN")
                .with(
                  PROFILE_ROLES.Enum.PARTNER,
                  () => "Nom de l'établissement",
                )
                .with(PROFILE_ROLES.Enum.STUDENT, () => "Prenom et Nom")
                .exhaustive()}
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
            <label className={label()} htmlFor="email">
              Email :
            </label>

            <Field
              className={input({
                className: "col-span-full",
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
            <label className={label()} htmlFor="bio">
              Biographie :
            </label>

            <Field
              as="textarea"
              autoComplete="off"
              className={input({
                className: "col-span-full resize-none",
                wrong_value: Boolean(errors.name && touched.name),
              })}
              id="bio"
              name="bio"
              placeholder="Biographie..."
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
        </Form>
      )}
    </Formik>
  );
}
