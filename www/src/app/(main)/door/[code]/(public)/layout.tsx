///

import type { PropsWithChildren } from "react";
import { ProfileNavBar } from "./ProfileNavBar";
import { Profile_Header } from "./layout.client";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="col-span-full my-10 px-4 md:col-span-6 md:px-0 xl:col-span-7">
      <Profile_Header />
      <ProfileNavBar className="my-10" />

      <hr className="my-8 border-none"></hr>

      {children}
    </div>
  );
}
