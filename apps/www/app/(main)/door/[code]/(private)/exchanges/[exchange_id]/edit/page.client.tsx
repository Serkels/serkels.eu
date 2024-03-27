"use client";

import { TRPC_React } from ":trpc/client";
import type { Category } from "@1.modules/category.domain";
import type { Exchange_Flat_Schema } from "@1.modules/exchange.domain";
import { Exchange_CreateForm } from "@1.modules/exchange.ui/form/new_exchange";
import { format } from "date-fns";
import { Formik } from "formik";
import { useRouter } from "next/navigation";

//

export function Mutate_Exchange({
  categories,
  exchange,
}: {
  categories: Category[];
  exchange: Exchange_Flat_Schema;
}) {
  const do_update = TRPC_React.exchanges.me.update.useMutation();
  const utils = TRPC_React.useUtils();
  const router = useRouter();

  return (
    <Formik
      initialValues={{
        ...exchange,
        category: exchange.category_id  ,
        expiry_date: exchange.expiry_date
          ? format(exchange.expiry_date, "yyyy-MM-dd")
          : undefined,
        return: exchange.return_id ?? "",
        is_online: exchange.is_online,
        type: exchange.type,
      }}
      onSubmit={async (values) => {
        console.log(values)
        await do_update.mutateAsync({
          category_id: values.category,
          description: values.description,
          exchange_id: exchange.id,
          expiry_date: typeof values.expiry_date === "string" ? new Date(values.expiry_date) : null,
          return_id: values.return_id,
          title: values.title,
        });

        await utils.exchanges.by_id.invalidate(exchange.id);
        await utils.exchanges.invalidate();

        router.push(`/exchanges?q=${values.title}`);
      }}
    >
      {(formik) => <Exchange_CreateForm categories={categories} {...formik} />}
    </Formik>
  );
}
