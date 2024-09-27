"use client";

//

import List from ":widgets/opportunities/list";
import { useSeeAlso } from "./context";

//

export default function Page_Client() {
  const { exclude_ids, query_see_also } = useSeeAlso();

  return (
    <aside>
      <h2 className="my-8 text-center text-lg font-bold text-Congress_Blue">
        Voir aussi
      </h2>

      <List category={query_see_also.category} exclude_ids={exclude_ids} />
    </aside>
  );
}
