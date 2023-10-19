"use client";

import { useContext } from "react";
import { QAResponseForm } from "../QAResponse/QAResponseForm";
import { QACardContext } from "./QACard.context";

//

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
