"use client";

import type { components } from "@1/strapi-openapi/v1";
import { DropZone, FileTrigger } from "@1/ui/components";
import { Button } from "@1/ui/components/ButtonV";
import { Spinner } from "@1/ui/components/Spinner";
import { useQueryClient } from "@tanstack/react-query";
import { Field, Form, Formik } from "formik";
import { useSession } from "next-auth/react";
import { useCallback, useRef, useState, type PropsWithChildren } from "react";
import { useBoolean } from "react-use";
import { tv, type VariantProps } from "tailwind-variants";
import { match } from "ts-pattern";
import { avatar_img } from "~/components/Avatar";
import { ErrorOccur } from "~/components/ErrorOccur";
import { User_Repository } from "~/modules/user/User_Repository";
import { useUserData } from "~/modules/user/user.repository";
import { useProfile } from "../../(public)/layout.client";

//

const ACCEPTED_FILE_TYPES = ["image/png"];

//

export function Avartar_Form() {
  const { update } = useSession();
  const { update_avatar, update: update_my_profile } = useUserData();
  const { info } = update_avatar.useMutation();
  const { info: update_my_profile_info } = update_my_profile.useMutation();
  const profile = useProfile();
  const [has_changed, set_has_changed] = useBoolean(false);
  const onRevertToGravatarPicture = useCallback(async () => {
    if (
      !window.confirm(
        "Voulez-vous vraiment réinitialiser votre avatar actuel ?",
      )
    ) {
      return;
    }

    await update_my_profile_info.mutateAsync({ image: null });
    console.log("Reinit");
    // await mutateAsync({});
    await update();
    // mutate({ image: null } as any);
  }, [profile.get("image")?.data?.id]);

  let [avatar, set_avatar] = useState<string>(
    `/api/v1/avatars/u/${profile.get("id")}`,
  );
  const onChange = (e: FileList | null) => {
    if (!e) return;

    const files = Array.from(e);
    const [file] = files;

    if (!file) return;

    const local_url = URL.createObjectURL(file);
    console.log({ local_url });
    set_has_changed(true);
    // setFieldValue("file", event.currentTarget.files[0]);
    set_avatar(files[0] ? local_url : `/api/v1/avatars/u/${profile.get("id")}`);
  };
  const formRef = useRef<HTMLFormElement>(null);
  const query_client = useQueryClient();
  //

  if (!profile) return null; //throw new AuthError("Missing profile");

  return match(info)
    .with({ status: "loading" }, () => <Verifying />)
    .with({ status: "error" }, () => <ErrorOccur error={info.error as Error} />)
    .with({ status: "success" }, () => <UpdateSuccess />)
    .otherwise(() => (
      <Formik
        initialValues={{ files: undefined }}
        onSubmit={async () => {
          if (!formRef.current) return;

          const fd = new FormData(formRef.current);
          const file = fd.get("files");
          if (!file) return;
          if (!(file instanceof File)) return;
          fd.set(
            "files",
            new File([file], "avatar_" + profile.get("id"), {
              type: file.type,
            }),
          );

          await info.mutateAsync(fd);
          query_client.invalidateQueries(
            User_Repository.keys.by_id(profile.get("id")),
          );
          await update();
        }}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form ref={formRef} className="">
            <div className="md:col-span-1">
              <span className="font-bold">Image de profile</span>
              <Field type="hidden" name="path" value="avatars" />
              <Field
                type="hidden"
                name="ref"
                value="api::user-profile.user-profile"
              />
              <Field type="hidden" name="refId" value={profile.get("id")} />
              <Field type="hidden" name="field" value="image" />
              <DropZone>
                <FileTrigger
                  acceptedFileTypes={ACCEPTED_FILE_TYPES}
                  name="files"
                  onChange={(event) => {
                    const files = Array.from(event ?? []);
                    const [file] = files;
                    if (!file) return;
                    onChange(event);
                    setFieldValue("files", [file]);
                  }}
                >
                  <img
                    className={avatar_img({ className: "mx-auto h-72 w-72" })}
                    src={avatar}
                  />
                  <Button isDisabled={isSubmitting}>Select a file</Button>
                </FileTrigger>
              </DropZone>
              {has_changed ? <Button type="submit">Valider</Button> : null}
            </div>

            <div className="md:col-span-1">
              <br />
              <details>
                <summary>
                  <Button
                    intent="secondary"
                    onPress={onRevertToGravatarPicture}
                    type="button"
                  >
                    Revenir à l'image Gravatar
                  </Button>
                </summary>
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
            </div>
          </Form>
        )}
      </Formik>
    ));
}

//

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

function UpdateSuccess() {
  return <AlertPanel $status="success">Profile mis à jour</AlertPanel>;
}

//

const alert = tv({
  base: "border-2 p-5",
  variants: {
    $status: {
      error: "border-red-700",
      success: "boerder-success",
    },
  },
});

type AlertVariants = VariantProps<typeof alert>;

function AlertPanel({ $status, children }: PropsWithChildren<AlertVariants>) {
  return <div className={alert({ $status })}>{children}</div>;
}

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
