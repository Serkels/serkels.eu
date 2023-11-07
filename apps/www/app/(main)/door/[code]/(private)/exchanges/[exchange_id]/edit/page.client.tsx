"use client";

import { TRPC_React } from ":trpc/client";
import type { Category } from "@1.modules/category.domain";
import type { Exchange_Create } from "@1.modules/exchange.domain";
import { Exchange_CreateForm } from "@1.modules/exchange.ui/form/new_exchange";
import { format } from "date-fns";
import { Formik } from "formik";

//

export function Mutate_Exchange({
  categories,
  exchange,
}: {
  categories: Category[];
  exchange: Exchange_Create;
}) {
  const do_update = TRPC_React.exchanges.me.update.useMutation();
  const utils = TRPC_React.useUtils();

  return (
    <Formik
      initialValues={{
        ...exchange,
        expiry_date: format(exchange.expiry_date, "yyyy-MM-dd"),
        return: exchange.return ?? "",
        is_online: exchange.is_online,
        type: exchange.type,
      }}
      onSubmit={async (values) => {
        await do_update.mutateAsync({
          exchange_id: exchange.id,
          ...values,
          expiry_date: new Date(values.expiry_date),
          return: values.return === "" ? null : values.return,
        });
        await utils.exchanges.by_id.invalidate(exchange.id);
      }}
    >
      {(formik) => <Exchange_CreateForm categories={categories} {...formik} />}
    </Formik>
  );
}
