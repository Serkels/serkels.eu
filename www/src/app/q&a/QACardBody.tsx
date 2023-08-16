"use client";

import { AvatarMediaHorizontal } from "@/components/Avatar";
import { Circle } from "@1/ui/icons";
import clsx from "clsx";
import { useContext } from "react";
import { QACardContext } from "./QACard.context";

//

export function QACardBody() {
  const {
    question: { attributes },
  } = useContext(QACardContext);

  const owner_id = attributes?.profile?.data?.id!;
  const is_accepted = Boolean(attributes?.is_accepted);
  const title = attributes?.title;
  const university = attributes?.profile?.data?.attributes?.university;
  const username = [
    attributes?.profile?.data?.attributes?.firstname,
    attributes?.profile?.data?.attributes?.lastname,
  ].join(" ");
  const updatedAt = attributes?.updatedAt
    ? new Date(attributes?.updatedAt)
    : new Date(NaN);

  return (
    <div className="">
      <header className="mb-4 flex justify-between">
        <AvatarMediaHorizontal
          u={owner_id}
          university={university}
          username={username}
        />
        <div className="space-x-2">
          <Circle
            className={clsx("inline-block h-4", {
              "text-Chateau_Green": is_accepted,
              "text-[#C10000]": !is_accepted,
            })}
          />
          <time
            className="mt-3 text-xs"
            dateTime={updatedAt.toUTCString()}
            title={updatedAt.toUTCString()}
          >
            {updatedAt.toLocaleDateString("fr")}
          </time>
        </div>
      </header>
      <article>
        <h3 className="my-5 text-xl font-bold">{title}</h3>
      </article>
    </div>
  );
}
