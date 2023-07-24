//

import { getCsrfToken } from "next-auth/react";
import { UserForm } from "./UserForm";

//

export default async function Page() {
  const csrf = await getCsrfToken();

  if (!csrf) return null;

  return (
    <main className="col-span-full my-10 md:col-span-6 xl:col-span-9">
      <UserForm csrf={csrf} />
    </main>
  );
}
