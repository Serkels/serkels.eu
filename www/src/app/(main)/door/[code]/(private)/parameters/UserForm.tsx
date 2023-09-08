"use client";

// import { type FormValues } from "@1/ui/domains/signup/UserForm";
import { Button } from "@1/ui/components/ButtonV";
import { useQuery } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { getCsrfToken } from "next-auth/react";
import { useUserData } from "~/modules/user";
import { useProfile } from "../../(public)/layout.client";

//

export function UserForm() {
  const { data: csrf } = useQuery({
    queryKey: ["csrf"],
    queryFn: () => getCsrfToken(),
    cacheTime: 0,
  });
  const {
    update: { useMutation },
  } = useUserData();
  const { info } = useMutation();
  const profile = useProfile();

  //

  return (
    <div className="col-span-full mx-auto flex flex-col justify-center ">
      <Formik
        initialValues={{
          firstname: profile.get("firstname"),
          lastname: profile.get("lastname"),
          university: profile.university,
          about: profile.get("about"),
        }}
        enableReinitialize
        onSubmit={(values) => info.mutateAsync(values)}
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
                  rows={5}
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
