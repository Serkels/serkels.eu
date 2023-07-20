"use client";

import { Spinner } from "@1/ui/components/Spinner";
import {
  UserForm as SignUpUserForm,
  type FormValues,
} from "@1/ui/domains/signup/UserForm";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

//

export function UserForm({ csrf }: { csrf: string }) {
  if (!csrf) return null;

  const { data: session } = useSession();
  const email = useSearchParams().get("email") ?? undefined;

  const { mutate, isLoading, isSuccess, isError, error } =
    useMutation(submitFormHandler);

  console.log("src/app/(auth)/signup/user/page.tsx", {
    SignUpUserForm,
    csrf,
    session,
    mutate,
  });
  if (isLoading) return <Verifying />;
  if (isSuccess) return <ConnectionSuccess />;
  // // if (isError) return <c />;
  return (
    <div className="col-span-full ">
      <SignUpUserForm
        onSubmit={(values) => {
          console.log("onSubmit", { values });
          mutate(values);
        }}
        csrf={csrf}
        email={email}
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
    <div className="col-span-full ">
      <h1
        className={`
            mx-auto
            my-0
            text-center text-6xl
             font-extrabold
            text-white
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
