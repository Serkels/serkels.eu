//

import type { Profile } from "@1.modules/profile.domain";
import { Avatar } from "@1.modules/profile.ui";
import { label } from "@1.ui/react/form/atom";
import { useUnmountEffect } from "@react-hookz/web";
import { fromImage } from "imtool";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { tv } from "tailwind-variants";

//

interface FileWithPreview extends File {
  preview: string;
}

export default function Avatar_Previews({
  profile,
  set_profile_image,
}: {
  profile: Pick<Profile, "image" | "id">;
  set_profile_image: (file: File) => void;
}) {
  const [file, set_file] = useState({
    preview: profile.image,
  } as FileWithPreview);
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    maxFiles: 1,
    async onDrop([file]) {
      if (!file) return;
      const tool = await fromImage(file);
      const thumbnail = await tool
        .thumbnail(258, true)
        .type("image/jpeg")
        .toFile(`@${profile.id}.jpeg`);
      const thumbnail_file: FileWithPreview = Object.assign(thumbnail, {
        preview: URL.createObjectURL(thumbnail),
      });
      set_file(thumbnail_file);
      set_profile_image(file);
    },
  });

  useUnmountEffect(() => {
    // from https://react-dropzone.js.org/#!/Previews
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    URL.revokeObjectURL(file.preview);
  });

  const { base } = dropzone();
  return (
    <section>
      <label className={label()} htmlFor="avatar">
        Aperçu :
      </label>
      <div {...getRootProps({ className: base() })}>
        <input {...getInputProps()} />
        <Avatar
          className="mx-auto size-48"
          profile={{
            id: profile.id,
            image: file.preview,
          }}
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
        />
      </div>
    </section>
  );
}

const dropzone = tv({
  base: `align-center m-4 flex flex-1 flex-col border-2 border-dashed p-6`,
  slots: { test: "" },
});
