//

import type { ReactNode } from "react";
import { tv } from "tailwind-variants";
import { match } from "ts-pattern";
import { Studient_NavBar } from "../(private)/aside_navbar";
import NotFound from "../error";
import { this_door_is_yours } from "../this_door_is_yours";
import { ProfileNavBar } from "./ProfileNavBar";
import { Profile_Header } from "./layout.client";

//

export default async function Layout(props: {
  navbar: ReactNode;
  children: ReactNode;
  params: { code: string };
}) {
  try {
    const { code } = props.params;

    const [is_yours, is_studient] = await Promise.all([
      this_door_is_yours(code),
      true,
    ]);

    const aside = match({ is_yours, is_studient })
      .with({ is_studient: true, is_yours: true }, () => <Studient_NavBar />)
      .otherwise(() => null);

    return (
      <>
        {aside}
        <div className={container({ $public: !is_yours })}>
          <Profile_Header />
          <ProfileNavBar className="my-10" />

          <hr className="my-8 border-none"></hr>

          {props.children}
        </div>
      </>
    );
  } catch {
    return <NotFound />;
  }
}

const container = tv({
  base: "col-span-full my-10 px-4 md:col-span-6 md:px-0 ",
  variants: {
    $public: {
      true: "md:col-start-2 xl:col-start-4",
      false: "xl:col-span-7",
    },
  },
});
