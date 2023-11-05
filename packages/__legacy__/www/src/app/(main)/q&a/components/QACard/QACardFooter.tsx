// @ts-nocheck

"use client";

import { Button } from "@1/ui/components/Button";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import { useCallback, useContext } from "react";
import { useTimeoutFn, useToggle } from "react-use";
import { QACardContext } from "./QACard.context";

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

  const [shouldSignUp, setShouldSignUp] = useToggle(false);
  const [, , reset] = useTimeoutFn(() => setShouldSignUp(false), 5000);
  const setIsResponding = useCallback((isResponding: boolean) => {
    setStatus((state) => ({
      ...state,
      isResponding,
    }));
  }, []);

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
          onClick={() => setIsResponding(false)}
        >
          Annuler
        </button>
      </>
    );

  return (
    <div className="relative">
      {shouldSignUp ? (
        <div
          className="
            absolute
            bottom-full
            w-max
            -translate-x-1/4
            -translate-y-1/3
            rounded-full
            bg-[#707070]
            px-6
            py-2
            text-white
            before:pointer-events-none
            before:absolute
            before:bottom-0
            before:left-1/2
            before:box-border before:h-3
            before:w-3
            before:-translate-x-1/2
            before:translate-y-1/2
            before:rotate-45
            before:bg-inherit
            before:content-['']
          "
        >
          Connectez-vous pour répondre
        </div>
      ) : null}
      <button
        className="text-md block rounded-full px-7 font-bold text-Chateau_Green "
        onClick={() =>
          session ? setIsResponding(true) : (setShouldSignUp(true), reset())
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
    question: { attributes },
  } = useContext(QACardContext);

  const count = attributes?.answer_count;
  if (count === undefined) return "...";

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
