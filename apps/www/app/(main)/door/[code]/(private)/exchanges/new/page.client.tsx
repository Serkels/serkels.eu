"use client";

import { TRPC_React } from ":trpc/client";
import type { Category } from "@1.modules/category.domain";
import { Exchange_TypeSchema } from "@1.modules/exchange.domain";
import {
  Exchange_EditForm,
  form_to_dto,
  form_zod_schema,
  type FormValues,
} from "@1.modules/exchange.ui/form/new_exchange";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";

//

export function Create_Exchange_Island() {
  const { data: categories } = TRPC_React.category.exchange.useQuery();
  if (!categories) return null;
  return <Create_Exchange categories={categories} />;
}

function Create_Exchange({ categories }: { categories: Category[] }) {
  const form = useForm<FormValues>({
    defaultValues: {
      type: Exchange_TypeSchema.Enum.PROPOSAL,

      description: "",
      expiry_date: undefined,
      is_online: "false",
      places: 1,
      return_id: "",
      title: "",
    },

    resolver: zodResolver(form_zod_schema),
  });
  const create = TRPC_React.exchanges.create.useMutation();
  const utils = TRPC_React.useUtils();
  const router = useRouter();

  const on_submit: SubmitHandler<FormValues> = async (values) => {
    await create.mutateAsync(form_to_dto(values));

    await Promise.all([
      utils.exchanges.find.invalidate(),
      utils.exchanges.invalidate(),
    ]);

    router.push(`/exchanges?q=${values.title}`);
  };
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(on_submit)}>
        <Exchange_EditForm categories={categories} />
      </form>
    </FormProvider>
  );
}
