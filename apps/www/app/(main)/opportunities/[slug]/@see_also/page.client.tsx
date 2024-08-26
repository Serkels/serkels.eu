"use client";

//

import { TRPC_React } from ":trpc/client";
import { Card } from ":widgets/opportunities/card";
import { ErrorOccur } from "@1.ui/react/error";
import { useSeeAlso } from "./context";

//

export default function Page_Client() {
  const { exclude_ids, query_see_also } = useSeeAlso();
  try {
    const { data: opportunities } = TRPC_React.opportunity.find.public.useQuery(
      query_see_also,
      {
        select({ data }) {
          return data.filter(({ id }) => !exclude_ids.includes(id)).slice(0, 2);
        },
      },
    );

    if (!opportunities) return null;
    if (!opportunities.length) return null;

    return (
      <aside>
        <h2 className="my-8 text-center text-lg font-bold text-Congress_Blue">
          Voir aussi
        </h2>

        <div className="grid grid-cols-1 gap-8">
          {opportunities.map((data) => (
            <Card key={data.id} opportunity={data} />
          ))}
        </div>
      </aside>
    );
  } catch (error) {
    return <ErrorOccur error={error as Error} />;
  }
}
