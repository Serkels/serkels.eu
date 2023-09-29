"use client";

import { useInject } from "@1/core/ui/di.context.client";
import { Category } from "@1/modules/category/domain";
import { InputSearch } from "@1/ui/components/InputSearch";
import { Form, Formik, useField } from "formik";
import { useSearchParams } from "next/navigation";
import type { ComponentPropsWithoutRef } from "react";
import { CategoryFilterRadioList } from "~/components/FilterRadioList";
import { useSyncSearchQuery } from "~/components/useSyncSearchQuery";
import { Get_Category_UseCase } from "~/modules/categories/application/get_categories.use-case";
import { Exchange_InfiniteList } from "~/modules/exchange/Exchange_InfiniteList";
import { Get_Exchanges_UseCase } from "~/modules/exchange/application/get_exchanges.use-case";

//

export function CategoriesList() {
  const { query, setQuery } = useSyncSearchQuery("category");

  const categories = useInject(Get_Category_UseCase).execute("exchange");
  categories.push(Category.all);

  //

  return (
    <CategoryFilterRadioList
      data={categories}
      active={query ?? ""}
      name="category"
      onChange={setQuery}
    />
  );
}

//

export function Exchange_List() {
  const search_params = useSearchParams();
  const category = search_params.get("category") ?? undefined;
  const search = search_params.get("q") ?? undefined;

  const info = useInject(Get_Exchanges_UseCase).execute({
    filters: {
      category,
      title: search,
    },
    sort: ["createdAt:desc"],
    pagination: { pageSize: 4 },
  });

  //

  return <Exchange_InfiniteList info={info} />;
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
