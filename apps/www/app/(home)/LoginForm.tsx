//

import { PROFILE_ROLES } from "@1.modules/profile.domain";
import { Button } from "@1.ui/react/button";
import { Field, Form, Formik, type FormikConfig } from "formik";
import { useState } from "react";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

export function LoginForm({
  onLogin,
  onSignUp,
}: {
  onLogin: LoginProps["onSubmit"];
  onSignUp: SignUpProps["onSubmit"];
}) {
  return (
    <div className="grid grid-cols-1 gap-5 rounded-md border bg-white px-4 py-5 text-[#BEBEBE] shadow-[10px_10px_10px_#00000029]">
      <Login onSubmit={onLogin} />
      <div className="relative inline-flex w-full items-center justify-center px-3">
        <hr className="my-4 h-px w-full border-0 bg-[#BEBEBE] " />
        <span className="absolute left-1/2 -translate-x-1/2 bg-white px-3">
          Ou
        </span>
      </div>
      <SignUp onSubmit={onSignUp} />
    </div>
  );
}

// Schéma de validation
const SignUpSchema = z.object({
  email: z.string().email("Email invalide").min(1, "Requis"),
});

function SignUp({ onSubmit }: SignUpProps) {
  const [showEmailField, setShowEmailField] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  return (
    <Formik
      initialValues={{ email: "", as: "" }}
      validationSchema={toFormikValidationSchema(SignUpSchema)}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, setFieldValue, values, errors }) => (
        <Form className="flex flex-col items-center space-y-3 text-black">
          {showEmailField && (
            <>
              <Field
                className="h-8 max-w-[90%] rounded-sm border border-solid border-[#dddddd] px-3 py-2 placeholder-[#AAAAAA] md:text-xs"
                name="email"
                placeholder="Adresse email d'inscription"
                type="email"
              />
            </>
          )}
          {submitted && errors.email && (
            <div className="text-sm text-red-500">{errors.email}</div>
          )}
          <Button
            intent="secondary"
            type={showEmailField ? "submit" : "button"}
            isDisabled={isSubmitting}
            onPress={() => {
              if (!showEmailField) {
                setShowEmailField(true);
              } else if (values.email && !errors.email) {
                setFieldValue("as", PROFILE_ROLES.enum.STUDENT);
              }
              if (showEmailField) {
                setSubmitted(true);
              }
            }}
          >
            {showEmailField ? "Valider" : "Créer un compte"}
          </Button>
        </Form>
      )}
    </Formik>
  );
}

function Login({ onSubmit }: LoginProps) {
  return (
    <Formik initialValues={{ email: "" }} onSubmit={onSubmit}>
      {({ isSubmitting }) => (
        <Form className="flex flex-col items-center space-y-5">
          <Field
            className="h-8 max-w-[90%] rounded-sm border border-solid border-[#dddddd] px-3 py-2 text-black placeholder-[#AAAAAA] md:text-xs"
            name="email"
            placeholder="Adresse email de connexion"
            required
            type="email"
          />

          <Button intent="primary" type="submit" isDisabled={isSubmitting}>
            Se connecter
          </Button>
        </Form>
      )}
    </Formik>
  );
}

//

type LoginProps = { onSubmit: FormikConfig<{ email: string }>["onSubmit"] };
type SignUpProps = {
  onSubmit: FormikConfig<{ email: string; as: string }>["onSubmit"];
};
