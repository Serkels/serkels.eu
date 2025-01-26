"use client";

import { TRPC_React } from ":trpc/client";
import type { Category } from "@1.modules/category.domain";
import {
  Opportunity_Create_Schema,
  type Opportunity,
} from "@1.modules/opportunity.domain";
import { Edit_Opportunity } from "@1.modules/opportunity.ui/form/edit";
import {
  form_to_dto,
  type FieldValues,
} from "@1.modules/opportunity.ui/form/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";

//

export function Mutate_Opportunity_Island({
  opportunity_slug,
}: {
  opportunity_slug: string;
}) {
  const { data: opportunity } =
    TRPC_React.opportunity.by_slug.useQuery(opportunity_slug);
  const { data: categories } = TRPC_React.category.opportunity.useQuery();
  if (!opportunity) return null;
  if (!categories) return null;
  return (
    <Mutate_Opportunity opportunity={opportunity} categories={categories} />
  );
}

function Mutate_Opportunity({
  categories,
  opportunity,
}: {
  categories: Category[];
  opportunity: Opportunity;
}) {
  const { form, on_submit } = use_context(opportunity);
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(on_submit)}>
        <Edit_Opportunity categories={categories} />
      </form>
    </FormProvider>
  );
}

function use_context(opportunity: Opportunity) {
  const router = useRouter();
  const update = TRPC_React.opportunity.update.useMutation();
  const utils = TRPC_React.useUtils();

  const form = useForm<FieldValues>({
    defaultValues: {
      ...opportunity,
    },
    resolver: zodResolver(Opportunity_Create_Schema),
  });

  const on_submit: SubmitHandler<FieldValues> = useCallback(async (values) => {
    console.log(values);
    await update.mutateAsync({
      ...form_to_dto(values),
      id: opportunity.id,
    });
    await Promise.all([
      utils.opportunity.find.invalidate(),
      utils.opportunity.invalidate(),
    ]);
    router.push(`/opportunities/${opportunity.slug}`);
  }, []);

  return { form, on_submit };
}
