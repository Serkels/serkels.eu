"use client";

import type { Comment_ListSchema } from "@1/strapi-openapi";
import type { UseInfiniteQueryResult } from "@tanstack/react-query";
import { Avatar_Show_Profile } from "~/components/Avatar_Show_Profile";
import { Conversation_Form } from "~/components/Conversation/Conversation_Form";
import { Conversation_Timeline } from "~/components/Conversation/Conversation_Timeline";
import type { Message_Schema } from "../Inbox_UserThread_List";
import { useThread_Value } from "./Thread.context";

//

const mockk = {
  pages: [
    {
      data: Array.from({ length: 333 }).map(
        (_, index) =>
          ({
            id: index,
            content: "Hello " + index,
            author: {
              about: "",
              createdAt: new Date(),
              updatedAt: new Date(),
              firstname: "firstname" + index,
              lastname: "lastname" + index,
              id: index % 5,
              university: "university" + index,
            },
            createdAt: new Date(),
            updatedAt: new Date(),
            // created_at: `${2023 - index}-08-29T03:05:12.227Z`,
            // updated_at: `${2023 - index}-08-29T03:05:12.227Z`,
          }) as Message_Schema,
      ),
    },
  ],
};

export function Thread_Avatar() {
  const [thread] = useThread_Value();
  if (!thread) return null;
  return <Avatar_Show_Profile profile={thread.profile} />;
}

export function Thread_Conversation() {
  const query_info = { data: mockk } as UseInfiniteQueryResult<
    Comment_ListSchema,
    unknown
  >;
  return <Conversation_Timeline query_info={query_info} />;
  // const [thread] = useThread_Value();
  // if (!thread) return null;
  // return <Avatar_Show_Profile profile={thread.profile} />;
}

export function Thread_Conversation_Form() {
  const send_message = async (message: string) => console.log(message);
  return <Conversation_Form send_message={send_message} />;
}
