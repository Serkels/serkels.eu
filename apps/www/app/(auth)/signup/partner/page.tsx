//

import { FrenchLocationField } from ":components/FrenchLocationField";
import {
  PROFILE_ROLES,
  Partner_Schema,
  Profile_Schema,
} from "@1.modules/profile.domain";
import { input } from "@1.ui/react/form/atom";
import { UserAvatarFilled } from "@1.ui/react/icons";
import type { Metadata, ResolvingMetadata } from "next";
import { getCsrfToken } from "next-auth/react";
import { Suspense } from "react";
import { tv } from "tailwind-variants";
import { EmailInput, SignInButton } from "./page.client";

//

export async function generateMetadata(
  _: never,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `Partner :: ${(await parent).title?.absolute}`,
  };
}

//

export default async function Page() {
  return null;
}
/**
 *
 * @deprecated TO REMOVE
 */
async function Page_() {
  const csrfToken = await getCsrfToken();
  const { base, form, label } = style();
  const profile_names = Profile_Schema.keyof().Enum;
  const partner_names = Partner_Schema.keyof().Enum;

  return (
    <main className={base()}>
      <form className={form()} method="post" action="/api/auth/callback/signin">
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <input
          name="role"
          type="hidden"
          defaultValue={PROFILE_ROLES.enum.PARTNER}
        />

        <div className="mx-auto">
          <UserAvatarFilled className="h-14 w-14 text-gray-400" />
        </div>

        <div className="container mx-auto grid grid-cols-12 gap-5 xl:max-w-4xl">
          <input
            className={input({ className: "col-span-full " })}
            id={profile_names.name}
            name={profile_names.name}
            placeholder="Nom de l'établissement"
            required
            type="text"
          />
          <textarea
            className={input({ className: "col-span-full " })}
            id={profile_names.bio}
            name={profile_names.bio}
            placeholder="À propos"
          />
          <input
            className={input({ className: "col-span-full " })}
            id="city"
            name="city"
            placeholder="Ville"
            required
            type="text"
          />

          <label
            className={label({ className: "flex-col items-start space-x-0" })}
          >
            <span>Ville</span>
            <Suspense>
              <FrenchLocationField
                name={partner_names.city}
                id={partner_names.city}
                placeholder="Ville"
              />
            </Suspense>
          </label>
          <input
            className={input({ className: "col-span-full " })}
            name={partner_names.link}
            id={partner_names.link}
            placeholder="Site web"
            required
            type="text"
          />
          <label className={label()}>
            <div className="flex-1">Email address</div>
            <Suspense>
              <EmailInput
                className={input({ className: "w-fit flex-grow opacity-50" })}
                id="email"
                name="email"
                placeholder="Email"
                required
                type="email"
              />
            </Suspense>
          </label>
        </div>
        <SignInButton>Terminer</SignInButton>
      </form>
    </main>
  );
}
Page_;

//

const style = tv({
  base: "container mx-auto my-10 flex max-w-4xl flex-col justify-center",
  slots: {
    form: "flex flex-col justify-center space-y-10",
    label: "col-span-full flex items-center space-x-1",
    input:
      "col-span-full h-8 rounded-sm border border-solid border-[#dddddd] px-3 py-2 text-xs placeholder-[#AAAAAA]",
  },
});
