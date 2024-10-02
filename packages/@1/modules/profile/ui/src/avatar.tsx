//

import type { Partner, Profile, Student } from "@1.modules/profile.domain";
import type { AvatarMediaProps, AvatarProps } from "@1.ui/react/avatar";
import {
  Avatar as UI_Avatar,
  AvatarMedia as UI_AvatarMedia,
} from "@1.ui/react/avatar";
import { LocationRadius, School } from "@1.ui/react/icons";

//

export function Avatar(
  props: AvatarProps & { profile: Pick<Profile, "image" | "id"> },
) {
  const { profile, ...other_props } = props;
  return <UI_Avatar image={profile.image} id={profile.id} {...other_props} />;
}

export function StudentAvatarMedia(
  props: AvatarMediaProps & {
    student: Pick<Student, "university"> & {
      profile: Pick<Profile, "image" | "name" | "id">;
    };
  },
) {
  const { student, ...other_props } = props;
  const { profile, university } = student;
  return (
    <UI_AvatarMedia
      image={profile.image}
      id={profile.id}
      name={profile.name}
      {...other_props}
    >
      <UI_AvatarMedia.SubTitle>
        <School className="mr-1.5 inline-block w-4" />
        <span className="align-bottom">{university}</span>
      </UI_AvatarMedia.SubTitle>
    </UI_AvatarMedia>
  );
}

export function PartnerAvatarMedia(
  props: AvatarMediaProps & { partner: Partner },
) {
  const { partner, ...other_props } = props;
  const { profile, city } = partner;
  return (
    <UI_AvatarMedia
      image={profile.image}
      id={profile.id}
      name={profile.name}
      {...other_props}
    >
      <UI_AvatarMedia.SubTitle>
        <LocationRadius className="mr-1.5 inline-block w-6" />
        <span>{city}</span>
      </UI_AvatarMedia.SubTitle>
    </UI_AvatarMedia>
  );
}
