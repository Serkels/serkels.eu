//

import { format_ago } from "@1.modules/core/date";
import type { Entity_Timestamps } from "@1.modules/core/domain";
import { isEqual as date_isEqual } from "date-fns";
import { type ComponentProps, type PropsWithChildren } from "react";

//

export function Time({
  children,
  timestamp,
  ...time_props
}: PropsWithChildren<{ timestamp: Date } & ComponentProps<"time">>) {
  return (
    <time
      dateTime={timestamp.toUTCString()}
      title={timestamp.toUTCString()}
      {...time_props}
    >
      {children}
    </time>
  );
}

export function TimeInfo({ timestamps }: { timestamps: Entity_Timestamps }) {
  const { created_at, updated_at } = timestamps;
  const has_been_edited = !date_isEqual(created_at, updated_at);

  const time_distance = format_ago(created_at);

  //

  if (has_been_edited) {
    return (
      <div className="text-xs">
        <Time timestamp={updated_at}>{time_distance}</Time>
        {" • "}
        <Time timestamp={created_at}>editée</Time>
      </div>
    );
  }

  return (
    <Time className="text-xs" timestamp={created_at}>
      {time_distance}
    </Time>
  );
}
