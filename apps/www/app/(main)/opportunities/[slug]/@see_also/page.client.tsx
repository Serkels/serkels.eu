"use client";
//

import { Item } from ":app/(main)/opportunities/_client/List";
import { TRPC_React } from ":trpc/client";
import { ErrorOccur } from "@1.ui/react/error";

//

export default function Page_Client({ category }: { category: string }) {
  try {
    const { data } = TRPC_React.opportunity.find.useQuery({
      limit: 2,
      category,
    });

    if (!data) return null;
    const { data: opportunities } = data;

    console.log({ opportunities });
    return (
      <aside>
        <h2 className="my-8 text-center  text-lg font-bold text-Congress_Blue">
          Voir aussi
        </h2>

        <div className="grid grid-cols-1 gap-8">
          {opportunities.map((data) => (
            <Item opportunity={data} />
          ))}
        </div>
      </aside>
    );
  } catch (error) {
    return <ErrorOccur error={error as Error} />;
  }
}
