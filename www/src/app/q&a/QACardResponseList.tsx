"use client";
import { Avatar } from "@/components/Avatar";
import { Spinner } from "@1/ui/components/Spinner";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useContext } from "react";
import { fromClient } from "../api/v1";
import { BlockedComment } from "./BlockedComment";
import { QACardContext } from "./QACardContext";
import { QARepository } from "./QARepository";

export function QACardResponseList() {
  const {
    statefulStatus: [{ isDisplayingResponses }],
    question,
  } = useContext(QACardContext);
  const { data: session } = useSession();

  const repository = new QARepository(fromClient);
  const {
    data: comments,
    isLoading,
    isError,
  } = useQuery({
    enabled: Boolean(question.id && isDisplayingResponses),
    queryKey: ["q&a", question.id, "awnsers"],
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
