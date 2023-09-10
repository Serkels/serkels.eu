"use client";

import { Spinner } from "@1/ui/components/Spinner";
import * as UI from "@1/ui/domains/exchange/CreateForm";
import { match } from "ts-pattern";
import { SelectCategoryField } from "~/components/SelectCategoryField";
import { useExchange_create_controller } from "~/modules/exchange";

//

export function CreateForm() {
  const {
    create: { useMutation },
  } = useExchange_create_controller();

  const { mutate, status, error } = useMutation();
  return match(status)
    .with("error", () => <ErrorOccur error={error as Error} />)
    .with("idle", () => (
      <div className="col-span-full mx-auto flex flex-col justify-center ">
        <UI.CreateForm
          onSubmit={(values) => mutate(values)}
          slot-CategoryField={(props) => (
            <SelectCategoryField type="exchange" {...props} />
          )}
          slot-InExchangeOf={(props) => (
            <SelectCategoryField type="exchange" {...props} />
          )}
        />
      </div>
    ))
    .with("loading", () => <Verifying />)
    .with("success", () => <CreationSuccess />)
    .exhaustive();
}

//

function CreationSuccess() {
  return (
    <div className="col-span-full flex min-h-full flex-col justify-center bg-black text-white">
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

function Verifying() {
  return (
    <div className="col-span-full flex min-h-full flex-col justify-center bg-black text-white">
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
    <div className="col-span-full flex min-h-full flex-col justify-center bg-black text-white">
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
