//

import { LocationRadius } from "@1.ui/react/icons";
import { match } from "ts-pattern";

//

export function OnlineOrLocation(props: {
  is_online: boolean;
  location?: string | undefined;
}) {
  return (
    <span className="font-bold">
      <LocationRadius className="inline-block h-4 w-4" />{" "}
      {match(props.is_online)
        .with(true, () => "En ligne")
        .with(false, () => props.location)
        .exhaustive()}
    </span>
  );
}
