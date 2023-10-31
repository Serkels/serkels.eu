//

import type { Message as Message_Type } from "@1.modules/inbox.domain";
import type { Profile } from "@1.modules/profile.domain";
import { Avatar } from "@1.ui/react/avatar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { tv } from "tailwind-variants";
import { Message } from "./Message";

//

export function ProfileMessages({
  is_you,
  profile,
  messages,
}: {
  is_you: boolean;
  profile: Omit<Profile, "bio">;
  messages: Message_Type[];
}) {
  const last_index = messages.length - 1;
  const { avatar, base, group } = profile_messages({ is_you });
  return (
    <div className={base()}>
      <Avatar image={profile.image} id={profile.id} className={avatar()} />
      <div className={group()}>
        {messages.map((message, index) => (
          <Message
            key={message.id}
            variant={{
              is_first: index === 0,
              is_last: index === last_index,
              is_you,
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
            {message.content}
          </Message>
        ))}
      </div>
    </div>
  );
}

export const profile_messages = tv({
  base: "mb-4 flex flex-row justify-start",
  slots: {
    avatar: "relative flex h-8 w-8 flex-shrink-0",
    group: "grid flex-1 grid-flow-row gap-2 px-1.5 text-sm",
  },
  variants: {
    is_you: {
      true: "flex-row-reverse",
    },
  },
});
