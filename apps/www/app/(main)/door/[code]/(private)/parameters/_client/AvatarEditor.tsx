"use client";

import { TRPC_React } from ":trpc/client";
import type { Profile } from "@1.modules/profile.domain";
import { Avatar } from "@1.modules/profile.ui";
import { Button } from "@1.ui/react/button";
import { input, label } from "@1.ui/react/form/atom";
import { Field, Form, Formik } from "formik";
import { useSession } from "next-auth/react";

//

export default function AvatarEditor({ profile }: { profile: Profile }) {
  const { update } = useSession();
  const { mutateAsync: save } = TRPC_React.profile.me.update.useMutation();

  function revert_to_gravatar_picture() {
    console.log("revert_to_gravatar_picture");
  }
  return (
    <Formik
      initialValues={{ url: profile.image }}
      onSubmit={async ({ url }) => {
        await save({ ...profile, image: url });
        return update();
      }}
    >
      {({ dirty, values }) => (
        <Form className="grid grid-cols-2 gap-5">
          <fieldset className="md:col-span-1">
            <label className={label()} htmlFor="avatar">
              Avatar :
              <br />
              <small className="text-xs">
                Changer l'url utiliser comme avatar.
              </small>
            </label>

            <Field className={input()} name="url" id="avatar" />

            <details className="my-3">
              <summary>
                <Button
                  intent="secondary"
                  onPress={revert_to_gravatar_picture}
                  type="button"
                >
                  Revenir à l'image Gravatar
                </Button>
              </summary>
              <br />
              Par default votes image profile est demender à{" "}
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
            </details>

            <Button intent="primary" type="submit" isDisabled={!dirty}>
              Sauvegarder
            </Button>
          </fieldset>
          <div className="flex flex-col justify-center md:col-span-1">
            <label className={label()} htmlFor="avatar">
              Preview :
            </label>
            <Avatar
              className="mx-auto h-48"
              profile={{
                bio: "",
                id: profile.id,
                image: values.url,
                name: "",
                role: "STUDIENT",
              }}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
}
