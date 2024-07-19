"use client";

import { useSyncSearchQuery } from ":components/hooks/useSyncSearchQuery";
import { context } from ":components/shell/AsideFilter.client";
import { Exchange_Filter } from "@1.modules/exchange.domain";
import { FilterRadioList } from "@1.ui/react/form/FilterRadioList";
import { useSession } from "next-auth/react";
import { useContext } from "react";

//

export function Exchanges_Filter() {
  const { data: session } = useSession();
  if (!session) return null;

  const { query, setQuery } = useSyncSearchQuery("f");
  const { close } = useContext(context);

  const filters = [
    { name: "Sans échange", slug: Exchange_Filter.Enum.WITHOUT_RETURN },
    { name: "Contre un échange", slug: Exchange_Filter.Enum.WITH_RETURN },
    { name: "En ligne", slug: Exchange_Filter.Enum.ONLINE },
    { name: "Sur place", slug: Exchange_Filter.Enum.ON_SITE },
    { name: "Mes abonnements", slug: Exchange_Filter.Enum.MY_FOLLOWS },
    { name: "Date flexible", slug: Exchange_Filter.Enum.DATE_FLEXIBLE },
    { name: "Date limite ", slug: Exchange_Filter.Enum.DATE_LIMITED },
    { name: "Tout", slug: Exchange_Filter.Enum.ALL },
  ];

  return (
    <div className="md:block" hidden={close}>
      <FilterRadioList
        active={query ?? ""}
        data={filters}
        name="filter"
        onChange={setQuery}
      />
    </div>
  );
}
