"use client";

//

import type { Category } from "@1.modules/category.domain";
import {
  Exchange_CreateForm,
  type Exchange_CreateProps,
} from "@1.modules/exchange.ui/form/new_exchange";
import { Formik } from "formik";

//

export function CreateExchangeForm({ categories }: { categories: Category[] }) {
  const initialValues = {} as any as Exchange_CreateProps;
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={async (_values) => {
        try {
          // await mutateAsync(values as any);
        } catch (error) {}
      }}
    >
      {(formik) => <Exchange_CreateForm categories={categories} {...formik} />}
    </Formik>
  );
}
