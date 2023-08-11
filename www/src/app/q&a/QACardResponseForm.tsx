"use client";
import { useContext } from "react";
import { QACardContext } from "./QACardContext";
import { QAResponseForm } from "./QAResponseForm";

export function QACardResponseForm() {
  const {
    statefulStatus: [{ isResponding }],
    QAResponseFormRef,
  } = useContext(QACardContext);

  if (!isResponding) return null;
  return (
    <>
      <hr className="my-2" />
      <QAResponseForm innerRef={QAResponseFormRef} />
    </>
  );
}
