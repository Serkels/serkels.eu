//

import type { Metadata } from "next";
import { getCsrfToken } from "next-auth/react";
import { UserForm } from "./UserForm";

//

export const metadata: Metadata = {
  title: "Sign Up _ Toc-Toc",
  description: "Sign Up New User",
};

export default async function Page() {
  const csrf = await getCsrfToken();

  if (!csrf) return null;

  return <UserForm csrf={csrf} />;
}

//
