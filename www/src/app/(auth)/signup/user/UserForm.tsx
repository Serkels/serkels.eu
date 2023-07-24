"use client";

import { Spinner } from "@1/ui/components/Spinner";
import {
  UserForm as SignUpUserForm,
  type FormValues,
} from "@1/ui/domains/signup/UserForm";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

//

export function UserForm({ csrf }: { csrf: string }) {
  if (!csrf) return null;

  const email = useSearchParams().get("email") ?? undefined;

  const { mutate, isLoading, isSuccess, isError, error } =
    useMutation(submitFormHandler);

  if (isLoading) return <Verifying />;
  if (isSuccess) return <ConnectionSuccess />;
  if (isError) return <ErrorOccur error={error as Error} />;

  return (
    <div className="container col-span-full mx-auto flex flex-col justify-center ">
      <SignUpUserForm
        onSubmit={(values) => {
          console.log("onSubmit", { values });
          mutate(values);
        }}
        csrf={csrf}
        email={email}
        profile={{ firstname: "", lastname: "" }}
      />
    </div>
  );
}

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

function Verifying() {
  return (
    <div className="col-span-full bg-black text-white">
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
    <div className="col-span-full bg-black text-white">
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
