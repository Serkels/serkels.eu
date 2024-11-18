"use client";

import { TRPC_React } from ":trpc/client";
import { useSession } from "@1.modules/auth.next/react";
import type { Profile } from "@1.modules/profile.domain";
import { Avatar } from "@1.modules/profile.ui";
import { Button } from "@1.ui/react/button";
import { label } from "@1.ui/react/form/atom";
import { useAsync } from "@react-hookz/web";
import { fromImage } from "imtool";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { uploadImage } from "../upload";

//

export default function Avatar_Editor({ profile }: { profile: Profile }) {
  const {
    register,
    formState: { isDirty, isSubmitting },
    reset,
  } = useForm({
    defaultValues: { profile_id: profile.id, image_file: new File([], "") },
  });
  const update_image_to_gravatar =
    TRPC_React.legacy_profile.me.update_image_to_gravatar.useMutation();
  const [preview, set_preview] = useState(profile.image);
  const { update } = useSession();
  const router = useRouter();

  const [{ status: upload_status }, { execute: upload_image }] = useAsync(
    async (data: FormData) => {
      const file = data.get("image_file") as File;
      const tool = await fromImage(file);
      const thumbnail = await tool
        .thumbnail(258, true)
        .type("image/jpeg")
        .toFile(`@${profile.id}.jpg`);
      data.set("image_file", thumbnail);
      await uploadImage(data);
      await update();
      reset();
      router.refresh();
    },
  );

  const [, { execute: use_gravatar }] = useAsync(async () => {
    const new_profile = await update_image_to_gravatar.mutateAsync();
    await set_preview(new_profile.image);
    await update();
    router.refresh();
  });

  return (
    <form action={upload_image}>
      <fieldset
        className="md:col-span-1"
        disabled={isSubmitting || status === "loading"}
      >
        <label className={label()} htmlFor="avatar">
          Avatar :
          <br />
          <small className="text-xs">
            <p>Changer l'url utiliser comme avatar.</p>
          </small>
        </label>
        <input type="hidden" value={profile.id} {...register("profile_id")} />
        <input
          type="file"
          {...register("image_file", {
            async onChange(event: React.ChangeEvent<HTMLInputElement>) {
              const file = event.target.files?.[0];
              if (!file) return;
              set_preview(URL.createObjectURL(file));
            },
          })}
          required
        />
        <Avatar
          className="mx-auto size-48"
          profile={{ id: profile.id, image: preview }}
          onLoad={() => {
            URL.revokeObjectURL(preview);
          }}
        />
        <details className="my-3">
          <summary>
            <Button intent="secondary" onPress={use_gravatar} type="button">
              Revenir à l'image Gravatar
            </Button>
          </summary>
          <br />
          Par défaut, votre avatar est généré par{" "}
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
        <Button
          intent="primary"
          type="submit"
          isDisabled={!isDirty || isSubmitting || upload_status === "loading"}
        >
          Sauvegarder
        </Button>
      </fieldset>
    </form>
  );
}
