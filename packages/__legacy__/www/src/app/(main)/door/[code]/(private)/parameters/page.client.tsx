"use client";

import { DropZone, FileTrigger } from "@1/ui/components";
import { Button } from "@1/ui/components/ButtonV";
import { Spinner } from "@1/ui/components/Spinner";
import { useQueryClient } from "@tanstack/react-query";
import { Field, Form, Formik } from "formik";
import { useSession } from "next-auth/react";
import { useCallback, useRef, useState, type PropsWithChildren } from "react";
import { useBoolean, useTimeoutFn } from "react-use";
import { tv, type VariantProps } from "tailwind-variants";
import { P, match } from "ts-pattern";
import { avatar_img } from "~/components/Avatar";
import { ErrorOccur } from "~/components/ErrorOccur";
import { useUserData } from "~/modules/user";
import { User_Repository_Legacy } from "~/modules/user/User_Repository";
import { useDoorProfile } from "../../(public)/layout.client";

//

const ACCEPTED_FILE_TYPES = ["image/png", "image/jpeg"];

//

export function Avartar_Form() {
  const { update } = useSession();
  const { update_avatar, update: update_my_profile } = useUserData();
  const { info: upload_info } = update_avatar.useMutation();
  const { info: profile_info } = update_my_profile.useMutation();
  const profile = useDoorProfile();
  const [has_changed, set_has_changed] = useBoolean(false);

  const revert_to_gravatar_picture = useCallback(async () => {
    if (
      !window.confirm(
        "Voulez-vous vraiment réinitialiser votre avatar actuel ?",
      )
    ) {
      return;
    }

    await profile_info.mutateAsync({ image: { set: [] } });
    await update();
  }, [profile.get("image")?.data?.id]);

  let [avatar, set_avatar] = useState<string>(
    `/api/v1/avatars/u/${profile.id.value()}`,
  );

  const formRef = useRef<HTMLFormElement>(null);
  const query_client = useQueryClient();

  //

  const preview_avatar = (file: File) => {
    const local_url = URL.createObjectURL(file);
    set_has_changed(true);
    set_avatar(local_url);
  };

  const merged_mutations = {
    status: match([upload_info.status, profile_info.status])
      .with(["error", P._], [P._, "error"], () => "error")
      .with(["loading", P._], [P._, "loading"], () => "loading")
      .with(["success", P._], [P._, "success"], () => "success")
      .otherwise(() => "idle"),
    error: upload_info.error || profile_info.error,
  };

  return match(merged_mutations)
    .with({ status: "loading" }, () => <Verifying />)
    .with({ status: "error" }, () => (
      <ErrorOccur error={upload_info.error as Error} />
    ))
    .with({ status: "success" }, () => <UpdateSuccess />)
    .otherwise(() => (
      <Formik
        initialValues={{ files: undefined }}
        onSubmit={async () => {
          if (!formRef.current) return;

          const form_data = new FormData(formRef.current);
          const file = form_data.get("files");
          if (!file) return;
          if (!(file instanceof File)) return;

          form_data.set(
            "files",
            new File([file], "avatar_" + profile.id.value(), {
              type: file.type,
            }),
          );

          await upload_info.mutateAsync(form_data);

          query_client.invalidateQueries(
            User_Repository_Legacy.keys.by_id(Number(profile.id.value())),
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
              <Field type="hidden" name="refId" value={profile.id.value()} />
              <Field type="hidden" name="field" value="image" />
              <DropZone>
                <FileTrigger
                  acceptedFileTypes={ACCEPTED_FILE_TYPES}
                  name="files"
                  onChange={(event) => {
                    const files = Array.from(event ?? []);
                    const [file] = files;
                    if (!file) return;
                    preview_avatar(file);
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
                    onPress={revert_to_gravatar_picture}
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
  useTimeoutFn(() => {
    location.reload();
  }, 1_111);
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
