"use client";

import { ProfileAvatarMedia } from ":components/avatar";
import type { inferInfiniteQueryObserverSuccessResult } from ":components/inferQueryResult";
import { TRPC_React } from ":trpc/client";
import type { AvatarProfile } from "@1.modules/profile.domain";
import { Button } from "@1.ui/react/button";
import { button } from "@1.ui/react/button/atom";
import { Spinner } from "@1.ui/react/spinner";
import Link from "next/link";
import { P, match } from "ts-pattern";
import Loading_Placeholder from "../loading";

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
    .with({ status: "success" }, (success_info) => (
      <List query_info={success_info} />
    ))
    .exhaustive();
}

function List({
  query_info,
}: {
  query_info: QueryProfilesFollowingMeSuccessResult;
}) {
  const { data, isFetchingNextPage, hasNextPage, fetchNextPage } = query_info;
  const flatten_pages = data.pages
    .map((page) => page.data)
    .reverse()
    .flat();

  if (flatten_pages.length === 0) return <EmptyList />;

  return (
    <>
      <ul className="list-none space-y-6">
        {flatten_pages.map((item) => (
          <li key={item.id}>
            <Item {...item} />
          </li>
        ))}
        {match({ isFetchingNextPage, hasNextPage })
          .with({ isFetchingNextPage: true }, () => <Loading_Placeholder />)
          .with({ hasNextPage: true }, () => (
            <li className="col-span-full p-8">
              <LoadMore onClick={fetchNextPage} />
            </li>
          ))
          .otherwise(() => null)}
      </ul>
    </>
  );
}

function Item(profile: AvatarProfile) {
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

function EmptyList() {
  return (
    <section
      className="
        flex
        h-1/3
        min-h-80
        flex-col
        items-center
        justify-center
        gap-4
        p-8
        text-center
        font-bold
        opacity-50
      "
    >
      <p>Vous n’êtes pas ajouté par d’autres utilisateurs pour le moment </p>
    </section>
  );
}
function LoadMore({ onClick }: { onClick: () => void }) {
  return (
    <Button
      className="mx-auto my-6 block"
      state="ghost"
      intent="light"
      onPress={onClick}
    >
      Charger plus
    </Button>
  );
}
