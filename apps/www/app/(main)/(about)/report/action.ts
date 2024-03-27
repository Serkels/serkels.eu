"use server";

import { trpc } from "@1.modules/auth.next/trpc";
import { z } from "zod";

//

const schema = z.object({
  email: z.string().email({
    message: "Cette email n'est pas valide",
  }),
});

export async function report(_: unknown, formData: FormData) {
  const validatedFields = schema.safeParse({
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const input = validatedFields.data;

  await trpc.profile.me.report.mutate(input);

  return {
    message: "Please enter a valid email",
  };
  // // Return early if the form data is invalid

  // // Mutate data

  // console.log("LOL");

  // return {
  //   message: "test",
  // };
}
