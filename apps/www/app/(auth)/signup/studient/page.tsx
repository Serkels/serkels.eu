//

import { get_csrf_token } from "@1.modules/auth.next";
import { UserAvatarFilled } from "@1/ui/icons";
// import { UserAvatarFilled } from "@1.ui/react/icons";
import type { Metadata, ResolvingMetadata } from "next";
import { tv } from "tailwind-variants";
import { EmailInput, SignInButton } from "./page.client";

//

// const Form = dynamic(() => import("./page.client"), {
//   ssr: false,
//   loading() {
//     return <Spinner />;
//   },
// });

//

export async function generateMetadata(
  _: never,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `Studient :: ${(await parent).title?.absolute}`,
  };
}

//

export default async function Page() {
  const csrfToken = get_csrf_token();
  const { base, form, label, input } = style();
  label;
  input;
  return (
    <main className={base()}>
      <form className={form()} method="post" action="/api/auth/signin/email">
        <div className="mx-auto">
          <UserAvatarFilled className="h-14 w-14" />
        </div>
        <div className="grid grid-cols-12 gap-5">
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <input
            className={input()}
            id="firstname"
            name="firstname"
            placeholder="Prenom"
            required
            type="text"
          />
          <input
            className={input()}
            id="lastname"
            name="lastname"
            placeholder="Nom"
            required
            type="text"
          />
          <label className={label()}>
            Email address
            <EmailInput
              className={input()}
              id="email"
              name="email"
              placeholder="Email"
              required
              type="email"
            />
          </label>
        </div>
        <SignInButton>Terminer</SignInButton>
      </form>
    </main>
  );
}

//

const style = tv({
  base: "mx-auto flex flex-col justify-center",
  slots: {
    form: "flex flex-col justify-center space-y-5",
    label: "col-span-full flex items-center space-x-1",
    input:
      "col-span-full h-8 rounded-sm border border-solid border-[#dddddd] px-3 py-2 text-xs placeholder-[#AAAAAA] md:col-span-4",
  },
});
