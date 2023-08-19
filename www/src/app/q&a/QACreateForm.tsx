"use client";

import { fromClient } from "@/app/api/v1";
import { Avatar } from "@/components/Avatar";
import { Spinner } from "@1/ui/components/Spinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useState, type ComponentPropsWithoutRef } from "react";
import { QACardFormBody } from "./QACardFormBody";
import { QAFormErrorOccur } from "./QAFormErrorOccur";
import { QARepository } from "./QARepository";

//

export function QACreateForm() {
  const [isOpen, setIsOpen] = useState(false);

  const { mutateAsync, isError, isLoading, error } = useNewQAMutation();

  if (isError) {
    return (
      <Card>
        <QAFormErrorOccur error={error as Error} />
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <Spinner className="mx-auto my-5" />
      </Card>
    );
  }

  //

  return (
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
  );
}

function Card({ children }: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className="
        flex 
        space-x-3
        overflow-hidden 
        rounded-xl
        bg-white 
        p-6
        text-black 
        shadow-[5px_5px_10px_#7E7E7E33]
      "
    >
      {children}
    </div>
  );
}

//

function useNewQAMutation() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const jwt = session?.user?.jwt;

  return useMutation(
    async ({ title, category }: { title: string; category: number }) => {
      if (!session?.user?.id) throw new Error("Invalid Session");
      if (!jwt) throw new Error("Invalid JWT");

      const body = await new QARepository(fromClient, jwt).save(
        session.user?.id,
        { title, category: Number(category) },
      );

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QARepository.queryKey }),
      ]);

      return body;
    },
  );
}
