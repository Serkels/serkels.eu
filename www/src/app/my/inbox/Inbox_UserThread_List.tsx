"use client";

import {
  Aggregate,
  Entity,
  InputError,
  Ok,
  Result,
  type IAdapter,
  type IResult,
} from "@1/core/domain";
import { Profile } from "@1/modules/profile/domain";
import {
  Profile_Schema,
  Profile_Schema_ToDomain,
} from "@1/modules/profile/infra/strapi";
import { Button } from "@1/ui/components/ButtonV";
import { Spinner } from "@1/ui/components/Spinner";
import { formatDistance } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import tw from "tailwind-styled-components";
import { P, match } from "ts-pattern";
import { z } from "zod";
import { Avatar_Show_Profile } from "~/components/Avatar_Show_Profile";
import { ErrorOccur } from "~/components/ErrorOccur";

//

export const Message_Schema = z.object({
  id: z.number(),
  content: z.string(),
});
export type Message_Schema = z.TypeOf<typeof Message_Schema>;
export interface Message_Props {
  id: number;
  content: string;
}

export class Message extends Entity<Message_Props> {
  private constructor(props: Message_Props) {
    super(props);
  }
  static override create(props: Message_Props): Result<Message, Error> {
    return Ok(new Message(props));
  }

  //

  get the_excerpt() {
    return this.props.content.trim().slice(0, 123);
  }
}

class Message_Schema_ToDomain implements IAdapter<Message_Schema, Message> {
  build(target: Message_Schema): IResult<Message, Error> {
    const id = target.id;
    const content = target.content;
    return Message.create({ id, content });
  }
}
//
//
//

export const Thread_Schema = z.object({
  id: z.number(),
  profile: Profile_Schema,
  last_message: Message_Schema,
  updated_at: z.string(),
});

export type Thread_Schema = z.TypeOf<typeof Thread_Schema>;

//

export const Inbox_Schema = z.object({
  id: z.number(),
  thread: Thread_Schema,
});

export type Inbox_Schema = z.TypeOf<typeof Inbox_Schema>;

interface Inbox_Props {
  id: number;
  thread: Thread;
}
class Inbox extends Aggregate<Inbox_Props> {
  private constructor(props: Inbox_Props) {
    super(props);
  }
  static override create(props: Inbox_Props): Result<Inbox, Error> {
    return Ok(new Inbox(props));
  }
}
class Inbox_Schema_ToDomain implements IAdapter<Inbox_Schema, Inbox> {
  thread_to_domain = new Thread_Schema_ToDomain();
  build(target: Inbox_Schema): IResult<Inbox, Error> {
    const id = target.id;

    const results = [this.thread_to_domain.build(target.thread)] as const;
    if (Result.combine([...results]).isFail())
      throw new InputError("Inbox SubDomain", {
        cause: Result.combine([...results]).error(),
      });

    const [thread] = results;
    return Inbox.create({ id, thread: thread.value() });
  }
}

//
//
//

interface Thread_Props {
  id: number;
  profile: Profile;
  last_message: Message;
  updated_at: Date;
}

export class Thread extends Aggregate<Thread_Props> {
  private constructor(props: Thread_Props) {
    super(props);
  }
  static override create(props: Thread_Props): Result<Thread, Error> {
    return Ok(new Thread(props));
  }

  //
  get profile() {
    return this.props.profile;
  }
  get last_message() {
    return this.props.last_message;
  }

  get last_update() {
    return formatDistance(this.props.updated_at, new Date(), {
      locale: fr,
    });
  }
}

export class Thread_Schema_ToDomain implements IAdapter<Thread_Schema, Thread> {
  #message_to_domain = new Message_Schema_ToDomain();
  #profile_to_domain = new Profile_Schema_ToDomain();
  build(target: Thread_Schema): IResult<Thread, Error> {
    const id = target.id;
    const last_message = this.#message_to_domain.build(target.last_message);
    const profile = this.#profile_to_domain.build(target.profile);
    const updated_at = new Date(target.updated_at);

    const results = Result.combine([profile, last_message]);
    if (results.isFail())
      throw new InputError("Thread_Schema_ToDomain", {
        cause: results.error(),
      });

    return Thread.create({
      id,
      last_message: last_message.value(),
      profile: profile.value(),
      updated_at,
    });
  }
}
//
const mock = {
  pages: [
    {
      data: Array.from({ length: 5 }).map(
        (_, index) =>
          ({
            id: index,
            thread: {
              id: index,
              profile: {
                about: "",
                createdAt: new Date(),
                updatedAt: new Date(),
                firstname: "firstname" + index,
                lastname: "lastname" + index,
                id: index,
                university: "university" + index,
              },
              last_message: {
                id: index,
                content: "Hello " + index,
              },
              updated_at: `${2023 - index}-08-29T03:05:12.227Z`,
            },
          }) as Inbox_Schema,
      ),
      //  )} }) ,
      // ),
    },
  ],
};

