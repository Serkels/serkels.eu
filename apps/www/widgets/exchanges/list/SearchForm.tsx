"use client";

import { DEBOUNCE_DELAY, MAX_WAIT } from ":app/constants";
import { useSyncSearchQuery } from ":components/hooks/useSyncSearchQuery";
import { context } from ":components/shell/AsideFilter.client";
import InputSearch, {
  InputSearch_RightBtn,
} from "@1.ui/react/input/InputSearch";
import { useDebouncedCallback } from "@react-hookz/web";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useContext, type ComponentProps } from "react";
import { match } from "ts-pattern";

//

export default function SearchForm() {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const { query, setQuery } = useSyncSearchQuery("q");
  const { toggle } = useContext(context);
  const onChange = useDebouncedCallback<
    NonNullable<ComponentProps<"input">["onChange"]>
  >(
    (ev) =>
      match(pathname)
        .with("/exchanges", () => setQuery(ev.target.value))
        .otherwise(() =>
          router.push(
            `/exchanges?${new URLSearchParams({ q: ev.target.value })}`,
          ),
        ),
    [setQuery],
    DEBOUNCE_DELAY,
    MAX_WAIT,
  );

  return (
    <InputSearch onChange={onChange} defaultValue={query}>
      <InputSearch_RightBtn>
        <button className="pr-2 md:hidden" onClick={toggle}>
          <Image
            src="/filter.svg"
            alt="filter"
            width={20}
            height={20}
            priority
          />
        </button>
      </InputSearch_RightBtn>
    </InputSearch>
  );
}
