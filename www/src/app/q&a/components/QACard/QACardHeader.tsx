"use client";

import { AvatarMediaHorizontal } from "@/components/Avatar";
import { TimeInfo } from "@/components/TimeInfo";
import { Button } from "@1/ui/components/Button";
import { Circle } from "@1/ui/icons";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import { useCallback, useContext, useEffect } from "react";
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
        <TimeInfo values={attributes ?? {}} />
      </div>
    </header>
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
      <QACard_DeleteButton />
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
      onClick={on_editing}
      theme-padding={false}
      variant="light"
    >
      {isEditing ? "❌" : "🖊️"}
    </Button>
  );
}

function QACard_DeleteButton() {
  const {
    statefulStatus: [{ shouldDelete }, setStatus],
  } = useContext(QACardContext);

  const on_editing = useCallback(() => {
    setStatus((state) => ({ ...state, shouldDelete: !shouldDelete }));
  }, [shouldDelete]);

  useEffect(() => {
    if (!shouldDelete) return;

    setTimeout(() => {
      setStatus((state) => ({ ...state, shouldDelete: false }));
    }, 0);
  }, [shouldDelete]);

  return (
    <Button
      className="px-2 py-2"
      onClick={on_editing}
      theme-padding={false}
      variant="light"
    >
      {shouldDelete ? "❌" : "🗑️"}
    </Button>
  );
}
