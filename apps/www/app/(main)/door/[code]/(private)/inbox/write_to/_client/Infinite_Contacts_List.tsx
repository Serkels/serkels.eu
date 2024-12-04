"use client";

import { ProfileAvatarMedia } from ":components/avatar";
import { TRPC_React } from ":trpc/client";
import type { Profile } from "@1.modules/profile.domain";
import { EmptyList, Loading, flatten_pages_are_empty } from "@1.ui/react/async";
import { Button } from "@1.ui/react/button";
import { button_item } from "@1.ui/react/button/atom";
import Link from "next/link";
import { P, match } from "ts-pattern";

//

export default function Infinite_Contacts_List() {
  const info = TRPC_React.legacy_profile.me.contacts.useInfiniteQuery(
    {},
    { getNextPageParam: ({ next_cursor }) => next_cursor },
  );

  //

  return match(info)
    .with({ status: "error", error: P.select() }, (error) => {
      throw error;
    })
    .with({ status: "loading" }, () => <Loading />)
    .with({ status: "success", data: P.when(flatten_pages_are_empty) }, () => (
      <EmptyList>Aucun contact dans votre cercle</EmptyList>
    ))
    .with(
      { status: "success" },
      ({ data: { pages }, isFetchingNextPage, hasNextPage, fetchNextPage }) => (
        <ul className="h-full overflow-y-auto px-4 md:px-0">
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
          <li className="col-span-full p-4">
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
    <Link className={button_item()} href={`/@~/inbox/write_to/${profile.id}`}>
      <ProfileAvatarMedia profile={profile} />
    </Link>
  );
}
