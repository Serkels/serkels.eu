"use client";

import type { Exchange } from "@1/modules/exchange/domain";
import { Button } from "@1/ui/components/ButtonV";
import { InputSearch } from "@1/ui/components/InputSearch";
import { Spinner } from "@1/ui/components/Spinner";
import { OnlineOrLocation } from "@1/ui/domains/exchange/OnlineOrLocation";
import { Circle } from "@1/ui/icons";
import { Exchange as ExchangeIcon } from "@1/ui/icons/Exchange";
import type { VariantProps } from "@1/ui/theme";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState, type ChangeEvent } from "react";
import { useDebounce } from "react-use";
import tw from "tailwind-styled-components";
import { tv } from "tailwind-variants";
import { P, match } from "ts-pattern";
import { useDoor_Value } from "~/app/(main)/door/door.context";
import { Avatar } from "~/components/Avatar";
import { useInject } from "~/core/react";
import { Get_User_Exchanges_UseCase } from "~/modules/exchange/application/get_user_exchanges.use-case";
import { Exchange_ValueProvider, useExchange_Value } from "./Exchange.context";

//

export function EchangeNav() {
  const info = useInject(Get_User_Exchanges_UseCase).execute({
    sort: ["updatedAt:desc"],
    pagination: { pageSize: 4 },
  });

  const [search_value, set_search_value] = useState("");
  const [filter_name, set_filter_name] = useState("");

  useDebounce(
    () => {
      set_filter_name(search_value);
    },
    444,
    [search_value],
  );

  const filter_list = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    set_search_value(value);
  }, []);

  const router = useRouter();
  const [{ door_id }] = useDoor_Value();

  const count = info.data?.pages.flat().length;
  useEffect(() => {
    if (count !== 1) {
      return;
    }
    const exchange = info.data?.pages?.at(0)!;
    router.push(`/@${door_id}/my/exchanges/${exchange.id}`);
  }, [count]);

  //

  return (
    <>
      <form className="mb-10 px-8" action="#">
        <InputSearch
          value={search_value}
          onChange={filter_list}
          disabled={true}
        />
      </form>
      {match(info)
        .with({ status: "error" }, ({ error }) => {
          throw error;
        })
        .with({ status: "loading" }, () => <Loading />)
        .with(
          {
            status: "success",
            data: P.when((list) => list.pages.length === 0),
          },
          () => <EmptyList />,
        )
        .with(
          { status: "success" },
          ({
            data: { pages },
            isFetchingNextPage,
            hasNextPage,
            fetchNextPage,
          }) => (
            <nav className="flex-1 overflow-y-auto">
              <Exchange_List
                exchanges={pages.filter(
                  (exchange) => exchange.get("title")?.includes(filter_name),
                )}
              />

              {isFetchingNextPage ? <Loading /> : null}
              {hasNextPage ? (
                <Button
                  onPress={() => fetchNextPage()}
                  isDisabled={!hasNextPage || isFetchingNextPage}
                >
                  Charger plus
                </Button>
              ) : null}
            </nav>
          ),
        )
        .exhaustive()}
    </>
  );
}

function Exchange_List({ exchanges }: { exchanges: Exchange[] | undefined }) {
  return match(exchanges)
    .with(undefined, () => null)
    .when(
      (list) => list.length === 0,
      () => <EmptyList />,
    )
    .otherwise((list) => (
      <ul className={ul_list()}>
        {list.map((exchange) => (
          <li key={exchange.id.value()}>
            <Exchange_ValueProvider initialValue={exchange}>
              <Echange_MessagingLink />
            </Exchange_ValueProvider>
          </li>
        ))}
      </ul>
    ));
}

const ul_list = tv({
  base: "overflow-y-auto pb-8",
});

function Echange_MessagingLink() {
  const [exchange] = useExchange_Value();
  const pathname = usePathname();
  const { data: session } = useSession();

  const [{ door_id }] = useDoor_Value();
  const href = `/@${door_id}/my/exchanges/${exchange.get("id")}`;

  const active =
    pathname.split("/").length >= href.split("/").length &&
    pathname.includes(href);

  return (
    <Link
      href={href}
      className={clsx(
        `
          block
          overflow-hidden
          border-l-4
          border-transparent
          p-4
        `,
        { "border-l-primary bg-white": active },
      )}
    >
      <header className="relative">
        <div className="float-right hidden">
          <Circle className={clsx("h-4 w-4 text-[#FF5F5F]")} />
        </div>
        <h4
          className="mb-3 line-clamp-1 text-lg font-bold"
          title={exchange.title}
        >
          {exchange.title}
        </h4>
      </header>
      <section className="flex items-center justify-between text-[#707070]">
        <OnlineOrLocation
          is_online={exchange.is_online}
          location={exchange.location}
        />
        <div>
          <DisponibilityBadge $primary>
            {exchange.get("available_places")} / {exchange.get("places")}
          </DisponibilityBadge>{" "}
          <span className="text-sm font-bold ">dispo</span>
        </div>
      </section>
      <section className="flex items-center justify-between text-[#707070]">
        <span className="font-bold">
          {match(exchange.type)
            .with("proposal", () => "Proposition")
            .with("research", () => "Recherche")
            .exhaustive()}
        </span>
        <div className=" flex items-center justify-between text-xs">
          <span className="whitespace-nowrap">{exchange.category.name}</span>
          <ExchangeIcon
            className={clsx("mx-1 w-5", {
              "text-Chateau_Green": !Boolean(exchange.in_exchange_of),
              "text-Gamboge": Boolean(exchange.in_exchange_of),
            })}
          />
          <span className="whitespace-nowrap">
            {match(exchange.in_exchange_of)
              .with(undefined, () => "Sans échange")
              .with(P._, (category) => category.name)
              .exhaustive()}
          </span>
        </div>
      </section>
      <div className="flex items-center justify-between text-xs">
        <div>
          <Avatar
            u={exchange.profile.get("id")}
            className="inline-block h-5 w-5"
          />
          {match(exchange.profile.get("id"))
            .with(Number(session?.user?.profile.id), () => "Vous")
            .otherwise(() => exchange.profile.name)}
        </div>
        <time
          className="mt-3 text-xs"
          dateTime={exchange.updatedAt.toUTCString()}
          title={exchange.updatedAt.toUTCString()}
        >
          {exchange.updatedAt.toLocaleDateString("fr")}
        </time>
      </div>
    </Link>
  );
}

//

const DisponibilityBadge = tw.span<VariantProps>`
  inline-block
  rounded-full
  px-2
  text-xs
  text-white
  ${(p) => clsx({ "bg-primary": p.$primary })}
`;

function EmptyList() {
  return (
    <h5 className="py-5 text-center font-bold">Pas plus de résultats ...</h5>
  );
}

function Loading() {
  return (
    <div className="mt-28 text-center">
      <Spinner />
    </div>
  );
}
