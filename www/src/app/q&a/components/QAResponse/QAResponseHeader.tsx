//

import { Avatar } from "@/components/Avatar";
import { DeleteIconButton } from "@/components/DeleteButton/DeleteButton";
import { TimeInfo } from "@/components/TimeInfo";
import { useSession } from "next-auth/react";
import { useContext } from "react";
import { QAResponseContext } from "./QAResponse.context";

export function QAResponseHeader() {
  const {
    response: { author, createdAt, updatedAt },
  } = useContext(QAResponseContext);
  return (
    <header className=" flex justify-between">
      <figure className="flex">
        <Avatar className="h-9 w-9" u={author?.id} />
        <figcaption className="ml-2">
          <span className="block text-base font-medium leading-snug text-black">
            {[author?.firstname, author?.lastname].join(" ")}
          </span>
          <span className="block text-sm font-light leading-snug text-gray-500 ">
            🎓 {author?.university}
          </span>
        </figcaption>
      </figure>

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
