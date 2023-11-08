"use client";

import { TRPC_React } from ":trpc/client";
import type { Category } from "@1.modules/category.domain";
import {
  Exchange_TypeSchema,
  type Exchange_Create,
} from "@1.modules/exchange.domain";
import { Exchange_CreateForm } from "@1.modules/exchange.ui/form/new_exchange";
import { Formik } from "formik";
import { useRouter } from "next/navigation";

//

export function Mutate_Exchange({ categories }: { categories: Category[] }) {
  const create = TRPC_React.exchanges.create.useMutation();
  const utils = TRPC_React.useUtils();
  const router = useRouter();

  return (
    <Formik
      initialValues={{
        ...({} as Exchange_Create),
        return: "",
        is_online: false,
        type: Exchange_TypeSchema.Enum.PROPOSAL,
      }}
      onSubmit={async (values) => {
        await create.mutate({
          ...values,
          expiry_date: new Date(values.expiry_date),
        });

        await utils.exchanges.find.invalidate();

        router.push("/exchanges");
      }}
    >
      {(formik) => <Exchange_CreateForm categories={categories} {...formik} />}
    </Formik>
  );
}
