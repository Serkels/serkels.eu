"use client";

import { fromClient } from "@/app/api/v1";
import type { OpportunityCategories } from "@/app/opportunity/OpportunityRepository";
import { Avatar } from "@/components/Avatar";
import type { components } from "@1/strapi-openapi/v1";
import { Button } from "@1/ui/components/Button";
import { Spinner } from "@1/ui/components/Spinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Field, Form, Formik } from "formik";
import { useSession } from "next-auth/react";
import { useState, type ComponentPropsWithoutRef } from "react";
import { QARepository } from "./QARepository";

//

export function QAForm({
  categories,
}: {
  categories: Awaited<ReturnType<(typeof OpportunityCategories)["load"]>>;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const { data: session, update } = useSession();
  const queryClient = useQueryClient();
  const jwt = session?.user?.jwt;

  const { mutateAsync, isError, isLoading, error } = useMutation(
    async (data: components["schemas"]["QuestionRequest"]["data"]) => {
      if (!session?.user?.id) throw new Error("Invalid Session");
      if (!jwt) throw new Error("Invalid JWT");

      const body = await new QARepository(fromClient).save(
        jwt,
        session.user?.id,
        data,
      );

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["q&a"] }),
        update(),
      ]);

      return body;
    },
  );

  if (isError) {
    return <ErrorOccur error={error as Error} />;
  }

  if (isLoading) {
    return (
      <Card>
        <Spinner className="mx-auto my-5" />
      </Card>
    );
  }

  return (
    <Card>
      <Avatar className="h-10" />
      {isOpen ? (
        <Formik
          initialValues={{
            title: "",
            opportunity_category: undefined,
          }}
          enableReinitialize
          onSubmit={(values) => {
            return mutateAsync(
              Object.assign(
                {
                  title: values.title,
                },
                values.opportunity_category
                  ? {
                      opportunity_category: values.opportunity_category,
                    }
                  : {},
              ),
            );
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
                disabled={isSubmitting}
                name="title"
                placeholder="Pose une questions aux étudiants ..."
                required
              />
              <div className="flex justify-between">
                <Field
                  component="select"
                  className="min-w-[25%] border border-[#dddddd]"
                  name="opportunity_category"
                  disabled={isSubmitting}
                  required
                >
                  {categories.map(({ name, id }) => (
                    <option value={id} key={id}>
                      {name}
                    </option>
                  ))}
                </Field>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  className="max-w-fit"
                >
                  Envoyer
                </Button>
              </div>
            </Form>
          )}
        </Formik>
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

//

function ErrorOccur({ error }: { error: Error }) {
  return (
    <Card>
      <h1 className="flex-1 py-3 text-center text-lg font-bold text-red-500">
        Une erreur est survenu...
        <br />
        Veuillez fermer cette fenêtre et réessayez de vous authentifier.
        <br />
        <code className="text-gray-800">{error?.message}</code>
      </h1>
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
