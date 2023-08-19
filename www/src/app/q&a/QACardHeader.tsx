"use client";

import { AvatarMediaHorizontal } from "@/components/Avatar";
import { Button } from "@1/ui/components/Button";
import { Circle } from "@1/ui/icons";
import clsx from "clsx";
import { isEqual as date_isEqual, formatDistance } from "date-fns";
import { fr } from "date-fns/locale";
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
        <QACard_Time />
      </div>
    </header>
  );
}

function QACard_Time() {
  const {
    question: { attributes },
  } = useContext(QACardContext);
  const created_at = attributes?.createdAt
    ? new Date(attributes?.createdAt)
    : new Date(NaN);

  const updated_at = attributes?.updatedAt
    ? new Date(attributes?.updatedAt)
    : new Date(NaN);

  const has_been_edited = !date_isEqual(created_at, updated_at);

  const time_distance = formatDistance(created_at, new Date(), {
    locale: fr,
  });

  //

  if (has_been_edited) {
    return (
      <div className="mt-3 text-xs">
        <time
          dateTime={updated_at.toUTCString()}
          title={updated_at.toUTCString()}
        >
          {time_distance}
        </time>
        {" • "}
        <time
          dateTime={created_at.toUTCString()}
          title={created_at.toUTCString()}
        >
          edited
        </time>
      </div>
    );
  }

  return (
    <time
      className="mt-3 text-xs"
      dateTime={created_at.toUTCString()}
      title={created_at.toUTCString()}
    >
      {time_distance}
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
