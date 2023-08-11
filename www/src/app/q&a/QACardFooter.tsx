"use client";
import { Button } from "@1/ui/components/Button";
import { useQuery } from "@tanstack/react-query";

import clsx from "clsx";
import { useSession } from "next-auth/react";
import { useContext } from "react";
import { fromClient } from "../api/v1";
import { QACardContext } from "./QACardContext";
import { QARepository } from "./QARepository";

//

export function QACardFooter() {
  return (
    <footer className="mt-4">
      <div className="flex justify-between">
        <ResponseCount />
        <ResponseButtons />
        <button className="block">↗️</button>
      </div>
    </footer>
  );
}

function ResponseButtons() {
  const {
    statefulStatus: [{ isResponding, isSubmitting }, setStatus],
    QAResponseFormRef,
  } = useContext(QACardContext);

  const { data: session } = useSession();

  if (isResponding)
    return (
      <>
        <Button
          className="disabled:opacity-20"
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          onClick={() => QAResponseFormRef.current?.submitForm()}
        >
          Envoyer
        </Button>
        <button
          className="text-md block rounded-full px-7 font-bold text-red-900 disabled:opacity-20"
          disabled={isSubmitting}
          onClick={() =>
            setStatus((state) => ({
              ...state,
              isResponding: false,
            }))
          }
        >
          Annuler
        </button>
      </>
    );

  return (
    <div className="relative">
      <button
        // {...triggerProps}
        className="text-md block rounded-full px-7 font-bold text-Chateau_Green "
        disabled={!Boolean(session)}
        onClick={() =>
          setStatus((state) => ({
            ...state,
            isResponding: true,
          }))
        }
      >
        Répondre
      </button>
    </div>
  );
}

function ResponseCount() {
  const {
    statefulStatus: [, setStatus],
    question: { id },
  } = useContext(QACardContext);
  const { data: count, isLoading } = useQuery({
    enabled: Boolean(id),
    queryKey: ["q&a", id, "awnsers", "count"],
    queryFn: () => new QARepository(fromClient).count_awnsers(Number(id)),
  });

  if (isLoading) return "...";
  if (count === undefined) return "O_o";

  return (
    <button
      className="block text-sm font-bold text-Dove_Gray"
      disabled={!Boolean(count)}
      onClick={() =>
        setStatus((state) => ({
          ...state,
          isDisplayingResponses: !state.isDisplayingResponses,
        }))
      }
    >
      <span
        className={clsx({
          "text-Chateau_Green": count,
          "text-[#C10000]": !count,
        })}
      >
        {count}
      </span>{" "}
      réponse{count > 0 ? "s" : ""}
    </button>
  );
}
