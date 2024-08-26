"use client";

//

import { TRPC_React } from ":trpc/client";
import List from ":widgets/opportunities/list";
import { useSeeAlso } from "./context";

//

export default function Page_Client() {
  const { exclude_ids, query_see_also } = useSeeAlso();

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

      <List category={query_see_also.category} />
    </aside>
  );
}
