///

import { AvatarMediaHorizontal } from "@/components/Avatar";
import type { PropsWithChildren } from "react";
import { ProfileNavBar } from "./ProfileNavBar";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="col-span-full my-10 md:col-span-6 xl:col-span-9">
      <AvatarMediaHorizontal />

      <ProfileNavBar className="my-10" />
      <hr className="my-8 border-none"></hr>

      {children}
    </div>
  );
}
