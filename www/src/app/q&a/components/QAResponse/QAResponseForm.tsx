//

import { fromClient } from "@/app/api/v1";
import { AvatarMediaHorizontal } from "@/components/Avatar";
import { ErrorOccur } from "@/components/ErrorOccur";
import { Spinner } from "@1/ui/components/Spinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Field, Form, Formik, type FormikProps } from "formik";
import { useSession } from "next-auth/react";
import { useContext, type Ref } from "react";
import { AnswerRepository, QARepository } from "../../QARepository";
import { QACardContext } from "../QACard/QACard.context";

//

export function QAResponseForm({
  innerRef,
}: {
  innerRef: Ref<FormikProps<{ content: string }>>;
}) {
  const {
    question,
    statefulStatus: [, setStatus],
  } = useContext(QACardContext);
  const { data: session, update } = useSession();
  const queryClient = useQueryClient();
  const jwt = session?.user?.jwt;

  const { mutateAsync, isError, isLoading, error } = useMutation(
    async (data: { content: string }) => {
      if (!question.id) throw new Error("Invalid question.id");
      if (!jwt) throw new Error("Invalid JWT");

      const body = await new AnswerRepository(fromClient, jwt).save(
        question.id,
        data,
      );

      return body;
    },
    {
      onSuccess() {
        setStatus((state) => ({
          ...state,
          isResponding: false,
          isDisplayingResponses: true,
          isSubmitting: false,
        }));

        Promise.all([
          queryClient.invalidateQueries({
            queryKey: [...QARepository.queryKey, question.id],
          }),
          update(),
        ]);
      },
    },
  );

  if (isError) {
    return <ErrorOccur error={error as Error} />;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[150px] items-center">
        <Spinner className="mx-auto my-5" />
      </div>
    );
  }

  return (
    <div>
      <AvatarMediaHorizontal
        className="my-5"
        u={session?.user?.profile.id}
        university={session?.user?.profile.attributes?.university}
        username={session?.user?.name ?? ""}
      />

      <Formik
        innerRef={innerRef}
        initialValues={{
          content: "",
        }}
        enableReinitialize
        onSubmit={({ content }) => {
          setStatus((state) => ({ ...state, isSubmitting: true }));
          return mutateAsync({
            content,
          });
        }}
      >
        {({ isSubmitting }) => (
          <Form className="flex-1">
            <Field
              className="
                mb-7
                w-full 
                rounded-sm border border-solid border-[#dddddd] 
                px-4 py-3
                
                placeholder-black
                
                md:col-span-6
              "
              component="textarea"
              disabled={isSubmitting}
              name="content"
              required
            />
          </Form>
        )}
      </Formik>
    </div>
  );
}

//
