//

import { InputSearch } from "@1/ui/components/InputSearch";

import { OpportunityCategories } from "@/app/opportunity/OpportunityRepository";
import { getServerSession } from "next-auth";
import { FaqForm } from "./FaqForm";
import { FaqList } from "./FaqList";
import { SeeAlso } from "./SeeAlso";

//

export default async function Page_() {
  const session = await getServerSession();
  const isConncected = Boolean(session?.user?.email);

  return (
    <>
      <main className="col-span-6 mb-5 mt-10">
        <InputSearch />
        {isConncected ? (
          <>
            <hr className="my-5 border-none" />
            <FaqFormByCategories />
          </>
        ) : null}
        <hr className="my-10" />
        <FaqList />
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
