"use client";

import { Category } from "@1/modules/category/domain";
import {
  Category_DataRecord,
  category_to_domain,
} from "@1/modules/category/infra/strapi";
import { useSession } from "next-auth/react";
import { FilterRadioList } from "~/components/FilterRadioList";
import { useSyncSearchQuery } from "~/components/useSyncSearchQuery";
import { useCategories_Query } from "~/modules/categories";
import { QACreateForm } from "./QACreateForm";
import type { QAFilterType } from "./models/QAFilterType";

//

export function CategoriesList() {
  const { query, setQuery } = useSyncSearchQuery("category");
  const { question } = useCategories_Query();
  const { data: categories_data } = question.useQuery();

  //

  if (!categories_data) return <>0_o</>;

  const categories = categories_data.map((data, index) =>
    category_to_domain(
      Category_DataRecord.parse(
        { data },
        { path: [`categories_data.${index}`] },
      ),
    ),
  );
  categories.push(Category.all);

  return (
    <FilterRadioList
      data={categories}
      active={query}
      name="category"
      onChange={setQuery}
    />
  );
}

const data: { name: string; slug: QAFilterType }[] = [
  { name: "Les dernières questions", slug: "" },
  // { name: "Questions fréquentes", slug: "frequently" },
  // { name: "Mes questions", slug: "mine" },
  // { name: "Les dernières réponses", slug: "lastest-answers" },
  // { name: "Questions répondus", slug: "awnsered" },
];

export function QAFilter() {
  const { query, setQuery } = useSyncSearchQuery("f");

  return (
    <FilterRadioList
      data={data}
      active={query}
      name="filter"
      onChange={setQuery}
    />
  );
}

export function Question_Form() {
  const { status } = useSession();

  if (status !== "authenticated") {
    return null;
  }

  return (
    <>
      <hr className="my-5 border-none" />
      <QACreateForm />
    </>
  );
}
