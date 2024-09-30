import { auth } from "@1.modules/auth.next";

//

export interface CodeParms {
  code: string;
}

export async function code_to_profile_id({ code }: CodeParms) {
  return code === "~" ? ((await auth())?.profile.id ?? code) : code;
}
