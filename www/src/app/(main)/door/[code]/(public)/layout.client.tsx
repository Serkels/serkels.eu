"use client";

//

import { Profile } from "@1/modules/profile/domain";
import { Profile_RecordSchema } from "@1/modules/profile/infra/strapi";
import { School } from "@1/ui/icons";
import { useQueryClient } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { useMemo } from "react";
import { Avatar } from "~/components/Avatar";
import { User_Repository } from "~/modules/user/User_Repository";
import { useDoor_Value } from "../../door.context";

//

export function useProfile() {
  const [{ door_id }] = useDoor_Value();
  const query_client = useQueryClient();
  const profile = query_client.getQueryData<Profile>(
    User_Repository.keys.by_id(door_id),
  );

  if (!profile) {
    return notFound();
  }

  return useMemo(() => {
    return Profile_RecordSchema.parse(profile, {
      path: [
        ...JSON.stringify({ data: profile }, null, 2)
          .replaceAll('"', '"')
          .split("\n"),
        "=",
        `useProfile(}`,
        `useMemo${[profile?.id]}`,
        "Profile_RecordSchema.parse",
        "//",
        "{ data: profile }",
      ],
    });
  }, [profile?.id]);
}

export function Profile_Header() {
  const profile = useProfile();

  return (
    <figure className="my-5 flex flex-row space-x-5">
      <Avatar className="h-16 w-16" u={profile.get("id")} />
      <figcaption className="flex flex-col items-start justify-center space-y-2">
        <h4 className="text-xl font-bold text-Cerulean" title={profile.name}>
          {profile.name}
        </h4>
        <small className="flex flex-row items-center justify-start space-x-1 text-sm text-Dove_Gray">
          <School className="inline-block w-6" />
          <span>{profile.university}</span>
        </small>
      </figcaption>
    </figure>
  );
}
