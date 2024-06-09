"use client";

import { TRPC_React } from ":trpc/client";
import type { Profile } from "@1.modules/profile.domain";
import { Avatar } from "@1.modules/profile.ui";
import { Button } from "@1.ui/react/button";
import { input, label } from "@1.ui/react/form/atom";
import { Field, Form, Formik } from "formik";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import Preview, { Input } from "./Avatar_Preview";

//

// const Preview = dynamic(() => import("./Avatar_Preview"));
interface FormInputs {
  avatar: string;
}

export default function Avatar_Editor({ profile }: { profile: Profile }) {
  const { register, handleSubmit, formState, getValues } = useForm<FormInputs>({
    defaultValues: { avatar: profile.image },
  });
  const { update } = useSession();
  const router = useRouter();
  const update_image_to_gravatar =
    TRPC_React.profile.me.update_image_to_gravatar.useMutation();
  const { mutateAsync: save } = TRPC_React.profile.me.update.useMutation();
  const onSubmit = useCallback(async (data: FormInputs) => {
    await save({ image: data.avatar });
    await update();
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <pre>
        {JSON.stringify({ formState, isDirty: formState.isDirty }, null, 2)}
      </pre>
      <fieldset className="md:col-span-1">
        <label className={label()} htmlFor="avatar">
          Avatar :
          <br />
          <small className="text-xs">
            <p>Changer l'url utiliser comme avatar.</p>
            <p>
              Faites glisser et déposez un fichiers ici, ou cliquez pour
              sélectionner un fichiers
            </p>
          </small>
        </label>
      </fieldset>
      <div className="flex flex-col justify-center md:col-span-1">
        <Preview
          profile={{
            id: profile.id,
            image: getValues("avatar"),
          }}
        >
          <Input>
            {(props) => <input {...register("avatar")} {...props.dropzone} />}
          </Input>
        </Preview>
      </div>
      <Button intent="primary" type="submit" isDisabled={!formState.isDirty}>
        Sauvegarder
      </Button>
    </form>
  );
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
