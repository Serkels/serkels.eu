"use client";

import type {
  Common_DiscussionListSchema,
  Common_MessageSchema,
} from "@1/strapi-openapi";
import { Button } from "@1/ui/components/ButtonV";
import { Spinner } from "@1/ui/components/Spinner";
import type { UseInfiniteQueryResult } from "@tanstack/react-query";
import { format, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";
import { useSession } from "next-auth/react";
import { Fragment, useId } from "react";
import { useRendersCount } from "react-use";
import tw from "tailwind-styled-components";
import { match } from "ts-pattern";
import { fromClient } from "~/app/api/v1";
import { Avatar } from "~/components/Avatar";
import { Deal_Message_Controller } from "~/modules/exchange/Deal_Message.controller";
import { Deal_Message_Repository } from "~/modules/exchange/Deal_Message.repository";
import { useDeal_Value } from "../Deal.context";

//

export function Deal_Discussion() {
  const [deal] = useDeal_Value();
  const uid = useId();

  const { data: session } = useSession();
  const repository = new Deal_Message_Repository(
    fromClient,
    session?.user?.jwt,
    deal.get("id"),
  );
  // const repository = new Exchange_Repository(fromClient, session?.user?.jwt);
  const {
    list: { useQuery },
    // } = new Exchange_Item_Controller(repository);
  } = new Deal_Message_Controller(repository);

  const query_info = useQuery({
    sort: ["createdAt:desc"],
    pagination: { pageSize: 42 },
  });
  return match(query_info.status)
    .with("error", () => null)
    .with("loading", () => null)
    .with("success", () => {
      return <Discussion_Timeline key={uid} query_info={query_info} />;
    })
    .exhaustive();
}

function Discussion_Timeline({
  query_info,
}: {
  query_info: UseInfiniteQueryResult<Common_DiscussionListSchema, unknown>;
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
    [] as [Date, [number, Common_MessageSchema[]][]][],
  );

  console.log({ grouped_by_day_and_profile });

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
            {messages_by_profile.map(([id, messages], index) => (
              <ProfileMessages
                key={`${Number(day)}_${id}_${index}`}
                profile={id}
                messages={messages}
              />
            ))}
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
  messages: Common_MessageSchema[];
}) {
  console.log(useRendersCount());
  const { data: session } = useSession();
  const isYou = session?.user?.profile.id === profile;
  const last_index = messages.length - 1;
  return (
    <Speaker $isYou={isYou}>
      <Speaker_Avatar $isYou={isYou}>
        <Avatar
          u={profile}
          className="h-3xl w-3xl rounded-3xl object-cover shadow-md"
        />
      </Speaker_Avatar>
      <MessageGroup $isYou={isYou}>
        {messages.map(({ content, id }, index) => (
          <Message
            key={id}
            $isFirst={index === 0}
            $isLast={index === last_index}
            $isYou={isYou}
          >
            {content}
          </Message>
        ))}
      </MessageGroup>
    </Speaker>
  );
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

const Message = tw.p<{ $isFirst: boolean; $isLast: boolean; $isYou: boolean }>`
  max-w-[85%]

  ${(p) => (p.$isFirst ? "rounded-t-3xl" : "")}

  ${(p) => (p.$isLast ? "rounded-b-3xl" : "")}
  ${(p) =>
    p.$isYou
      ? "ml-auto rounded-l-3xl bg-[#39B15417]"
      : "rounded-r-3xl bg-[#F4F7F9]"}
  px-6
  py-3 
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
