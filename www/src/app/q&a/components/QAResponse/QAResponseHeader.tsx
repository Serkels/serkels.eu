//

import { Avatar } from "@/components/Avatar";
import { TimeInfo } from "@/components/TimeInfo";
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

      <TimeInfo values={{ createdAt, updatedAt }} />
    </header>
  );
}
