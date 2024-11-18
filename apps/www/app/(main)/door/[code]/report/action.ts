"use server";

import { trpc_caller } from "@1.infra/trpc/react-query/server";
import { create_report } from "@1.modules/profile.domain/report";
import to from "await-to-js";
import { z } from "zod";

//

const create_report_form = create_report.extend({
  attachments: z
    .custom<File>()
    .transform(async (file) => {
      const bytes = await file.arrayBuffer();
      const base64String = Buffer.from(bytes).toString("base64");
      return `data:${file.type};base64,${base64String}`;
    })
    .optional(),
});
/**
 * @deprecated To rewrite using trpc
 */
export async function report(
  state: z.TypeOf<typeof create_report_form>,
  formData: FormData,
) {
  const validatedFields = await create_report_form.safeParseAsync(
    Object.values(create_report_form.keyof().Enum).reduce(
      (acc, key) => ({ ...acc, [key]: formData.get(key) }),
      {},
    ),
  );

  if (!validatedFields.success) {
    return {
      ...state,
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      report_error: null,
    };
  }

  const input = validatedFields.data;

  const [report_error] = await to(trpc_caller.legacy_profile.me.report(input));
  if (report_error) {
    return {
      ...state,
      errors: null,
      success: false,
      report_error: report_error.message,
    };
  }

  return {
    ...state,
    success: true,
    errors: null,
    report_error: null,
  };
}
