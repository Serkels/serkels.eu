"use client";

import { Spinner } from "@1/ui/components/Spinner";
import * as UI from "@1/ui/domains/exchange/CreateForm";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getCsrfToken } from "next-auth/react";
import { SelectCategoryField } from "~/components/SelectCategoryField";

//

export function CreateForm() {
  const { data: csrf } = useQuery({
    queryKey: ["csrf"],
    queryFn: () => getCsrfToken(),
    cacheTime: 0,
  });

  // const email = useSearchParams().get("email") ?? undefined;

  const { isLoading, isSuccess, isError, error } =
    useMutation(submitFormHandler);

  //

  if (!csrf) return null;
  if (isLoading) return <Verifying />;
  if (isSuccess) return <ConnectionSuccess />;
  if (isError) return <ErrorOccur error={error as Error} />;

  return (
    <div className="col-span-full mx-auto flex flex-col justify-center ">
      <UI.CreateForm
        onSubmit={(values) => console.log(values)}
        slot-CategoryField={(props) => <SelectCategoryField {...props} />}
        slot-InExchangeOf={(props) => <SelectCategoryField {...props} />}
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
        Publication acceptée.
      </h1>
    </div>
  );
}

async function submitFormHandler(_context: UI.FormValues) {
  // const { email } = context;
  // const res = await fetch(`/api/auth/magic/${email}`, {
  //   method: "POST",
  //   body: JSON.stringify({ context }),
  // });
  // const result = await res.json();
  // if (result.error) {
  //   throw result.error;
  // }
  // return result;
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
        Publication échouée
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-center">
        Veuillez fermer cette fenêtre et réessayez de vous authentifier.
        <br />
        <code>{error.message}</code>
      </p>
    </div>
  );
}
