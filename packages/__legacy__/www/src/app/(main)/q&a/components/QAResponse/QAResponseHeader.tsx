// @ts-nocheck

//

import { useSession } from "next-auth/react";
import { useContext } from "react";
import { AvatarMedia } from "~/components/Avatar";
import { DeleteIconButton } from "~/components/DeleteButton/DeleteButton";
import { TimeInfo } from "~/components/TimeInfo";
import { QAResponseContext } from "./QAResponse.context";

export function QAResponseHeader() {
  const {
    response: { author, createdAt, updatedAt },
  } = useContext(QAResponseContext);
  return (
    <header className=" flex justify-between">
      <AvatarMedia
        $size="sm"
        u={author.id}
        university={author.university}
        // TODO (douglasduteil): use profile domain name here
        username={[author.firstname, author.lastname].join(" ")}
      />

      <aside className=" flex items-start justify-between">
        <ActionGroup />
        <TimeInfo values={{ createdAt, updatedAt }} />
      </aside>
    </header>
  );
}

function ActionGroup() {
  const { data: session } = useSession();
  const {
    response: { author },
  } = useContext(QAResponseContext);
  const jwt = session?.user?.jwt;

  if (!jwt) {
    return null;
  }
  if (session?.user?.profile.id !== author.id) {
    return null;
  }

  return (
    <nav className="flex">
      <DeleteIconButton />
    </nav>
  );
}
