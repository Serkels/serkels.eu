import { getServerSession } from "@1.modules/auth.next.legacy";

//

export interface CodeParms {
  code: string;
}

export async function code_to_profile_id({ code }: CodeParms) {
  return code === "~" ? (await getServerSession())?.profile.id : code;
}
