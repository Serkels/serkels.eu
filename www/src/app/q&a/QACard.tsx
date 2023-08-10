"use client";

import { Avatar } from "@/components/Avatar";
import type { components } from "@1/strapi-openapi/v1";
import { Button } from "@1/ui/components/Button";
import { Spinner } from "@1/ui/components/Spinner";
import { useQuery } from "@tanstack/react-query";
import type { FormikProps } from "formik";
import { useSession } from "next-auth/react";
import { useContext, useRef } from "react";
import { useToggle } from "react-use";
import { fromClient } from "../api/v1";
import { QACardBody } from "./QACardBody";
import { QACardContext } from "./QACardContext";
import { QARepository } from "./QARepository";
import { QAResponseForm } from "./QAResponseForm";

export function QACard(
  question: components["schemas"]["QuestionListResponseDataItem"],
) {
  const [isResponding, setIsResponding] = useToggle(false);
  const [isSubmitting, setIsSubmitting] = useToggle(false);
  const [isDisplayingResponses, setIsDisplayingResponses] = useToggle(false);
  const QAResponseFormRef = useRef<FormikProps<{ content: string }>>(null);

  //

  return (
    <div
      className="overflow-hidden rounded-xl border border-[#00000017] bg-white p-6 text-black shadow-[5px_5px_10px_#7E7E7E33]"
      id={question.id ? String(question.id) : undefined}
    >
      <QACardContext.Provider
        value={{
          isDisplayingResponses,
          isResponding,
          isSubmitting,
          QAResponseFormRef,
          question,
          setIsDisplayingResponses,
          setIsResponding,
          setIsSubmitting,
        }}
      >
        <QACardBody />
        <QACardResponses />
        <QACardResponseForm />
        <hr className="my-2" />
        <QACardFooter />
      </QACardContext.Provider>
    </div>
  );
}

function QACardResponses() {
  const { isDisplayingResponses } = useContext(QACardContext);

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
function QACardResponseList() {
  const { isDisplayingResponses, question } = useContext(QACardContext);
  const { data: session } = useSession();

  const repository = new QARepository(fromClient);
  const {
    data: comments,
    isLoading,
    isError,
  } = useQuery({
    enabled: Boolean(question.id && isDisplayingResponses),
    queryKey: ["q&a", question.id],
    queryFn: () =>
      repository.loadResponsesOf(session?.user?.jwt!, question.id!),
  });

  //

  if (isLoading)
    return (
      <div className="flex min-h-[150px] items-center">
        <Spinner className="mx-auto my-5" />
      </div>
    );

  if (isError) return <>Epic fail...</>;
  if (!comments) return <>No data O_o</>;

  return (
    <ul>
      {comments
        .sort((a, b) => Date.parse(a.createdAt!) - Date.parse(b.createdAt!))
        .map((comment) => {
          const updatedAt = comment?.updatedAt
            ? new Date(comment?.updatedAt)
            : new Date(NaN);

          if (comment.blocked) {
            return <BlockedComment />;
          }
          return (
            <li className="my-3" key={comment.id}>
              <header className=" flex justify-between">
                <figure className="flex">
                  <Avatar className="h-9 w-9" u={comment.author?.id} />
                  <figcaption className="ml-2">
                    <span className="block text-base font-medium leading-snug text-black">
                      {[
                        comment.author?.firstname,
                        comment.author?.lastname,
                      ].join(" ")}
                    </span>
                    <span className="block text-sm font-light leading-snug text-gray-500 ">
                      🎓 {comment.author?.university}
                    </span>
                  </figcaption>
                </figure>

                <time
                  className="mt-3 text-xs"
                  dateTime={updatedAt?.toUTCString()}
                  title={updatedAt.toUTCString()}
                >
                  {updatedAt.toLocaleDateString("fr")}
                </time>
              </header>
              <article className="ml-12">{comment.content}</article>
              {/* <footer className="my-3"></footer> */}
            </li>
          );
        })}
    </ul>
  );
}

function QACardResponseForm() {
  const { isResponding, QAResponseFormRef } = useContext(QACardContext);

  if (!isResponding) return null;
  return (
    <>
      <hr className="my-2" />
      <QAResponseForm innerRef={QAResponseFormRef} />
    </>
  );
}

function QACardFooter() {
  const {
    isResponding,
    isSubmitting,
    setIsResponding,
    setIsDisplayingResponses,
    QAResponseFormRef,
  } = useContext(QACardContext);

  return (
    <footer className="mt-4">
      <div className="flex justify-between">
        <button
          className="block text-sm font-bold text-Dove_Gray"
          onClick={() => setIsDisplayingResponses(true)}
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
              onClick={() => setIsResponding(false)}
            >
              Annuler
            </button>
          </>
        ) : (
          <button
            className="text-md block rounded-full px-7 font-bold text-Chateau_Green "
            onClick={() => setIsResponding(true)}
          >
            Répondre
          </button>
        )}

        <button className="block">↗️</button>
      </div>
    </footer>
  );
}

function BlockedComment() {
  return <div className="my-5 opacity-50 ">Réponse bloquée...</div>;
}
