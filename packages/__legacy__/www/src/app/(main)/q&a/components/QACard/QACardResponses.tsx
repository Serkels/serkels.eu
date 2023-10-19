"use client";
import { useContext } from "react";
import { QACardResponseList } from "../QAResponse/QAResponseList";
import { QACardContext } from "./QACard.context";

export function QACardResponses() {
  const {
    statefulStatus: [{ isDisplayingResponses }],
  } = useContext(QACardContext);

  if (!isDisplayingResponses) return null;

  return (
    <>
      <div className="relative mb-4 mt-3">
        <hr className="absolute top-0 my-3 w-full" />
        <h5 className="relative inline-block bg-white pr-3 text-sm font-bold uppercase text-Dove_Gray">
          Réponses
        </h5>
      </div>
      <QACardResponseList />
    </>
  );
}
