"use client";

import { TRPC_React } from ":trpc/client";
import type { Category } from "@1.modules/category.domain";
import type { Opportunity_Create } from "@1.modules/opportunity.domain";
import { Opportunity_Create_Schema } from "@1.modules/opportunity.domain";
import { Opportunity_CreateForm } from "@1.modules/opportunity.ui/form/create";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import { toFormikValidationSchema } from "zod-formik-adapter";

//

export default function CreateOpportunityForm({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const create = TRPC_React.opportunity.create.useMutation();
  const utils = TRPC_React.useUtils();
  const initialValues: Opportunity_Create = {
    cover: "",
    description: "",
    expiry_date: new Date(),
    is_online: true,
    link: "",
    category: "",
    location: undefined,
    title: "",
  };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={async (values) => {
        try {
          const opportunity = await create.mutateAsync(values);
          await utils.opportunity.invalidate();
          router.push(`/opportunities/${opportunity.slug}`);
        } catch (error) {
          console.error(error);
        }
      }}
      validationSchema={toFormikValidationSchema(Opportunity_Create_Schema)}
    >
      {(formik) => (
        <Opportunity_CreateForm categories={categories} {...formik} />
      )}
    </Formik>
  );
}
