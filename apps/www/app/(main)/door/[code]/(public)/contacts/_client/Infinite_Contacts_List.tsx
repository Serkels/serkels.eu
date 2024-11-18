"use client";

import type { inferInfiniteQueryObserverSuccessResult } from ":components/inferQueryResult";
import { TRPC_React } from ":trpc/client";
import type { Profile } from "@1.modules/profile.domain";
import { EmptyList, LoadMoreButton, Loading } from "@1.ui/react/async";
import { AvatarMedia } from "@1.ui/react/avatar";
import { button_item } from "@1.ui/react/button/atom";
import Link from "next/link";
import { P, match } from "ts-pattern";
import Loading_Placeholder from "../loading";

//

function useQueryContacts() {
  return TRPC_React.legacy_profile.me.contacts.useInfiniteQuery(
    {},
    { getNextPageParam: ({ next_cursor }) => next_cursor },
  );
}
type QueryContacts = ReturnType<typeof useQueryContacts>;
type QueryContactsSuccessResult =
  inferInfiniteQueryObserverSuccessResult<QueryContacts>;

//

export default function AsyncInfiniteList() {
  const query_info = useQueryContacts();

  return match(query_info)
    .with({ status: "error", error: P.select() }, (error) => {
      throw error;
    })
    .with({ status: "loading" }, () => (
      <Loading className="mx-auto flex justify-center" />
    ))
    .with({ status: "success" }, (success_info) => <List {...success_info} />)
    .exhaustive();
}

function List(query_info: QueryContactsSuccessResult) {
  const { data, isFetchingNextPage, hasNextPage, fetchNextPage } = query_info;
  const flatten_pages = data.pages
    .map((page) => page.data)
    .reverse()
    .flat();

  if (flatten_pages.length === 0)
    return <EmptyList>Aucun contact dans votre cercle</EmptyList>;

  return (
    <ul className="list-none">
      {flatten_pages.map((item) => (
        <li key={item.id}>
          <Item {...item} />
        </li>
      ))}
      {match({ isFetchingNextPage, hasNextPage })
        .with({ isFetchingNextPage: true }, () => <Loading_Placeholder />)
        .with({ hasNextPage: true }, () => (
          <li className="col-span-full p-8 text-center">
            <LoadMoreButton onPress={() => fetchNextPage()}>
              Charger plus
            </LoadMoreButton>
          </li>
        ))
        .otherwise(() => null)}
    </ul>
  );
}

function Item(profile: Profile) {
  return (
    <Link
      className={button_item({ className: "h-auto" })}
      href={`/@${profile.id}`}
    >
      <AvatarMedia
        image={profile.image}
        id={profile.id}
        name={profile.name}
        className="items-center"
      ></AvatarMedia>
    </Link>
  );
}
