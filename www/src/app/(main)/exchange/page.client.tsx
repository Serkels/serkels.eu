"use client";

import { Category } from "@1/modules/category/domain";
import { InputSearch } from "@1/ui/components/InputSearch";
import { Form, Formik, useField } from "formik";
import type { ComponentPropsWithoutRef } from "react";
import { FilterRadioList } from "~/components/FilterRadioList";
import { useSyncSearchQuery } from "~/components/useSyncSearchQuery";
import { useInject } from "~/core/react";
import { Get_Category_UseCase } from "~/modules/question/application/get_categories.use-case";

//

export function CategoriesList() {
  const { query, setQuery } = useSyncSearchQuery("category");

  const categories = useInject(Get_Category_UseCase).execute("exchange");
  categories.push(Category.all);

  //

  return (
    <FilterRadioList
      data={categories}
      active={query ?? ""}
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
