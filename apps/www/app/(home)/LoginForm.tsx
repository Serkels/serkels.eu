//

import { PROFILE_ROLES } from "@1.modules/profile.domain";
import { Button } from "@1.ui/react/button";
import { Field, Form, Formik, type FormikConfig } from "formik";
import type { PropsWithChildren } from "react";
import { createSlot } from "react-slotify";

export function LoginForm({ children }: PropsWithChildren) {
  return (
    <div className="grid grid-cols-1 gap-5 rounded-md border bg-white px-4 py-5 text-Dove_Gray shadow-[10px_10px_10px_#00000029]">
      <LoginForm.Login.Renderer childs={children}></LoginForm.Login.Renderer>
      {/* <SignUp onSubmit={onSignUp} /> */}
      <hr />
      {/* <__Login__ onSubmit={onLogin} /> */}
    </div>
  );
}
LoginForm.Login = createSlot();
export function SignUp({ onSubmit }: SignUpProps) {
  return (
    <Formik initialValues={{ email: "", as: "" }} onSubmit={onSubmit}>
      {({ isSubmitting, setFieldValue }) => (
        <Form className="flex flex-col items-center space-y-5 text-black">
          <h1 className="text-center text-sm font-bold uppercase">
            Créer un compte
          </h1>

          <Field
            className="h-8 max-w-[90%] rounded-sm border border-solid border-[#dddddd] px-3 py-2 placeholder-[#AAAAAA] md:text-xs"
            name="email"
            placeholder="Adresse email"
            required
            type="email"
          />

          <Button
            intent="secondary"
            type="submit"
            isDisabled={isSubmitting}
            onPress={() => setFieldValue("as", PROFILE_ROLES.enum.STUDENT)}
          >
            Étudiant
          </Button>

          <Button
            intent="quinary"
            type="submit"
            // isDisabled={isSubmitting}
            isDisabled={true}
            onPress={() => setFieldValue("as", PROFILE_ROLES.enum.PARTNER)}
          >
            Partenaire
          </Button>
        </Form>
      )}
    </Formik>
  );
}

//

type SignUpProps = {
  onSubmit: FormikConfig<{ email: string; as: string }>["onSubmit"];
};
