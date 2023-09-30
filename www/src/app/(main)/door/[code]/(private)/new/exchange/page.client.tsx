"use client";

import type { Exchange_CreateProps } from "@1/modules/exchange/domain";
import { useInject } from "@1/next-tsyringe";
import * as UI from "@1/ui/domains/exchange/CreateForm";
import { Formik } from "formik";
import { match } from "ts-pattern";
import { ErrorOccur } from "~/components/ErrorOccur";
import { SelectCategoryField } from "~/components/SelectCategoryField";
import { Create_Exchange_UseCase } from "~/modules/exchange/application/create_exchange";

//

export function New_Exchange() {
  const mutation_info = useInject(Create_Exchange_UseCase).execute();
  return match(mutation_info)
    .with({ status: "success" }, () => <CreationSuccess />)
    .otherwise(() => <New_Exchange_Form />);
}

function New_Exchange_Form() {
  const mutation_info = useInject(Create_Exchange_UseCase).execute();

  const { error, mutateAsync } = mutation_info;

  const initialValues = {
    category: "",
    description: "",
    in_exchange_of: "",
    location: "",
    is_online: true,
    places: 1,
    title: "",
    type: "proposal",
    when: "",
  } as Exchange_CreateProps;

  return (
    <div className="col-span-full flex min-h-full flex-col justify-center ">
      {error ? <ErrorOccur error={error as Error}></ErrorOccur> : null}
      <Formik
        initialValues={initialValues}
        onSubmit={async (values) => {
          try {
            await mutateAsync(values as any);
          } catch (error) {}
        }}
      >
        {(formik) => (
          <UI.CreateForm
            {...formik}
            slot-CategoryField={(props) => (
              <SelectCategoryField type="exchange" {...props} />
            )}
            slot-InExchangeOf={(props) => (
              <SelectCategoryField type="exchange" {...props} />
            )}
          />
        )}
      </Formik>
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
