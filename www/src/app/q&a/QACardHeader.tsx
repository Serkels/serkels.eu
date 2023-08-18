"use client";
import { AvatarMediaHorizontal } from "@/components/Avatar";
import { Circle } from "@1/ui/icons";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import { useContext } from "react";
import { QACardContext } from "./QACard.context";

//

export function QACardHeader() {
  const {
    question: { attributes },
  } = useContext(QACardContext);

  const owner_id = attributes?.profile?.data?.id!;
  const is_accepted = Boolean(attributes?.is_accepted);
  const university = attributes?.profile?.data?.attributes?.university;
  const username = [
    attributes?.profile?.data?.attributes?.firstname,
    attributes?.profile?.data?.attributes?.lastname,
  ].join(" ");

  return (
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
        <QACard_ActionGroup />
        <QACard_Time />
      </div>
    </header>
  );
}

function QACard_ActionGroup() {
  const { data: session } = useSession();

  const {
    question: { attributes },
  } = useContext(QACardContext);
  const updatedAt = attributes?.updatedAt
    ? new Date(attributes?.updatedAt)
    : new Date(NaN);

  //

  const jwt = session?.user?.jwt;

  if (session?.user?.profile.id === attributes?.profile?.data?.id && jwt) {
    return null;
  }

  return (
    <time
      className="mt-3 text-xs"
      dateTime={updatedAt.toUTCString()}
      title={updatedAt.toUTCString()}
    >
      {updatedAt.toLocaleDateString("fr")} !!!!!
    </time>
  );
}

function QACard_Time() {
  const {
    question: { attributes },
  } = useContext(QACardContext);
  const updatedAt = attributes?.updatedAt
    ? new Date(attributes?.updatedAt)
    : new Date(NaN);
  return (
    <time
      className="mt-3 text-xs"
      dateTime={updatedAt.toUTCString()}
      title={updatedAt.toUTCString()}
    >
      {updatedAt.toLocaleDateString("fr")}
    </time>
  );
}
