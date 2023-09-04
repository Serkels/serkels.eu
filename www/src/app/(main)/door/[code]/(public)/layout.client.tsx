"use client";

//

import {
  Profile_DataRecord,
  data_to_domain,
} from "@1/modules/profile/infra/strapi";
import { School } from "@1/ui/icons";
import { useMemo } from "react";
import { Avatar } from "~/components/Avatar";
import { useDoor_Value } from "../../door.context";

//

export function useProfile() {
  const [{ door_id, owner }] = useDoor_Value();
  return useMemo(() => {
    return Profile_DataRecord.transform(data_to_domain).parse(owner, {
      path: ["Profile_DataRecord"],
    });
  }, [door_id]);
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
