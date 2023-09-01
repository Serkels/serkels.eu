"use client";

//

import { Profile } from "@1/modules/profile/domain";
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
    try {
      return Profile_DataRecord.transform(data_to_domain).parse(owner, {
        path: ["Profile_DataRecord"],
      });
    } catch (error) {
      return Profile.create({
        about: "",
        createdAt: new Date(0),
        firstname: "",
        id: NaN,
        lastname: "",
        university: "",
        updatedAt: new Date(0),
      }).value();
    }
  }, [door_id]);
}

export function Profile_Header() {
  const profile = useProfile();

  return (
    <figure>
      <Avatar className="h-14 w-14" u={profile.get("id")} />
      <figcaption>
        <h4 className="text-xl font-bold text-Cerulean" title={profile.name}>
          {profile.name}
        </h4>
        <small className="block text-sm text-Dove_Gray">
          <School className="mr-1.5 inline-block w-6" />
          <span>{profile.university}</span>
        </small>
      </figcaption>
    </figure>
  );
}
