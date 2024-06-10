"use client";

import type { Profile } from "@1.modules/profile.domain";
import { Avatar } from "@1.modules/profile.ui";
import { Button } from "@1.ui/react/button";
import { label } from "@1.ui/react/form/atom";
import { useAsync } from "@react-hookz/web";
import { fromImage } from "imtool";
import { useSession } from "next-auth/react";
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
  const [preview, set_preview] = useState(profile.image);
  const { update } = useSession();
  const router = useRouter();
  const [{ status }, { execute }] = useAsync(async (data: FormData) => {
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
  });

  return (
    <form action={execute}>
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

              // if (file.size > 1e7) {
              //   window.alert("Please upload a file smaller than 10 MB");
              //   return false;
              // }
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
        <Button
          intent="primary"
          type="submit"
          isDisabled={!isDirty || isSubmitting || status === "loading"}
        >
          Sauvegarder
        </Button>
      </fieldset>
    </form>
  );
}
