//

import type { Message as Message_Type } from "@1.modules/inbox.domain";
import { PROFILE_UNKNOWN, type Profile } from "@1.modules/profile.domain";
import { Button } from "@1.ui/react/button";
import { Spinner } from "@1.ui/react/spinner";
import type { UseInfiniteQueryResult } from "@tanstack/react-query";
import { format, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";
import { Fragment, type PropsWithChildren } from "react";
import { createSlot } from "react-slotify";
import { match } from "ts-pattern";
import { Message } from "./Message";
import { ProfileMessages } from "./ProfileMessages";

//

export function Timeline({
  children,
  profile_id,
  query_info,
}: PropsWithChildren<{
  profile_id: string;
  query_info: UseInfiniteQueryResult<{ data: Message_Type }, unknown>;
}>) {
  const { data, isFetchingPreviousPage, hasPreviousPage, fetchPreviousPage } =
    query_info;

  if (!data) return null;
  const { pages } = data;

  const flatten_pages = pages
    .map((page) => page.data)
    .reverse()
    .flat();

  const grouped_by_day_and_profile = flatten_pages.reduceRight(
    (group, message) => {
      const [day_time] = group.at(-1) ?? [];
      const { author, created_at } = message;

      if (!isSameDay(day_time ?? NaN, created_at)) {
        group.push([created_at, []]);
      }

      const [, messagesByProfile] = group.at(-1)!;

      const [{ id: last_id }] = messagesByProfile.at(-1) ?? [PROFILE_UNKNOWN];

      if (last_id !== author.id) {
        messagesByProfile.push([author, []]);
      }

      const [, messages] = messagesByProfile.at(-1)!;
      messages!.push(message);

      return group;
    },
    [] as [Date, [Omit<Profile, "bio">, Message_Type[]][]][],
  );

  return (
    <>
      {match({ isFetchingPreviousPage, hasPreviousPage })
        .with({ isFetchingPreviousPage: true }, () => <Spinner />)
        .with({ hasPreviousPage: true }, () => (
          <LoadMore onClick={fetchPreviousPage} />
        ))
        .otherwise(() => null)}
      {grouped_by_day_and_profile.map(([day, messages_by_profile]) => {
        return (
          <Fragment key={String(day)}>
            <MessageTime date={day} />
            {messages_by_profile.map(([profile, messages], index) => (
              <ProfileMessages
                key={`${Number(day)}_${profile.id}_${index}`}
                is_you={profile.id === profile_id}
                profile={profile}
              >
                <Timeline.Message.Renderer
                  childs={children}
                  messages={messages}
                  profile={profile}
                >
                  {messages.map((message, index, array) => (
                    <Message
                      key={message.id}
                      variant={{
                        is_first: index === 0,
                        is_last: index === array.length - 1,
                        is_you: profile.id === profile_id,
                      }}
                    >
                      <time
                        className="mt-3 text-xs opacity-30"
                        dateTime={message.created_at.toUTCString()}
                        title={message.created_at.toUTCString()}
                      >
                        {format(message.created_at, "Pp", { locale: fr })}
                        <br />
                      </time>
                      <p className="whitespace-pre-line">{message.content}</p>
                    </Message>
                  ))}
                </Timeline.Message.Renderer>
              </ProfileMessages>
            ))}
          </Fragment>
        );
      })}
    </>
  );
}

Timeline.Message = createSlot<{
  messages: Message_Type[];
  profile: Omit<Profile, "bio">;
}>();

function MessageTime({ date }: { date: Date }) {
  const utc = date.toUTCString();
  return (
    <time
      className="block p-4 text-center text-sm text-gray-500"
      dateTime={utc}
      title={utc}
    >
      {format(date, "Pp", { locale: fr })}
    </time>
  );
}

function LoadMore({ onClick }: { onClick: () => void }) {
  return (
    <Button
      className="mx-auto block pb-8"
      state="ghost"
      intent="light"
      onPress={onClick}
    >
      Charger plus de messages.
    </Button>
  );
}
