//

import { InputSearch } from "@1/ui/components/InputSearch";

import { OpportunityCategories } from "@/app/opportunity/OpportunityRepository";
import { getServerSession } from "next-auth";
import { FaqForm } from "./FaqForm";
import { FaqList } from "./FaqList";
import { FaqRepository } from "./FaqRepository";
import { SeeAlso } from "./SeeAlso";

//

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession();
  const search = searchParams["q"];
  const category = searchParams["category"];
  const data = await FaqRepository.load({
    category: category as string,
    limit: 6,
    page: undefined,
    pageSize: undefined,
  });
  const isConncected = Boolean(session?.user?.email);

  return (
    <>
      <main className="col-span-6 mb-5 mt-10">
        <InputSearch defaultValue={search} />
        {isConncected ? (
          <>
            <hr className="my-5 border-none" />
            <FaqFormByCategories />
          </>
        ) : null}
        <hr className="my-10" />
        <FaqList initialData={data} />
      </main>
      <aside className="col-span-3 mt-10 lg:px-10">
        <SeeAlso />
      </aside>
    </>
  );
}

export async function FaqFormByCategories() {
  try {
    const categories = await OpportunityCategories.load();
    if (!categories) return <>No data O_o</>;

    return <FaqForm categories={categories} />;
  } catch (error) {
    console.error(error);
    return null;
  }
}
