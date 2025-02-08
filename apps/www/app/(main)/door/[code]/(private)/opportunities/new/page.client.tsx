"use client";

import { TRPC_React } from ":trpc/client";
import type { Category } from "@1.modules/category.domain";
import { Opportunity_Create_Schema } from "@1.modules/opportunity.domain";
import { Edit_Opportunity } from "@1.modules/opportunity.ui/form/edit";
import { type FieldValues } from "@1.modules/opportunity.ui/form/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";

//

export function Create_Opportunity_Island() {
  const { data: categories } = TRPC_React.category.opportunity.useQuery();
  if (!categories) return null;
  return <Create_Opportunity categories={categories} />;
}

function Create_Opportunity({ categories }: { categories: Category[] }) {
  const { form, on_submit } = use_context();
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(on_submit)}>
        <Edit_Opportunity categories={categories} />
      </form>
    </FormProvider>
  );
}

function use_context() {
  const router = useRouter();
  const create = TRPC_React.opportunity.create.useMutation();
  const utils = TRPC_React.useUtils();

  const form = useForm<FieldValues>({
    defaultValues: {
      description: "",
      title: "",
    },
    resolver: zodResolver(Opportunity_Create_Schema),
  });

  const on_submit: SubmitHandler<FieldValues> = useCallback(async (values) => {
    const opportunity = await create.mutateAsync(values);
    await Promise.all([
      utils.opportunity.find.invalidate(),
      utils.opportunity.invalidate(),
    ]);
    router.push(`/opportunities/${opportunity.slug}`);
  }, []);

  return { form, on_submit };
}
