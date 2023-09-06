"use client";

import type { Profile } from "@1/modules/profile/domain";
import {
  Profile_DataRecord,
  profile_to_domain,
} from "@1/modules/profile/infra/strapi";
import { Button } from "@1/ui/components/ButtonV";
import { Spinner } from "@1/ui/components/Spinner";
import * as UI from "@1/ui/domains/exchange/AskModal";
import Link from "next/link";
import { match } from "ts-pattern";
import { AvatarMedia } from "~/components/Avatar";
import { useUserData } from "~/modules/user";
import { useDoor_Value } from "../../../door.context";

//

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
            <nav className="flex-1 overflow-y-auto">
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
                      <Contact_Item key={profile.get("id")} profile={profile} />
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

function Contact_Item({ profile }: { profile: Profile }) {
  const [{ door_id }] = useDoor_Value();
  const state = UI.useDialogContext();
  return (
    <Link
      href={`/@${door_id}/inbox/${profile.get("id")}`}
      onClick={state.onClose}
    >
      <AvatarMedia
        u={profile.get("id")}
        username={profile.name}
        $linked={false}
      />
    </Link>
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
