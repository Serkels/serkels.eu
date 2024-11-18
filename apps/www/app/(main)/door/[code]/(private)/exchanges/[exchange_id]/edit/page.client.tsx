"use client";

import { TRPC_React } from ":trpc/client";
import { trpc_client } from "@1.infra/trpc/react-query/client";
import type { Category } from "@1.modules/category.domain";
import { type Exchange_Flat_Schema } from "@1.modules/exchange.domain";
import {
  Exchange_EditForm,
  form_to_dto,
  form_zod_schema,
  type FormValues,
} from "@1.modules/exchange.ui/form/new_exchange";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";

//

export function Mutate_Exchange_Island({
  exchange_id,
}: {
  exchange_id: string;
}) {
  const { data: exchange } = trpc_client.exchanges.by_id.useQuery(exchange_id);
  const { data: categories } = trpc_client.category.exchange.useQuery();
  if (!exchange) return null;
  if (!categories) return null;
  return <Mutate_Exchange exchange={exchange} categories={categories} />;
}

function Mutate_Exchange({
  categories,
  exchange,
}: {
  categories: Category[];
  exchange: Exchange_Flat_Schema;
}) {
  const alreadyPopulated = exchange.deals.length > 0;
  const form = useForm<FormValues>({
    defaultValues: {
      ...exchange,
      is_online: exchange.is_online ? "true" : "false",
      expiry_date: exchange.expiry_date
        ? format(exchange.expiry_date, "yyyy-MM-dd")
        : undefined,
    },

    resolver: zodResolver(form_zod_schema),
  });

  const do_update = TRPC_React.exchanges.me.update.useMutation();
  const utils = TRPC_React.useUtils();
  const router = useRouter();

  const on_submit: SubmitHandler<FormValues> = async (values) => {
    if (alreadyPopulated) return;

    await do_update.mutateAsync({
      ...form_to_dto(values),
      exchange_id: exchange.id,
    });

    await Promise.all([
      utils.exchanges.by_id.invalidate(exchange.id),
      utils.exchanges.find.invalidate(),
      utils.exchanges.invalidate(),
    ]);

    router.push(`/exchanges/${exchange.id}`);
  };
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(on_submit)}>
        <Exchange_EditForm categories={categories} />
      </form>
    </FormProvider>
  );
}
