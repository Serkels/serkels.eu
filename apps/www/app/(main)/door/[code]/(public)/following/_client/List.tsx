"use client";

import { ProfileAvatarMedia } from ":components/avatar";
import { TRPC_React } from ":trpc/client";
import type { Profile } from "@1.modules/profile.domain";
import { EmptyList, Loading, flatten_pages_are_empty } from "@1.ui/react/async";
import { Button } from "@1.ui/react/button";
import { button } from "@1.ui/react/button/atom";
import { Spinner } from "@1.ui/react/spinner";
import Link from "next/link";
import { P, match } from "ts-pattern";

//

export default function List() {
  const info = TRPC_React.profile.me.follows.useInfiniteQuery(
    {},
    { getNextPageParam: ({ next_cursor }) => next_cursor },
  );

  //

  return match(info)
    .with({ status: "error", error: P.select() }, (error) => {
      throw error;
    })
    .with({ status: "loading" }, () => (
      <div className="mx-auto flex justify-center">
        <Spinner />
      </div>
    ))
    .with({ status: "success", data: P.when(flatten_pages_are_empty) }, () => (
      <EmptyList />
    ))
    .with(
      { status: "success" },
      ({ data: { pages }, isFetchingNextPage, hasNextPage, fetchNextPage }) => (
        <ul className="h-full overflow-y-auto">
          {pages
            .map((page) => page.data)
            .flat()
            .map((item) => (
              <li key={item.id}>
                <Item {...item} />
              </li>
            ))}
          <li className="col-span-full mx-auto">
            {isFetchingNextPage ? <Loading /> : null}
          </li>
          <li className="col-span-full p-8">
            {hasNextPage ? (
              <Button
                onPress={() => fetchNextPage()}
                isDisabled={!hasNextPage || isFetchingNextPage}
              >
                Charger plus
              </Button>
            ) : null}
          </li>
        </ul>
      ),
    )
    .exhaustive();
}

function Item(profile: Profile) {
  return (
    <Link
      className={button({
        className: "block h-full w-full rounded-none px-8 py-4",
        intent: "light",
      })}
      href={`/@${profile.id}`}
    >
      <ProfileAvatarMedia profile={profile} />
    </Link>
  );
}
