"use client";

import { useSyncSearchQuery } from ":components/hooks/useSyncSearchQuery";
import { context } from ":components/shell/AsideFilter.client";
import { useSession } from "@1.modules/auth.next/react";
import { Exchange_Filter } from "@1.modules/exchange.domain";
import { FilterRadioList } from "@1.ui/react/form/FilterRadioList";
import { usePathname, useRouter } from "next/navigation";
import { useContext } from "react";

//

export function Exchanges_Filter() {
  const { data: session } = useSession();
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const { query: category } = useSyncSearchQuery("category");
  const { query, setQuery } = useSyncSearchQuery("f");
  const { close } = useContext(context);

  if (!session) return null;

  const filters = [
    { name: "Mes cercles", slug: Exchange_Filter.Enum.MY_CIRCLES },
    { name: "Sans échange", slug: Exchange_Filter.Enum.WITHOUT_RETURN },
    { name: "Contre un échange", slug: Exchange_Filter.Enum.WITH_RETURN },
    { name: "En ligne", slug: Exchange_Filter.Enum.ONLINE },
    { name: "Sur place", slug: Exchange_Filter.Enum.ON_SITE },
    { name: "Date flexible", slug: Exchange_Filter.Enum.DATE_FLEXIBLE },
    { name: "Date limite ", slug: Exchange_Filter.Enum.DATE_LIMITED },
    { name: "Tout", slug: Exchange_Filter.Enum.ALL },
  ];

  //

  const onChange =
    pathname === "/exchanges"
      ? (filter: string) => setQuery(filter === "" ? undefined : filter)
      : (filter: string) => {
          router.push(
            `/exchanges?${new URLSearchParams({ f: filter, category: category ?? "" })}`,
          );
        };

  //

  return (
    <div className="md:block" hidden={close}>
      <FilterRadioList
        active={query ?? ""}
        data={filters}
        name="filter"
        onChange={onChange}
      />
    </div>
  );
}
