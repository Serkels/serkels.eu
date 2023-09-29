"use client";

//

import { NotFoundError } from "@1/core/error";
import { useInject } from "@1/core/ui/di.context.client";
import { School } from "@1/ui/icons";
import { useMemo } from "react";
import { Avatar } from "~/components/Avatar";
import { Get_Profile_UseCase } from "~/modules/user/application/get_profile.use-case";
import { useDoor_Value } from "../../door.context";

//

export function useDoorProfile() {
  const [{ door_id }] = useDoor_Value();

  const { data: profile } = useInject(Get_Profile_UseCase).execute(door_id);

  if (!profile) {
    throw new NotFoundError(`Profile @${door_id} not found`);
  }

  return useMemo(() => {
    return profile;
  }, [profile.id]);
}

export function Profile_Header() {
  const profile = useDoorProfile();

  return (
    <figure className="my-5 flex flex-row space-x-5">
      <Avatar className="h-16 w-16" u={profile.id.value()} />
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
