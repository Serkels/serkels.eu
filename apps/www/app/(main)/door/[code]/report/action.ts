"use server";

import { trpc } from "@1.modules/auth.next/trpc";
import { create_report } from "@1.modules/profile.domain/report";
import to from "await-to-js";
import type { z } from "zod";

//

export async function report(
  state: z.TypeOf<typeof create_report>,
  formData: FormData,
) {
  const validatedFields = create_report.safeParse({
    email: formData.get(create_report.keyof().Enum.email),
    link: formData.get(create_report.keyof().Enum.link),
    comment: formData.get(create_report.keyof().Enum.comment),
  });

  if (!validatedFields.success) {
    return {
      ...state,
      sucess: false,
      errors: validatedFields.error.flatten().fieldErrors,
      report_error: null,
    };
  }

  const input = validatedFields.data;

  const [report_error] = await to(trpc.profile.me.report.mutate(input));
  if (report_error) {
    return {
      ...state,
      errors: null,
      sucess: false,
      report_error: report_error.message,
    };
  }

  return {
    ...state,
    sucess: true,
    errors: null,
    report_error: null,
  };
}
