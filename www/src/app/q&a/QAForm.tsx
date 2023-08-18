"use client";

import { fromClient } from "@/app/api/v1";
import { Avatar } from "@/components/Avatar";
import { Button } from "@1/ui/components/Button";
import { Spinner } from "@1/ui/components/Spinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Field, Form, Formik } from "formik";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState, type ComponentPropsWithoutRef } from "react";
import { useOpportunityCategoriesQuery } from "../opportunity/data/useOpportunityCategoriesQuery";
import {
  OTHER_CATEGORY_SLUGS,
  OpportunityCategoriesViewModel,
} from "../opportunity/models/OpportunityCategoriesViewModel";
import { QARepository } from "./QARepository";

//

export function QAForm() {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoading: isLoadingyCategories, data: all_categories } =
    useOpportunityCategoriesQuery();
  const { mutateAsync, isError, isLoading, error } = useNewQAMutation();
  const searchParams = useSearchParams();

  //

  if (isError) {
    return <ErrorOccur error={error as Error} />;
  }

  const categories = all_categories?.map(
    OpportunityCategoriesViewModel.from_server,
  );

  const other_category = categories?.find(({ slug }) =>
    OTHER_CATEGORY_SLUGS.includes(
      slug as (typeof OTHER_CATEGORY_SLUGS)[number],
    ),
  );

  if (
    isLoading ||
    isLoadingyCategories ||
    !categories ||
    !all_categories ||
    !other_category
  ) {
    return (
      <Card>
        <Spinner className="mx-auto my-5" />
      </Card>
    );
  }

  const category = searchParams.get("category");
  const initial_category =
    categories?.find(({ slug }) => slug === category)?.id ?? other_category.id;

  return (
    <Card>
      <Avatar className="h-10" />
      {isOpen ? (
        <Formik
          initialValues={{
            title: "",
            category: initial_category,
          }}
          enableReinitialize
          onSubmit={(values) => mutateAsync(values)}
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
                  className="min-w-[25%] border border-[#dddddd]"
                  component="select"
                  disabled={isSubmitting}
                  name="category"
                  required
                >
                  {categories
                    .filter(({ slug }) => slug !== other_category.slug)
                    .map(({ name, id }) => (
                      <option value={id} key={id}>
                        {name}
                      </option>
                    ))}
                  <option value={other_category.id}>Autres</option>
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

//

function useNewQAMutation() {
  const { data: session, update } = useSession();
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
        queryClient.invalidateQueries({ queryKey: ["q&a"] }),
        update(),
      ]);

      return body;
    },
  );
}
