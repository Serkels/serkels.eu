"use client";

import { OpportunityCategoriesViewModel } from "@/app/opportunity/models/OpportunityCategoriesViewModel";
import { FilterRadioList } from "@/components/FilterRadioList";
import { useSyncSearchQuery } from "@/components/useSyncSearchQuery";
import type { components } from "@1/strapi-openapi/v1";
import { InputSearch } from "@1/ui/components/InputSearch";
import { Form, Formik, useField } from "formik";
import type { ComponentPropsWithoutRef } from "react";

//

export function CategoriesList({
  data,
}: components["schemas"]["OpportunityCategoryListResponse"]) {
  const { query, setQuery } = useSyncSearchQuery("category");

  //

  if (!data) return <>0_o</>;

  const categories = data.map(OpportunityCategoriesViewModel.from_server);
  categories.push(
    new OpportunityCategoriesViewModel({
      id: NaN,
      name: "Tout",
      slug: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  );

  return (
    <FilterRadioList
      data={categories}
      active={query}
      name="category"
      onChange={setQuery}
    />
  );
}

//

export function SearchForm() {
  const { query, setQuery } = useSyncSearchQuery("q");
  return (
    <Formik
      initialValues={{ query }}
      onSubmit={(values) => setQuery(values.query)}
    >
      {({}) => (
        <Form>
          <QueryInputSearch />
        </Form>
      )}
    </Formik>
  );
}

function QueryInputSearch(props: ComponentPropsWithoutRef<"input">) {
  const [field] = useField("query");
  return <InputSearch {...field} {...props} />;
}
