"use client";

import { Category } from "@1/modules/category/domain";
import { useSession } from "next-auth/react";
import {
  CategoryFilterRadioList,
  FilterRadioList,
} from "~/components/FilterRadioList";
import { useSyncSearchQuery } from "~/components/useSyncSearchQuery";
import { useInject } from "~/core/react";
import { Get_Category_UseCase } from "~/modules/categories/application/get_categories.use-case";
import { QACreateForm } from "./QACreateForm";
import type { QAFilterType } from "./models/QAFilterType";

//

export function CategoriesList() {
  const { query, setQuery } = useSyncSearchQuery("category");
  const categories = useInject(Get_Category_UseCase).execute("question");
  categories.push(Category.all);

  return (
    <CategoryFilterRadioList
      data={categories}
      active={query ?? ""}
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
      active={query ?? ""}
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