function useInbox() {
  const inbox_dto_to_domain = new Inbox_Schema_ToDomain();
  const list_query_info = {
    status: "success" as "success" | "loading" | "error",
    data: mock,
    isFetchingNextPage: false,
    hasNextPage: false,
    error: new Error(
      "afterCreate plugin::comments.comment : question_id of api::exchange-deal.exchange-deal:12 is NaN afterCreate plugin::comments.comment : question_id of api::exchange-deal.exchange-deal:12 is NaN from https://www.toc-toc.org/api/v1/deals/12/messages",
    ),
    fetchNextPage: () => {},
  };
  const [inboxes, set_inboxes] = useState<Inbox[]>();
  useEffect(() => {
    if (!list_query_info.data) return;
    const flat_data = list_query_info.data.pages
      .map((page) => page.data)
      .flat();
    const result = Result.combine<Inbox[]>(
      flat_data.map((inbox) => inbox_dto_to_domain.build(inbox)),
    );
    if (result.isFail())
      throw new InputError("useInbox", { cause: result.error() });

    const results = flat_data.map((inbox) => inbox_dto_to_domain.build(inbox));
    if (Result.combine(results).isFail())
      throw new InputError("Inbox SubDomain", {
        cause: Result.combine(results).error(),
      });

    set_inboxes(results.map((e) => e.value()));
  }, [list_query_info.data, set_inboxes]);
  return { list_query_info, inboxes };
}

export function Inbox_UserThread_List() {
  const { list_query_info, inboxes } = useInbox();

  return match(list_query_info)
    .with({ status: "error", error: P.select() }, (error) => (
      <ErrorOccur error={error as Error} />
    ))
    .with({ status: "loading" }, () => <Loading />)
    .with(
      { status: "success" },
      ({ isFetchingNextPage, hasNextPage, fetchNextPage }) => (
        <nav>
          <UserInbox_List inboxes={inboxes} />
          {isFetchingNextPage ? <Loading /> : null}
          {hasNextPage ? (
            <Button
              onPress={() => fetchNextPage()}
              isDisabled={!hasNextPage || isFetchingNextPage}
            >
              Charger plus
            </Button>
          ) : null}
        </nav>
      ),
    )
    .exhaustive();
}

function UserInbox_List({ inboxes }: { inboxes: Inbox[] | undefined }) {
  return match(inboxes)
    .with(undefined, () => null)
    .when(
      (list) => list.length === 0,
      () => <EmptyList />,
    )
    .otherwise((list) => (
      <ul className="space-y-5 pb-8">
        {list.map((inbox) => (
          <li key={inbox.id.value()}>
            <UserThread_Item thread={inbox.get("thread")} />
          </li>
        ))}
      </ul>
    ));
}

//

function UserThread_Item({ thread }: { thread: Thread }) {
  const pathname = usePathname() ?? "";

  const href = `/my/inbox/${thread.get("id")}`;
  const active =
    pathname.split("/").length >= href.split("/").length &&
    href.includes(pathname);

  return (
    <Link href={href}>
      <Thread_Card $active={active}>
        <Thread_Header>
          <Avatar_Show_Profile profile={thread.profile} />
          <Thread_Time dateTime={thread.last_update} title={thread.last_update}>
            {thread.last_update}
          </Thread_Time>
        </Thread_Header>

        {/* <div className="float-right">
          <Circle className="h-5 w-5 text-Gamboge" />
        </div> */}
        <Thread_Excerpt
          $active={active}
          title={thread.last_message.the_excerpt}
        >
          {thread.last_message.the_excerpt}
        </Thread_Excerpt>
      </Thread_Card>
    </Link>
  );
}

const Thread_Header = tw.header`
  flex
  justify-between
`;

const Thread_Time = tw.time`
  text-xs
  font-bold
`;
const Thread_Card = tw.div<{ $active: boolean }>`
  block
  space-y-5
  rounded-xl
  border
  border-[#ECEDF4]
  bg-white
  p-4
  text-black
  shadow-[10px_10px_10px_#00000014]
`;

const Thread_Excerpt = tw.p<{ $active: boolean }>`
  mb-1
  line-clamp-1
`;
//

function Loading() {
  return (
    <Loading.ui.figure>
      <Spinner />
    </Loading.ui.figure>
  );
}

Loading.ui = {
  figure: tw.figure`
  mt-28
  text-center
`,
};

function EmptyList() {
  return (
    <EmptyList.ui.p>Aucune discussion disponible pour le moment</EmptyList.ui.p>
  );
}

EmptyList.ui = {
  p: tw.p`
  content-[Aucune
  discussion
  disponible
  pour
  le
  moment]
  flex
  h-1/3
  flex-col
  items-center
  justify-center
  text-center
  font-bold
  opacity-50
`,
};
