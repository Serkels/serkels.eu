"use client";
import { Button } from "@1/ui/components/Button";
import { useContext } from "react";
import { QACardContext } from "./QACardContext";

export function QACardFooter() {
  const {
    statefulStatus: [{ isResponding, isSubmitting }, setStatus],
    QAResponseFormRef,
  } = useContext(QACardContext);

  return (
    <footer className="mt-4">
      <div className="flex justify-between">
        <button
          className="block text-sm font-bold text-Dove_Gray"
          onClick={() =>
            setStatus((state) => ({ ...state, isDisplayingResponses: true }))
          }
        >
          <span className="text-Chateau_Green">1</span> réponse
        </button>

        {isResponding ? (
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
        ) : (
          <button
            className="text-md block rounded-full px-7 font-bold text-Chateau_Green "
            onClick={() =>
              setStatus((state) => ({
                ...state,
                isResponding: true,
              }))
            }
          >
            Répondre
          </button>
        )}

        <button className="block">↗️</button>
      </div>
    </footer>
  );
}
