"use client";

import { FrenchLocationField } from ":components/FrenchLocationField";
import { TRPC_React } from ":trpc/client";
import type { Category } from "@1.modules/category.domain";
import {
  Exchange_TypeSchema,
  type Exchange_Create,
} from "@1.modules/exchange.domain";
import { Exchange_CreateForm } from "@1.modules/exchange.ui/form/new_exchange";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

//

export function Mutate_Exchange({ categories }: { categories: Category[] }) {
  const create = TRPC_React.exchanges.create.useMutation();
  const utils = TRPC_React.useUtils();
  const router = useRouter();

  return (
    <Formik
      initialValues={{
        ...({
          category_id: "",
          description: "",
          expiry_date: null,
          is_online: false,
          type: Exchange_TypeSchema.Enum.PROPOSAL,
          places: 1,
          title: "",
        } as Exchange_Create),
        category: "",
        return: "",
      }}
      onSubmit={async (values) => {
        await create.mutate({
          ...values,
          expiry_date:
            typeof values.expiry_date === "string"
              ? new Date(values.expiry_date)
              : null,
          category_id: values.category,
          return_id: values.return,
        });

        await utils.exchanges.find.invalidate();

        router.push("/exchanges");
      }}
      validationSchema={toFormikValidationSchema(
        z.object({
          title: z.string().trim().min(10).max(205),
          description: z.string().trim().min(10).max(705),
        }),
      )}
    >
      {(formik) => (
        <Exchange_CreateForm categories={categories} {...formik}>
          <Exchange_CreateForm.LocationField>
            {(input_props) => <FrenchLocationField {...input_props} />}
          </Exchange_CreateForm.LocationField>
        </Exchange_CreateForm>
      )}
    </Formik>
  );
}
