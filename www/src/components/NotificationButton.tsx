//

import { Profile, type Notification } from "@1/models";
import { DotIndicator } from "@1/ui/components/DotIndicator";
import * as UI from "@1/ui/domains/notification";
import { Bell } from "@1/ui/icons";
import { useQueryClient } from "@tanstack/react-query";
import type { Unsubscribable } from "@trpc/server/observable";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { match } from "ts-pattern";
import { trpc } from "./trpc";

//

export function NotificationButton() {
  const notifications = useNotification();

  return (
    <UI.DropdownButton
      label="Notifications"
      slot-OverlayButton={
        <div className="relative">
          <Bell className="h-4 w-4 text-white" aria-hidden="true" />

          {notifications.length > 0 ? <DotIndicator /> : null}
        </div>
      }
    >
      <div className="flex flex-col">
        {match(notifications)
          .with([], () => (
            <UI.EmptyNotification>
              <Bell className="h-8 w-8 text-gray-500" aria-hidden="true" />
              <br />
              Vous n'avez aucune notification
            </UI.EmptyNotification>
          ))
          .otherwise(() =>
            notifications.map((notification) => {
              const profile_props = notification.profile;
              const { data: profile } = new Profile(
                String(profile_props.id),
                profile_props,
              );

              return (
                <UI.Notification
                  key={notification.answer.id}
                  avatar={`/api/v1/avatars/u/${profile.id}`}
                  name={[profile.firstname, profile.lastname].join(" ")}
                  time={notification.createdAt.toDateString()}
                  text={`${[profile.firstname, profile.lastname].join(
                    " ",
                  )} a répondu a votre question.`}
                />
              );
            }),
          )}
      </div>
    </UI.DropdownButton>
  );
}

function useNotification() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const jwt = session?.user?.jwt;
  const websocket = useRef<Unsubscribable>();
  const [notifications, set_notifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!jwt) return;
    websocket.current = trpc.notifications.subscribe(jwt, {
      onData(value) {
        set_notifications([value]);
      },
      onStarted() {
        console.log("onStarted");
      },
      onComplete() {
        console.log("onComplete");
      },
    });
    return websocket.current.unsubscribe;
  }, [queryClient, jwt]);

  return notifications;
}
