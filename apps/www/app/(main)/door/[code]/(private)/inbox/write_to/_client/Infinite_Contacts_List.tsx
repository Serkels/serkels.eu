"use client";

import { TRPC_React } from ":trpc/client";
import type { Profile } from "@1.modules/profile.domain";
import { EmptyList, Loading, flatten_pages_are_empty } from "@1.ui/react/async";
import { AvatarMedia } from "@1.ui/react/avatar";
import { Button } from "@1.ui/react/button";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { P, match } from "ts-pattern";

//

export default function Infinite_Contacts_List() {
  const info = TRPC_React.profile.me.contacts.useInfiniteQuery({});

  //

  return match(info)
    .with({ status: "error", error: P.select() }, (error) => {
      throw error;
    })
    .with({ status: "loading" }, () => <Loading />)
    .with({ status: "success", data: P.when(flatten_pages_are_empty) }, () => (
      <EmptyList />
    ))
    .with(
      { status: "success" },
      ({ data: { pages }, isFetchingNextPage, hasNextPage, fetchNextPage }) => (
        <ul className="h-full  overflow-y-auto">
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
          <li className="col-span-full mx-auto">
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
  const router = useRouter();
  const talk_to = TRPC_React.inbox.talk_to.useMutation();
  const utils = TRPC_React.useUtils();
  const onPress = useCallback(async () => {
    const inbox = await talk_to.mutateAsync(profile.id);
    await utils.inbox.find.invalidate();
    router.push(`/@~/inbox/${inbox.thread_id}`);
  }, [profile.id]);
  return (
    <Button
      className="block h-full w-full rounded-none py-4"
      intent="light"
      onPress={onPress}
    >
      <AvatarMedia
        image={profile.image}
        id={profile.id}
        name={profile.name}
        className="items-center"
      ></AvatarMedia>
    </Button>
  );
}
