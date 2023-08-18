"use client";

import { AvatarMediaHorizontal } from "@/components/Avatar";
import { Button } from "@1/ui/components/Button";
import { Circle } from "@1/ui/icons";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import { useCallback, useContext } from "react";
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
      <div className="flex items-start space-x-2">
        <QACard_ActionGroup />
        <Circle
          className={clsx("mt-3 inline-block h-4", {
            "text-Chateau_Green": is_accepted,
            "text-[#C10000]": !is_accepted,
          })}
        />
        <QACard_Time />
      </div>
    </header>
  );
}

function QACard_Time() {
  const {
    question: { attributes },
  } = useContext(QACardContext);
  const updatedAt = attributes?.updatedAt
    ? new Date(attributes?.updatedAt)
    : new Date(NaN);

  //

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

function QACard_ActionGroup() {
  const { data: session } = useSession();
  const {
    question: { attributes },
  } = useContext(QACardContext);
  const jwt = session?.user?.jwt;

  if (!jwt) {
    return null;
  }
  if (session?.user?.profile.id !== attributes?.profile?.data?.id) {
    return null;
  }

  return (
    <nav className="flex">
      <QACard_EditButton />
      <Button className="px-2 py-2" variant="light" theme-padding={false}>
        🗑️
      </Button>
    </nav>
  );
}

function QACard_EditButton() {
  const {
    statefulStatus: [{ isEditing }, setStatus],
  } = useContext(QACardContext);

  const on_editing = useCallback(() => {
    setStatus((state) => ({ ...state, isEditing: !isEditing }));
  }, [isEditing]);

  return (
    <Button
      className="px-2 py-2"
      variant="light"
      onClick={on_editing}
      theme-padding={false}
    >
      {isEditing ? "❌" : "🖊️"}
    </Button>
  );
}
