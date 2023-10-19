//

import type { Comment_ListSchema, Comment_Schema } from "@1/strapi-openapi";
import { Button } from "@1/ui/components/ButtonV";
import { Spinner } from "@1/ui/components/Spinner";
import type { UseInfiniteQueryResult } from "@tanstack/react-query";
import { format, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";
import { useSession } from "next-auth/react";
import { Fragment, type ComponentProps } from "react";
import tw from "tailwind-styled-components";
import { match } from "ts-pattern";
import { v4 } from "uuid";
import { Link_Avatar } from "~/components/Avatar";
import {
  Message,
  Message_Blocked,
} from "~/components/Conversation/Conversation_Timeline";
import { useDeal_Value } from "./[exchange_id]/deals/Deal.context";

//

export function Exchange_Conversation_Timeline({
  query_info,
}: {
  query_info: UseInfiniteQueryResult<Comment_ListSchema, unknown>;
}) {
  const { data, isFetchingNextPage, hasNextPage, fetchNextPage } = query_info;
  if (!data) return null;
  const { pages } = data;

  const flatten_pages = pages.map((page) => page.data!).flat();
  const grouped_by_day_and_profile = flatten_pages.reduceRight(
    (group, comment) => {
      const [day_time] = group.at(-1) ?? [];
      const { author, createdAt } = comment;

      if (!isSameDay(day_time ?? NaN, new Date(createdAt))) {
        group.push([new Date(createdAt), []]);
      }

      const [, messagesByProfile] = group.at(-1)!;

      const [last_id] = messagesByProfile.at(-1) ?? [NaN];
      if (Number.isNaN(last_id) || last_id !== author.id) {
        messagesByProfile.push([Number(author.id), []]);
      }

      const [, messages] = messagesByProfile.at(-1)!;
      messages!.push(comment);

      return group;
    },
    [] as [Date, [number, Comment_Schema[]][]][],
  );

  return (
    <>
      {match({ isFetchingNextPage, hasNextPage })
        .with({ isFetchingNextPage: true }, () => <Spinner />)
        .with({ hasNextPage: true }, () => <LoadMore onClick={fetchNextPage} />)
        .otherwise(() => null)}
      {grouped_by_day_and_profile.map(([day, messages_by_profile]) => {
        return (
          <Fragment key={Number(day)}>
            <MessageTime date={day} />
            {messages_by_profile.map(([id, messages]) => {
              return (
                <ProfileMessages
                  key={`${Number(day)}_${v4({})}`}
                  profile={id}
                  messages={messages}
                />
              );
            })}
          </Fragment>
        );
      })}
    </>
  );
}

function LoadMore({ onClick }: { onClick: () => void }) {
  return <Button onPress={onClick}>Charger plus de messages.</Button>;
}

function ProfileMessages({
  profile,
  messages,
}: {
  profile: number;
  messages: Comment_Schema[];
}) {
  const { data: session } = useSession();
  const [deal] = useDeal_Value();
  const isYou = session?.user?.profile.id === profile;
  const last_index = messages.length - 1;

  return (
    <Speaker $isYou={isYou}>
      <Speaker_Avatar $isYou={isYou}>
        <Link_Avatar
          u={profile}
          className="h-3xl w-3xl rounded-3xl object-cover shadow-md"
        />
      </Speaker_Avatar>
      <MessageGroup $isYou={isYou}>
        {messages.map((message, index) =>
          match(message)
            .with({ blocked: true }, () => (
              <Message_Blocked
                key={message.id}
                $isFirst={index === 0}
                $isLast={index === last_index}
                $isYou={isYou}
              />
            ))
            .otherwise(({ id }) => (
              <ProfileMessage
                message={message}
                index={index}
                key={`${id}_${message.id}`}
              />
            )),
        )}
      </MessageGroup>
    </Speaker>
  );

  function ProfileMessage({
    message,
    index,
  }: { message: Comment_Schema } & { index: number }) {
    const { data: session } = useSession();
    const { content } = message;
    const isYou = session?.user?.profile.id === profile;

    return match(content)
      .with(`/exchange server handshake accepeted ${deal.get("id")}`, () => (
        <Message_OKay
          $isFirst={index === 0}
          $isLast={index === last_index}
          $isYou={isYou}
        />
      ))
      .with(`/exchange client handshake accepeted ${deal.get("id")}`, () => (
        <Message_MeToo
          $isFirst={index === 0}
          $isLast={index === last_index}
          $isYou={isYou}
        />
      ))
      .with(`/exchange server handshake denied ${deal.get("id")}`, () => (
        <Message_Denied
          $isFirst={index === 0}
          $isLast={index === last_index}
          $isYou={isYou}
        />
      ))
      .with(`/exchange client handshake denied ${deal.get("id")}`, () => (
        <Message_NotInterested
          $isFirst={index === 0}
          $isLast={index === last_index}
          $isYou={isYou}
        />
      ))
      .otherwise(() => (
        <Message
          $isFirst={index === 0}
          $isLast={index === last_index}
          $isYou={isYou}
        >
          {content}
        </Message>
      ));
  }
}

const Speaker_Avatar = tw.div<{ $isYou: boolean }>`
  relative
  flex
  h-8
  w-8
  flex-shrink-0
  ${({ $isYou }) => ($isYou ? "ml-4" : "mr-4")}
`;

const Speaker = tw.div<{ $isYou: boolean }>`
  mb-4
  flex
  flex-row
  justify-start
  ${({ $isYou }) => ($isYou ? "flex-row-reverse" : "")}
`;

const MessageGroup = tw.div<{
  $isYou: boolean;
}>`
  grid
  flex-1
  grid-flow-row
  gap-2
  text-sm
`;

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

//

function Message_OKay(props: ComponentProps<typeof Message>) {
  return <Message {...props}>C'est OK pour moi, et pour toi ? ✅</Message>;
}
function Message_MeToo(props: ComponentProps<typeof Message>) {
  return <Message {...props}>✅ C'est OK pour moi aussi.</Message>;
}

function Message_Denied(props: ComponentProps<typeof Message>) {
  return <Message {...props}>✖️ Je ne suis plus disponible.</Message>;
}

function Message_NotInterested(props: ComponentProps<typeof Message>) {
  return <Message {...props}>✖️ Je ne suis plus interessé.</Message>;
}
