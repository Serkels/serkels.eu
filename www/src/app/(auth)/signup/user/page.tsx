//

import type { Metadata } from "next";
import { UserForm } from "./UserForm";

//

export const metadata: Metadata = {
  title: "Sign Up _ Toc-Toc",
  description: "Sign Up New User",
};

export default async function Page() {
  return <UserForm />;
}

//
