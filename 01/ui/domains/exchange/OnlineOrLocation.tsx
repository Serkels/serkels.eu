//

import { match } from "ts-pattern";

//

export function OnlineOrLocation(props: {
  is_online: boolean;
  location?: string | undefined;
}) {
  return (
    <span className="font-bold">
      📍
      {match(props.is_online)
        .with(true, () => "En ligne")
        .with(false, () => props.location)
        .exhaustive()}
    </span>
  );
}
