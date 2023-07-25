"use client";

import { Spinner } from "@1/ui/components/Spinner";
// import { type FormValues } from "@1/ui/domains/signup/UserForm";
import { Avatar } from "@/components/Avatar";
import type { components } from "@1/strapi-openapi/v1";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useSession } from "next-auth/react";
import { useCallback, type PropsWithChildren } from "react";

//

export function UserForm({ csrf }: { csrf: string }) {
  const { data: session, update } = useSession();
  const jwt = session?.user?.jwt;
  const profile = session?.user?.profile;

  const { mutateAsync, mutate, isLoading, isSuccess, isError, error } =
    useMutation(
      async (values: {
        firstname: string | undefined;
        lastname: string | undefined;
        university: string | undefined;
      }) => {
        if (!jwt) throw new Error("Invalid JWT");
        const response = await submitFormHandler(jwt, values);
        await update();
        return response;
      },
    );

  const onRevertToGravatarPicture = useCallback(async () => {
    if (
      !window.confirm(
        "Voulez-vous vraiment réinitialiser votre avatar actuel ?",
      )
    ) {
      return;
    }

    mutateAsync;
    // await mutateAsync({});
    await update();
    // mutate({ image: null } as any);
  }, [profile?.attributes?.image?.data?.id]);

  //

  if (isLoading) return <Verifying />;

  if (!profile) return <ErrorOccur error={new Error("Missing profile")} />;

  return (
    <div className="col-span-full mx-auto flex flex-col justify-center ">
      {isError ? <ErrorOccur error={error as Error} /> : null}
      {isSuccess ? <UpdateSuccess /> : null}
      <Formik
        initialValues={{
          firstname: profile.attributes?.firstname,
          lastname: profile.attributes?.lastname,
          university: profile.attributes?.university,
        }}
        enableReinitialize
        onSubmit={(values) => mutate(values)}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col justify-center space-y-5">
            <Field type="hidden" defaultValue={csrf} name="csrfToken"></Field>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-1">
                <span className="font-bold">Image de profile</span>
                <Avatar className="mx-auto h-72 w-72" />
              </div>
              <div className="md:col-span-1">
                <br />
                <button
                  className="bg-Cerulean text-white"
                  onClick={onRevertToGravatarPicture}
                  type="button"
                >
                  Revenir à l'image{" "}
                  <a
                    className="underline"
                    target="_blank"
                    rel="noreferrer"
                    href="https://gravatar.com/"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    Gravatar
                  </a>
                </button>
              </div>
              <label className="md:col-span-1">
                <span className="font-bold">Prénom</span>
                <br />
                <Field
                  className="h-8 w-full rounded-sm border border-solid border-[#dddddd] px-3 py-2 text-xs placeholder-[#AAAAAA]"
                  type="firstname"
                  name="firstname"
                  required
                />
                <br />
                <ErrorMessage name="firstname" component="div" />
              </label>

              <label className="md:col-span-1">
                <span className="font-bold">Nom</span>
                <br />
                <Field
                  className="h-8 w-full rounded-sm border border-solid border-[#dddddd] px-3 py-2 text-xs placeholder-[#AAAAAA]"
                  type="lastname"
                  name="lastname"
                  required
                />
                <br />
                <ErrorMessage name="lastname" component="div" />
              </label>

              <label className="md:col-span-1">
                <span className="font-bold">Université</span>
                <br />
                <Field
                  className="h-8 w-full rounded-sm border border-solid border-[#dddddd] px-3 py-2 text-xs placeholder-[#AAAAAA]"
                  type="university"
                  name="university"
                  required
                />
                <br />
                <ErrorMessage name="university" component="div" />
              </label>
            </div>
            <button
              type="submit"
              className="bg-Chateau_Green text-white"
              disabled={isSubmitting}
            >
              Mettre à jour le profile
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

//

async function submitFormHandler(
  token: string,
  context: unknown, //Partial<components["schemas"]["UserProfile"]>,
) {
  const res = await fetch(`/api/v1/user-profiles/me`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({ data: context }),
  });
  try {
    const result:
      | components["schemas"]["Error"]
      | { error: null; data: components["schemas"]["UserProfile"] } =
      await res.json();
    if (result.error) {
      throw new Error(result.error.message);
    }
    return result.data;
  } catch (error) {
    return Promise.reject(res.statusText);
  }
}

function AlertPanel({
  error: isError,
  success: isSuccess,
  children,
}: PropsWithChildren<{
  success?: boolean;
  error?: boolean;
}>) {
  return (
    <div
      className={clsx("border-2 p-5", {
        "border-red-700": isError,
        "border-Chateau_Green": isSuccess,
      })}
    >
      {children}
    </div>
  );
}

function UpdateSuccess() {
  return <AlertPanel success>Profile mis à jour</AlertPanel>;
}

function Verifying() {
  return (
    <div className="col-span-full">
      <h1
        className={`
          mx-auto
          my-0
          text-center text-6xl
          font-extrabold
          sm:text-7xl
          lg:text-8xl
        `}
      >
        Vérification
      </h1>
      <div className="mx-auto mt-5 text-center">
        <Spinner />
      </div>
    </div>
  );
}

function ErrorOccur({ error }: { error: Error }) {
  return (
    <AlertPanel error>
      <h4 className="font-bold">Une error c'est produite</h4>
      Veuillez fermer cette fenêtre et réessayez de vous authentifier.
      <br />
      <code>{error?.message}</code>
    </AlertPanel>
  );
}
