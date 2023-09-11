"use client";

import { UnknownError } from "@1/core/error";
import type { Profile } from "@1/modules/profile/domain";
import {
  Profile_DataRecord,
  profile_to_domain,
} from "@1/modules/profile/infra/strapi";
import { Button } from "@1/ui/components/ButtonV";
import { Spinner } from "@1/ui/components/Spinner";
import { useDialogContext } from "@1/ui/domains/exchange/AskModal";
import { useQueryClient } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, type PropsWithChildren } from "react";
import { P, match } from "ts-pattern";
import { AvatarMedia } from "~/components/Avatar";
import { useInbox_controller } from "~/modules/inbox";
import { Inbox_QueryKeys } from "~/modules/inbox/query_keys";
import { useUserData } from "~/modules/user";
import { useDoor_Value } from "../../../door.context";

//

const UI = {
  Modal: dynamic(() =>
    import("@1/ui/domains/exchange/AskModal").then((m) => m.Modal),
  ),
  DialogTrigger: dynamic(() =>
    import("@1/ui/domains/exchange/AskModal").then((m) => m.DialogTrigger),
  ),
  Dialog: dynamic(() =>
    import("@1/ui/domains/exchange/AskModal").then((m) => m.Dialog),
  ),
  useDialogContext: useDialogContext,
};

export function My_Inbox_Write_To_Button() {
  return (
    <UI.DialogTrigger>
      <Button intent="danger">Écrire</Button>
      <UI.Modal>
        <UI.Dialog>
          <Write_Body />
        </UI.Dialog>
      </UI.Modal>
    </UI.DialogTrigger>
  );
}

//

function Write_Body() {
  return (
    <>
      <h3 className="line-clamp-2 border-b-2 py-5 text-2xl font-bold">
        Écrire à :
      </h3>

      <Contact_List />
    </>
  );
}

function Contact_List() {
  const {
    contacts: { useInfiniteQuery },
  } = useUserData();
  const info = useInfiniteQuery({ pageSize: 1 });

  return match(info)
    .with({ status: "error" }, () => {
      return <Loading />;
    })
    .with({ status: "loading" }, () => {
      return <Loading />;
    })
    .with(
      { status: "success" },
      ({
        data: infinite_list,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
      }) => {
        return (
          <>
            <nav className="flex-1 overflow-y-auto py-5">
              {infinite_list.pages
                .map((page) => page.data)
                .flat()
                .filter((data) => !Number.isNaN(Number(data?.id)))
                .map((data) => {
                  try {
                    const profile = Profile_DataRecord.transform(
                      profile_to_domain,
                    ).parse({ data });

                    return (
                      <Contact_Action key={profile.get("id")} profile={profile}>
                        <Contact_Item profile={profile} />
                      </Contact_Action>
                    );
                  } catch (error) {
                    return null;
                  }
                })}
            </nav>

            {isFetchingNextPage ? <Loading /> : null}
            {hasNextPage ? (
              <Button
                onPress={() => fetchNextPage()}
                isDisabled={!hasNextPage || isFetchingNextPage}
              >
                Charger plus
              </Button>
            ) : null}
          </>
        );
      },
    )
    .exhaustive();
}

function Contact_Action({
  profile,
  children,
}: PropsWithChildren<{ profile: Profile }>) {
  const [{ door_id }] = useDoor_Value();
  const state = UI.useDialogContext();
  const query_client = useQueryClient();
  const {
    by_participent: { useQuery, useMutation },
  } = useInbox_controller();
  const find_query = useQuery(profile.get("id"));
  const create = useMutation(profile.get("id"));
  const create_inbox = useCallback(async () => {
    await create.mutate();

    query_client.invalidateQueries(Inbox_QueryKeys.lists());
    query_client.invalidateQueries(
      Inbox_QueryKeys.by_participent(profile.get("id")),
    );
  }, [query_client]);

  if (!create.isIdle) {
    return match(create)
      .with({ status: "error", error: P.select() }, (error) => {
        throw new UnknownError("Inbox creation fail", { cause: error });
      })
      .with({ status: "loading" }, () => <Spinner />)
      .with({ status: "success", data: P.select() }, (data) => (
        <Link href={`/@${door_id}/inbox/${data?.id}`} onClick={state.onClose}>
          {children}
        </Link>
      ))
      .otherwise(() => <Spinner />);
  }
  return match(find_query)
    .with({ status: "error" }, () => (
      <button className="w-full" onClick={create_inbox}>
        {children}
      </button>
    ))
    .with({ status: "loading" }, () => (
      <div className="opacity-25">{children}</div>
    ))
    .with({ status: "success", data: P.select() }, (data) => (
      <Link href={`/@${door_id}/inbox/${data?.id}`} onClick={state.onClose}>
        {children}
        <div className="float-right">{">"}</div>
      </Link>
    ))
    .exhaustive();
}

function Contact_Item({ profile }: { profile: Profile }) {
  return (
    <AvatarMedia
      u={profile.get("id")}
      username={profile.name}
      $linked={false}
      university={profile.university}
      className="w-full"
    />
  );
}

function Loading() {
  return (
    <div className="flex flex-1 flex-col justify-center">
      <div className="mx-auto mt-5 text-center">
        <Spinner />
      </div>
    </div>
  );
}
