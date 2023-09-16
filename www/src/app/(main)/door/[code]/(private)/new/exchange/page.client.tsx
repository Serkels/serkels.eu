"use client";

import { Spinner } from "@1/ui/components/Spinner";
import * as UI from "@1/ui/domains/exchange/CreateForm";
import type { ComponentProps } from "react";
import { P, match } from "ts-pattern";
import { SelectCategoryField } from "~/components/SelectCategoryField";
import { useExchange_create_controller } from "~/modules/exchange";

//

export function New_Exchange() {
  const {
    create: { useMutation },
  } = useExchange_create_controller();

  const mutation_info = useMutation();

  return match(mutation_info)
    .with({ status: "success" }, () => <CreationSuccess />)
    .with({ status: "loading" }, () => <Verifying />)
    .with({ status: "error", error: P.select() }, (error) => (
      <ErrorOccur error={error as Error} />
    ))
    .otherwise(({ mutate }) => (
      <New_Exchange_Form onSubmit={(values) => mutate(values)} />
    ));
}

function New_Exchange_Form({
  onSubmit,
}: {
  onSubmit: ComponentProps<typeof UI.CreateForm>["onSubmit"];
}) {
  return (
    <div className="col-span-full flex min-h-full flex-col justify-center ">
      <UI.CreateForm
        onSubmit={onSubmit}
        slot-CategoryField={(props) => (
          <SelectCategoryField type="exchange" {...props} />
        )}
        slot-InExchangeOf={(props) => (
          <SelectCategoryField type="exchange" {...props} />
        )}
      />
    </div>
  );
}

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
