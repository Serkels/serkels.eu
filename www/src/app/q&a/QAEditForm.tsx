"use client";

import { fromClient } from "@/app/api/v1";
import { Spinner } from "@1/ui/components/Spinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useCallback, useContext } from "react";
import { QACardContext } from "./QACard.context";
import { QACardFormBody } from "./QACardFormBody";
import { QARepository } from "./QARepository";

//

export function QAEditForm() {
  const {
    question: { id, attributes },
    statefulStatus: [{ isEditing }, setStatus],
  } = useContext(QACardContext);

  const { mutateAsync, isError, isLoading, error } = useEditQAMutation(
    Number(id),
  );

  const onSubmit = useCallback(
    async (values: { title: string; category: number }) => {
      await mutateAsync(values);
      await setStatus((state) => ({ ...state, isEditing: false }));
    },
    [isEditing],
  );

  if (isError) {
    return <ErrorOccur error={error as Error} />;
  }

  if (isLoading) {
    return <Spinner className="mx-auto my-5" />;
  }

  //

  return (
    <QACardFormBody
      onSubmit={onSubmit}
      initialValues={{
        title: attributes?.title,
        category: attributes?.category?.data?.id,
      }}
    />
  );
}

//

function ErrorOccur({ error }: { error: Error }) {
  return (
    <h1 className="flex-1 py-3 text-center text-lg font-bold text-red-500">
      Une erreur est survenu...
      <br />
      Veuillez fermer cette fenêtre et réessayez de vous authentifier.
      <br />
      <code className="text-gray-800">{error?.message}</code>
    </h1>
  );
}

//

function useEditQAMutation(id: number) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const jwt = session?.user?.jwt;

  return useMutation(
    async ({ title, category }: { title: string; category: number }) => {
      if (Number.isNaN(id)) throw new Error("Invalid id");
      if (!jwt) throw new Error("Invalid JWT");

      const body = await new QARepository(fromClient, jwt).edit(id, {
        title,
        category,
      });

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [...QARepository.queryKey, id],
        }),
      ]);

      return body;
    },
  );
}
