"use client";

import { TRPC_React } from ":trpc/client";
import type { Category } from "@1.modules/category.domain";
import type { Opportunity } from "@1.modules/opportunity.domain";
import { Edit_Opportunity } from "@1.modules/opportunity.ui/form/edit";
import type { FieldValues } from "@1.modules/opportunity.ui/form/schema";
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
  const form = useForm<FieldValues>({
    defaultValues: {
      ...opportunity,
    },
  });
  const on_submit: SubmitHandler<FieldValues> = async (values) => {
    console.log({ values });
  };
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(on_submit)}>
        <Edit_Opportunity categories={categories} />
      </form>
    </FormProvider>
  );
}
