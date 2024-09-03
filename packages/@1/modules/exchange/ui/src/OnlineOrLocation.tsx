//

import { LocationRadius } from "@1.ui/react/icons";
import { match } from "ts-pattern";
//

export function OnlineOrLocation(props: {
  is_online: boolean;
  location?: string | undefined;
}) {
  return (
    <a
      className="cursor-pointer font-bold text-[color:#707070]"
      href={match(props.is_online)
        .with(true, () => `/exchanges?f=ONLINE`)
        .with(false, () => `/exchanges?q=${props.location}`)
        .exhaustive()}
    >
      <LocationRadius className="inline-block h-4 w-4 text-primary" />{" "}
      {match(props.is_online)
        .with(true, () => "En ligne")
        .with(false, () => props.location)
        .exhaustive()}
    </a>
  );
}
