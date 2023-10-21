"use client";

import { TRPC_React } from ":trpc/client";
import {
  Exchange_Filter,
  Exchange_TypeSchema,
} from "@1.modules/exchange.domain";
import {
  Exchange_AsyncCard,
  Exchange_InfiniteList,
} from "@1.modules/exchange.ui";
import { exchange_card } from "@1.modules/exchange.ui/Card";
import { AvatarMediaHorizontal } from "@1.ui/react/avatar";
import { ErrorOccur } from "@1.ui/react/error";
import { Button } from "@1/ui/components/ButtonV";
import { OnlineOrLocation } from "@1/ui/domains/exchange/OnlineOrLocation";
import { Bookmark, Exchange as ExchangeIcon, Share } from "@1/ui/icons";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { ComponentProps } from "react";
import { P, match } from "ts-pattern";

//

export default function List() {
  const search_params = useSearchParams();
  const category = search_params.get("category") ?? undefined;
  const search = search_params.get("q") ?? undefined;
  const filter_parsed_return = Exchange_Filter.safeParse(
    search_params.get("f"),
  );
  const filter = filter_parsed_return.success
    ? filter_parsed_return.data
    : undefined;

  try {
    const info = TRPC_React.exchange.find.useInfiniteQuery(
      {
        category,
        filter,
        search,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    ) as ComponentProps<typeof Exchange_InfiniteList>["info"];

    return (
      <Exchange_InfiniteList info={info}>
        {({ id }) => <Item key={id} id={id} />}
      </Exchange_InfiniteList>
    );
  } catch (error) {
    return <ErrorOccur error={error as Error} />;
  }
}

function Item({ id }: { id: string }) {
  const { base, body, header, category, exchange_icon } = exchange_card();
  try {
    const info = TRPC_React.exchange.by_id.useQuery(id);
    const data = info.data!;
    return (
      <Exchange_AsyncCard
        info={info as ComponentProps<typeof Exchange_AsyncCard>["info"]}
      >
        {({}) => (
          <div className={base()}>
            <div className={body()}>
              <header className={header()}>
                <AvatarMediaHorizontal
                  name={data.owner.profile.name}
                  image={data.owner.profile.image}
                  university={data.owner.university}
                />

                <div>
                  <figure className="flex flex-col items-center">
                    <div className="text-xl font-bold text-primary"> 1 / 2</div>
                    <figcaption>places disponible</figcaption>
                  </figure>
                </div>

                <div className="flex items-start space-x-2">
                  {/* <Exchange_EditButton /> */}
                  <time
                    className="mt-3 text-xs"
                    dateTime={data.updated_at.toUTCString()}
                    title={data.updated_at.toUTCString()}
                  >
                    {format(data.updated_at, "P", { locale: fr })}
                  </time>
                </div>
              </header>

              <hr className="my-2" />

              <div className="items-center justify-between text-xs text-[#707070] sm:flex">
                <div className="inline-flex">
                  <span
                    className={category({
                      className: "min-w-[100px] font-bold uppercase",
                      type: data.type,
                    })}
                  >
                    {match(data.type)
                      .with(
                        Exchange_TypeSchema.Enum.PROPOSAL,
                        () => "Proposition",
                      )
                      .with(
                        Exchange_TypeSchema.Enum.RESEARCH,
                        () => "Recherche",
                      )
                      .exhaustive()}
                  </span>
                  <OnlineOrLocation
                    is_online={data.is_online}
                    location={data.location ?? ""}
                  />
                </div>

                <div className=" flex items-center justify-between">
                  <span className="whitespace-nowrap font-bold uppercase">
                    {data.category.name}
                  </span>
                  <ExchangeIcon
                    className={exchange_icon({
                      is_in_exchange_of: true,
                    })}
                  />
                  <span className="whitespace-nowrap font-bold">
                    {match(data.return)
                      .with(null, () => "Sans échange")
                      .with(P._, (category) => category.name)
                      .exhaustive()}
                  </span>
                </div>
              </div>

              <hr className="my-2" />

              <article>
                <h3 className="my-5 text-2xl font-bold">{data.title}</h3>
                <p>{data.description}</p>
              </article>
            </div>
            <Footer owner={data.owner.profile} />
          </div>
        )}
      </Exchange_AsyncCard>
    );
  } catch (error) {
    return <ErrorOccur error={error as Error} />;
  }
}

function Footer({ owner }: { owner: any }) {
  const { data: session } = useSession({ required: false });
  const my_profile_id = session?.profile?.id!;
  return (
    <footer className={"mt-4 bg-Eminence px-5 py-3 text-white"}>
      <div className="flex justify-between">
        <div className="flex items-center">
          <Bookmark className="h-5 w-5" />
          {/* <BookmarkButton
            id={Number(exchange.id.value())}
            type="exchange"
            className={({ isActive }) =>
              `inline-block h-4 w-4 ${
                isActive ? "text-Chateau_Green" : "text-white"
              }`
            }
          /> */}
        </div>
        {match(owner.id)
          .with(my_profile_id, () => (
            <Link
              href={`/@${my_profile_id}/my/exchanges/${"exchange.id.value()"}`}
            >
              <Button>Voir mes échanges</Button>
            </Link>
          ))
          .otherwise(() => (
            <Ask_Action />
          ))}
        <button className="block">
          <Share className="h-5 w-5" />
        </button>
      </div>
    </footer>
  );
}

function Ask_Action() {
  return null;
}
