//

import { AuthError } from "@1/core/error";
import { Hydrate, dehydrate } from "@tanstack/react-query";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import type { PropsWithChildren } from "react";
import { fromServer } from "~/app/api/v1";
import { getQueryClient } from "~/core/getQueryClient";
import { User_Repository_Legacy } from "~/modules/user/User_Repository";
import { Door_ValueProvider } from "../door.context";
import { this_door_is_yours } from "./this_door_is_yours";

//

export async function generateMetadata(
  { params }: { params: { code: string } },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `@${params.code} :: ${(await parent).title?.absolute}`,
  };
}

export default async function Layout({
  children,
  params,
}: PropsWithChildren<{ params: { code: string } }>) {
  try {
    const { code } = params;
    const profile_id = Number(code);
    const is_your_door = await this_door_is_yours(code);

    const profile_record = await User_Repository_Legacy.by_id(
      profile_id,
      fromServer,
    );

    if (!profile_record) {
      throw new AuthError(`Profile < ${code} > not found`);
    }

    const queryClient = getQueryClient();
    await queryClient.prefetchQuery({
      queryKey: User_Repository_Legacy.keys.by_id(profile_id),
      queryFn: () => profile_record,
    });
    const dehydratedState = dehydrate(queryClient);

    return (
      <Door_ValueProvider
        initialValue={{ door_id: profile_id, is_yours: is_your_door }}
      >
        <Hydrate state={dehydratedState}>{children}</Hydrate>
      </Door_ValueProvider>
    );
  } catch {
    return notFound();
  }
}
