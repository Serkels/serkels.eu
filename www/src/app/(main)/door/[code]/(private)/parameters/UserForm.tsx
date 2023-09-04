"use client";

// import { type FormValues } from "@1/ui/domains/signup/UserForm";
import type { components } from "@1/strapi-openapi/v1";
import { Button } from "@1/ui/components/ButtonV";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { getCsrfToken, useSession } from "next-auth/react";

//

export function UserForm() {
  const { data: csrf } = useQuery({
    queryKey: ["csrf"],
    queryFn: () => getCsrfToken(),
    cacheTime: 0,
  });

  const { mutateAsync, status, error } = useMutation(
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

  //
  const { data: session, update } = useSession();
  const jwt = session?.user?.jwt;
  const profile = session?.user?.profile;
  if (!profile) return null; //throw new AuthError("Missing profile");

  return (
    <div className="col-span-full mx-auto flex flex-col justify-center ">
      <Formik
        initialValues={{
          firstname: profile.attributes?.firstname,
          lastname: profile.attributes?.lastname,
          university: profile.attributes?.university,
          about: profile.attributes?.about,
        }}
        enableReinitialize
        onSubmit={(values) => mutateAsync(values)}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col justify-center space-y-5">
            <Field type="hidden" defaultValue={csrf} name="csrfToken"></Field>
            <div className="grid gap-5 md:grid-cols-2">
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
              <label className="md:col-span-1">
                <span className="font-bold">Domaine</span>
                <br />
                <Field
                  className="h-8 w-full rounded-sm border border-solid border-[#dddddd] px-3 py-2 text-xs placeholder-[#AAAAAA]"
                  type="field_of_study"
                  name="field_of_study"
                />
                <br />
                <ErrorMessage name="field_of_study" component="div" />
              </label>
              <label className="md:col-span-2">
                <span className="font-bold">À propos</span>
                <br />
                <Field
                  className="w-full rounded-sm border border-solid border-[#dddddd] px-3 py-2 text-xs placeholder-[#AAAAAA]"
                  component="textarea"
                  rows="5"
                  name="about"
                  type="about"
                />
                <br />
                <ErrorMessage name="about" component="div" />
              </label>
            </div>
            <Button
              type="submit"
              isDisabled={isSubmitting}
              className="max-w-fit"
            >
              Mettre à jour le profile
            </Button>
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
