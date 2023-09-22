"use client";

import type {
  Exchange,
  Exchange_CreateProps,
} from "@1/modules/exchange/domain";
import { Spinner } from "@1/ui/components/Spinner";
import * as UI from "@1/ui/domains/exchange/CreateForm";
import type { QueryObserverSuccessResult } from "@tanstack/react-query";
import { format } from "date-fns";
import { Formik } from "formik";
import { P, match } from "ts-pattern";
import { ErrorOccur } from "~/components/ErrorOccur";
import { SelectCategoryField } from "~/components/SelectCategoryField";
import { useInject } from "~/core/react";
import { Edit_Exchange_UseCase } from "~/modules/exchange/application/edit_exchange";
import { Get_Exchange_ById_UseCase } from "~/modules/exchange/application/get_exchange_byid.use-case";
//

export function Edit_Exchange({ exchange_id }: { exchange_id: number }) {
  const query_info = useInject(Get_Exchange_ById_UseCase).execute(exchange_id);

  return match(query_info)
    .with({ status: "error", error: P.select() }, (error) => {
      throw error;
    })
    .with({ status: "loading" }, () => <Spinner />)
    .with({ status: "success" }, (result) => <Edit_Exchange_Form {...result} />)
    .exhaustive();
}

function Edit_Exchange_Form({
  data: exchange,
}: QueryObserverSuccessResult<Exchange, unknown>) {
  const mutation_info = useInject(Edit_Exchange_UseCase).execute(
    exchange.get("id"),
  );

  const { error, mutateAsync } = mutation_info;

  const initialValues = {
    category: exchange.category.id,
    description: exchange.description,
    in_exchange_of: exchange.in_exchange_of?.id ?? "",
    location: exchange.location,
    is_online: exchange.is_online,
    places: 1,
    title: exchange.title,
    type: exchange.type,
    when: format(exchange.when, "yyyy-MM-dd"),
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
