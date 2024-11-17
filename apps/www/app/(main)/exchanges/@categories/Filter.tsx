"use client";

import { useSyncSearchQuery } from ":components/hooks/useSyncSearchQuery";
import { useAutoClose } from ":components/shell/AsideFilter.client";
import { trpc_client } from "@1.infra/trpc/react-query/client";
import { CATEGORY_ALL } from "@1.modules/category.domain";
import { FilterRadioList } from "@1.ui/react/form/FilterRadioList";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";

//

export function Filter() {
  const { query, setQuery } = useSyncSearchQuery("category");
  const { query: filter } = useSyncSearchQuery("f");
  const { data: categories_, status } =
    trpc_client.category.exchange.useQuery();
  const { close } = useAutoClose();
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const categories = useMemo(() => {
    return [...(categories_ ?? []), CATEGORY_ALL];
  }, [status]);

  //

  const onChange =
    pathname === "/exchanges"
      ? (category: string) => setQuery(category === "" ? undefined : category)
      : (category: string) => {
          router.push(
            `/exchanges?${new URLSearchParams({ f: filter ?? "", category })}`,
          );
        };

  //

  return (
    <div className="md:block" hidden={close}>
      <FilterRadioList
        active={query ?? ""}
        data={categories}
        name="category"
        onChange={onChange}
      />
    </div>
  );
}
