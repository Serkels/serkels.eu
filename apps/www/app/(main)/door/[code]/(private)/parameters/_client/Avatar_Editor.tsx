"use client";

import { TRPC_React } from ":trpc/client";
import type { Profile } from "@1.modules/profile.domain";
import { Avatar } from "@1.modules/profile.ui";
import { Button } from "@1.ui/react/button";
import { input, label } from "@1.ui/react/form/atom";
import { Field, Form, Formik } from "formik";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

//

export default function Avatar_Editor({ profile }: { profile: Profile }) {
  const { update } = useSession();
  const router = useRouter();
  const update_image_to_gravatar =
    TRPC_React.profile.me.update_image_to_gravatar.useMutation();
  const { mutateAsync: save } = TRPC_React.profile.me.update.useMutation();

  return (
    <Formik
      initialValues={{ url: profile.image }}
      onSubmit={async ({ url }) => {
        await save({ ...profile, image: url });
        await update();
        router.refresh();
      }}
    >
      {({ dirty, values, setFieldValue }) => (
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
                  onPress={async () => {
                    const new_profile =
                      await update_image_to_gravatar.mutateAsync();
                    await update();
                    await setFieldValue("url", new_profile.image);
                  }}
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
                id: profile.id,
                image: values.url,
              }}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
}
