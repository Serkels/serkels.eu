"use client";

import { Button } from "@1/ui/components/ButtonV";
import { InputField } from "@1/ui/components/InputField";
import { Spinner } from "@1/ui/components/Spinner";
import { Form } from "@1/ui/domains/exchange/AskModal";
import { type FormValues } from "@1/ui/domains/signup/UserForm";
import { UserAvatarFilled } from "@1/ui/icons/UserAvatarFilled";
import { useMutation } from "@tanstack/react-query";
import { Formik } from "formik";
import { useSearchParams } from "next/navigation";
import { tv } from "tailwind-variants";
import { P, match } from "ts-pattern";
import { z } from "zod";

//

export function Partener_SignUpForm() {
  const { signup } = useSignUp();
  const submit_query = signup.useMutation();

  //

  return match(submit_query)
    .with({ status: "error", error: P.select() }, (error) => {
      return <ErrorOccur error={error as Error} />;
    })
    .with({ status: "loading" }, () => {
      return <Verifying />;
    })
    .with({ status: "success" }, () => {
      return <ConnectionSuccess />;
    })
    .otherwise(({ mutate }) => {
      return <SignUpForm onSubmit={mutate} />;
    });
}

//

function SignUpForm({ onSubmit }: { onSubmit: (...args: any[]) => void }) {
  const searchParams = useSearchParams();

  const email = z
    .string()
    .email("Partener email")
    .parse(searchParams.get("email"));

  return (
    <Formik
      initialValues={{
        email,
        role: "partner",
        name: "",
        description: "",
        website: "",
        location: "",
      }}
      enableReinitialize
      onSubmit={async (values, formik) => {
        console.log({ values });
        await onSubmit(values);
        formik.resetForm();
      }}
    >
      {({ isSubmitting }) => (
        <Form className={form()}>
          <div className="mx-auto">
            <UserAvatarFilled className="h-14 w-14" />
          </div>
          <InputField name="name" placeholder="Nom de l'établissement" />
          <InputField
            component="textarea"
            name="description"
            rows={5}
            placeholder="À propos"
          />
          <InputField name="location" placeholder="Ville" />
          <InputField name="category" placeholder="Catégorie" disabled={true} />
          <InputField name="website" placeholder="Site web" />
          <InputField name="email" disabled={true} />
          <InputField name="role" type="hidden" />

          <Button type="submit" isDisabled={isSubmitting} className="">
            Terminer
          </Button>
        </Form>
      )}
    </Formik>
  );
}

const form_xl = tv({
  base: ["xl:col-start-4"],
});
const form_md = tv({
  base: ["md:col-span-6 md:col-start-2"],
});
const form = tv({
  base: [
    "col-span-full flex flex-col justify-center space-y-5 px-4 py-5",
    form_md(),
    form_xl(),
  ],
});

//

function ConnectionSuccess() {
  return (
    <div className="col-span-full flex flex-col justify-center bg-black text-white">
      <h1
        className={`
          mx-auto
          my-0
          text-center text-6xl
          font-extrabold
          sm:text-7xl
          lg:text-8xl
        `}
      >
        Consulté votre boite mail pour confirmer votre identité
      </h1>
    </div>
  );
}

function Verifying() {
  return (
    <div className="col-span-full flex flex-col justify-center bg-black text-white">
      <h1
        className={`
          mx-auto
          my-0
          text-center text-6xl
          font-extrabold
          sm:text-7xl
          lg:text-8xl
        `}
      >
        Vérification
      </h1>
      <div className="mx-auto mt-5 text-center">
        <Spinner />
      </div>
    </div>
  );
}

function ErrorOccur({ error }: { error: Error }) {
  return (
    <div className="col-span-full flex flex-col justify-center bg-black text-white">
      <h1
        className={`
          mx-auto
          my-0
          text-center text-6xl
          font-extrabold
          sm:text-7xl
          lg:text-8xl
        `}
      >
        Authentification échouée
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-center">
        Veuillez fermer cette fenêtre et réessayez de vous authentifier.
        <br />
        <code>{error.message}</code>
      </p>
    </div>
  );
}

//

function useSignUp() {
  return {
    signup: {
      useMutation: () =>
        useMutation({
          mutationFn: submitFormHandler,
        }),
    },
  };
}

async function submitFormHandler(context: FormValues) {
  const { email } = context;
  const res = await fetch(`/api/auth/magic/${email}`, {
    method: "POST",
    body: JSON.stringify({ context }),
  });
  const result = await res.json();
  if (result.error) {
    throw result.error;
  }
  return result;
}
