//

import { get_csrf_token } from "@1.modules/auth.next/csrf_token";
import { UserAvatarFilled } from "@1.ui/react/icons";
// import { UserAvatarFilled } from "@1.ui/react/icons";
import { PROFILE_ROLES } from "@1.modules/profile.domain";
import { input } from "@1.ui/react/form/atom";
import type { Metadata, ResolvingMetadata } from "next";
import { tv } from "tailwind-variants";
import { EmailInput, SignInButton } from "./page.client";

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

export default function Page() {
  const csrfToken = get_csrf_token();

  const { base, form, label } = style();
  return (
    <main className={base()}>
      <form
        className={form()}
        method="post"
        action="/api/auth/callback/SigninEmail_Provider"
      >
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <input
          name="role"
          type="hidden"
          defaultValue={PROFILE_ROLES.enum.STUDIENT}
        />

        <div className="mx-auto">
          <UserAvatarFilled className="h-14 w-14 text-gray-400" />
        </div>

        <div className="container mx-auto grid grid-cols-12 gap-5 xl:max-w-4xl">
          <input
            className={input({ className: "col-span-full " })}
            id="name"
            name="name"
            placeholder="Prenom et Nom"
            required
            type="text"
          />
          {/* <input
            className={input({ className: "col-span-full " })}
            id="university"
            name="university"
            placeholder="Université"
            required
            type="text"
          />
          <input
            className={input({ className: "col-span-full " })}
            id="field_of_study"
            name="field_of_study"
            placeholder="Domaine"
            type="text"
          />
          <textarea
            className={input({ className: "col-span-full " })}
            id="bio"
            name="bio"
            placeholder="À propos"
          /> */}
          <label className={label()}>
            <div className="flex-1">Email address</div>
            <EmailInput
              className={input({ className: "w-fit flex-grow opacity-50" })}
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
  base: "container mx-auto my-10 flex max-w-4xl flex-col justify-center",
  slots: {
    form: "flex flex-col justify-center space-y-10",
    label: "col-span-full flex items-center space-x-1",
  },
});
