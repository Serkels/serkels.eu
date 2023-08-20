"use client";

import { Avatar } from "@/components/Avatar";
import { ErrorOccur } from "@/components/ErrorOccur";
import { Card } from "@1/ui/components/Card";
import { Spinner } from "@1/ui/components/Spinner";
import { useState } from "react";
import { match } from "ts-pattern";
import { useQuestion_controller } from "~/modules/question/view/react";
import { QACardFormBody } from "./components/QAForm/QACardFormBody";

//

export function QACreateForm() {
  const {
    create: { useMutation },
  } = useQuestion_controller();
  const { mutateAsync, status, error, reset } = useMutation();

  //

  const [isOpen, setIsOpen] = useState(false);

  return match(status)
    .with("error", () => (
      <Card>
        <ErrorOccur error={error as Error} />
      </Card>
    ))
    .with("idle", () => (
      <Card>
        <Avatar className="h-10" />
        {isOpen ? (
          <QACardFormBody onSubmit={(values) => mutateAsync(values)} />
        ) : (
          <button
            className="
              w-full 
              rounded-sm border border-solid border-[#dddddd] 
              px-4 py-2
              text-left
              hover:bg-gray-200
            "
            onClick={() => setIsOpen(true)}
          >
            Posez une questions aux étudiants...
          </button>
        )}
      </Card>
    ))
    .with("loading", () => (
      <Card>
        <Spinner className="mx-auto my-5" />
      </Card>
    ))
    .with("success", () => {
      setTimeout(reset, 3_333);
      return (
        <Card>
          <h1 className="flex-1 py-3 text-center text-lg font-bold text-Chateau_Green">
            Question postée
          </h1>
        </Card>
      );
    })
    .exhaustive();
}
