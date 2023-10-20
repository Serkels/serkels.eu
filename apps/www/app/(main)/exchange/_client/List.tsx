"use client";

import { TRPC_React } from ":trpc/client";
import {
  Exchange_AsyncCard,
  Exchange_InfiniteList,
} from "@1.modules/exchange.ui";
import { AvatarMediaHorizontal } from "@1.ui/react/avatar";
import { card } from "@1.ui/react/card/atom";
import { ErrorOccur } from "@1.ui/react/error";
import { useSearchParams } from "next/navigation";
import type { ComponentProps } from "react";

//

export default function List() {
  const search_params = useSearchParams();
  const category = search_params.get("category") ?? undefined;
  const search = search_params.get("q") ?? undefined;

  try {
    const info = TRPC_React.exchange.find.useInfiniteQuery(
      {
        category,
        search: search,
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
  const { base, body, header } = card();
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
                  // u={data.id}
                  // university={exchange.profile.university}
                  // username={exchange.profile.name}
                />
                <div className="flex items-start space-x-2">
                  {/* <Exchange_EditButton /> */}
                  <time
                    className="mt-3 text-xs"
                    // dateTime={exchange.get("updatedAt").toUTCString()}
                    // title={exchange.get("updatedAt").toUTCString()}
                  >
                    {/* {exchange.get("updatedAt").toLocaleDateString("fr")} */}
                  </time>
                </div>
              </header>
            </div>
          </div>
          // header={<header className={header()}>header</header>}
          // body={
          //   <div>
          //     <div className="inline-flex"></div>
          //     <code>{JSON.stringify(exchange, null, 2)}</code>;
          //     <hr className="my-2" />
          //     <div className="items-center justify-between text-xs text-[#707070] sm:flex"></div>
          //   </div>
          // }
          // footer={<>footer</>}
          // />
        )}
      </Exchange_AsyncCard>
    );
  } catch (error) {
    return <ErrorOccur error={error as Error} />;
  }
}
