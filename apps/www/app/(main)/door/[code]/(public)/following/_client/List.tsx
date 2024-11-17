"use client";

import { ProfileAvatarMedia } from ":components/avatar";
import type { inferInfiniteQueryObserverSuccessResult } from ":components/inferQueryResult";
import { Loading_Placeholder } from ":components/placeholder/Loading_Placeholder";
import { TRPC_React } from ":trpc/client";
import type { AvatarProfile } from "@1.modules/profile.domain";
import { EmptyList, LoadMoreButton } from "@1.ui/react/async";
import { button_item } from "@1.ui/react/button/atom";
import { Spinner } from "@1.ui/react/spinner";
import Link from "next/link";
import { P, match } from "ts-pattern";

//

function useQueryProfilesFollowingMe() {
  return TRPC_React.profile.me.added_by.find.useInfiniteQuery(
    {},
    { getNextPageParam: ({ next_cursor }) => next_cursor },
  );
}
type QueryProfilesFollowingMe = ReturnType<typeof useQueryProfilesFollowingMe>;

type QueryProfilesFollowingMeSuccessResult =
  inferInfiniteQueryObserverSuccessResult<QueryProfilesFollowingMe>;

//

export default function AsyncInfiniteList() {
  const query_info = useQueryProfilesFollowingMe();

  return match(query_info)
    .with({ status: "error", error: P.select() }, (error) => {
      throw error;
    })
    .with({ status: "loading" }, () => (
      <div className="mx-auto flex justify-center">
        <Spinner />
      </div>
    ))
    .with({ status: "success" }, (success_info) => <List {...success_info} />)
    .exhaustive();
}

function List(query_info: QueryProfilesFollowingMeSuccessResult) {
  const { data, isFetchingNextPage, hasNextPage, fetchNextPage } = query_info;
  const flatten_pages = data.pages
    .map((page) => page.data)
    .reverse()
    .flat();

  if (flatten_pages.length === 0)
    return (
      <EmptyList>
        Vous n’êtes pas ajouté par d’autres utilisateurs pour le moment
      </EmptyList>
    );

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
          <li className="col-span-full p-8">
            <LoadMoreButton onPress={() => fetchNextPage()}>
              Charger plus
            </LoadMoreButton>
          </li>
        ))
        .otherwise(() => null)}
    </ul>
  );
}

function Item(profile: AvatarProfile) {
  return (
    <Link className={button_item()} href={`/@${profile.id}`}>
      <ProfileAvatarMedia profile={profile} />
    </Link>
  );
}
