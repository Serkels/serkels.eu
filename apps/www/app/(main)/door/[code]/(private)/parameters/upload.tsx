"use server";

import { proxyClient } from ":trpc/server";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";

//

const token = process.env["PROFILE_BLOB_READ_WRITE_TOKEN"];

//

export async function uploadImage(formData: FormData) {
  const image_file = formData.get("image_file") as File;
  const profile_id = formData.get("profile_id") as string;
  const pathname = `@${profile_id}.${image_file.name.split(".").pop()}`;

  const blob = await put(pathname, image_file, {
    access: "public",
    // addRandomSuffix: false,
    token,
  });

  const profile = await proxyClient.legacy_profile.by_id.query(profile_id);
  await proxyClient.legacy_profile.me.update.mutate({
    ...profile,
    image: blob.url,
  });

  revalidatePath(
    `https://xliajqivstyuw7e1.public.blob.vercel-storage.com/${pathname}`,
  );

  return blob;
}
