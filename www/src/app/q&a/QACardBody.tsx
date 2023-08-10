"use client";
import { AvatarMediaHorizontal } from "@/components/Avatar";
import { useContext } from "react";
import { QACardContext } from "./QACardContext";

export function QACardBody() {
  const {
    question: { attributes },
  } = useContext(QACardContext);

  const owner_id = attributes?.profile?.data?.id!;
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
        <time
          className="mt-3 text-xs"
          dateTime={updatedAt.toUTCString()}
          title={updatedAt.toUTCString()}
        >
          {updatedAt.toLocaleDateString("fr")}
        </time>
      </header>
      <article>
        <h3 className="my-5 text-xl font-bold">{title}</h3>
      </article>
    </div>
  );
}
