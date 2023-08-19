"use client";
import { isEqual as date_isEqual, formatDistance } from "date-fns";
import { fr } from "date-fns/locale";

export function TimeInfo({
  values: { createdAt, updatedAt },
}: {
  values: { createdAt?: string | undefined; updatedAt?: string | undefined };
}) {
  const created_at = createdAt ? new Date(createdAt) : new Date(NaN);

  const updated_at = updatedAt ? new Date(updatedAt) : new Date(NaN);

  const has_been_edited = !date_isEqual(created_at, updated_at);

  const time_distance = formatDistance(created_at, new Date(), {
    locale: fr,
  });

  //
  if (has_been_edited) {
    return (
      <div className="mt-3 text-xs">
        <time
          dateTime={updated_at.toUTCString()}
          title={updated_at.toUTCString()}
        >
          {time_distance}
        </time>
        {" • "}
        <time
          dateTime={created_at.toUTCString()}
          title={created_at.toUTCString()}
        >
          editée
        </time>
      </div>
    );
  }

  return (
    <time
      className="mt-3 text-xs"
      dateTime={created_at.toUTCString()}
      title={created_at.toUTCString()}
    >
      {time_distance}
    </time>
  );
}
