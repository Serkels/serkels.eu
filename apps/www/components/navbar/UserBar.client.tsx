"use client";

import { Partner_NavBar, Student_NavBar } from "./aside_navbar";
import type { Partner, Student } from "@1.modules/profile.domain";
import { useToggle } from "@react-hookz/web";
import { type PropsWithChildren, type ReactNode } from "react";

//
export function UserMenuToggleStudent({
  student,
  button,
}: PropsWithChildren<{
  button: ReactNode;
  student: Student;
}>) {
  const [isToggled, toggle] = useToggle(false);

  return (
    <>
      <button className="flex h-max items-center md:hidden" onClick={toggle}>
        {button}
      </button>

      <div className="fixed right-0 top-0 md:hidden">
        {isToggled && (
          <Student_NavBar
            className="fixed inset-0 bottom-16 top-16 z-10 w-full overflow-auto bg-[#f5f8fa] text-black md:hidden"
            student={student}
            onClickLink={toggle}
          />
        )}
      </div>
    </>
  );
}

export function UserMenuTogglePartner({
  partner,
  button,
}: PropsWithChildren<{
  button: ReactNode;
  partner: Partner;
}>) {
  const [isToggled, toggle] = useToggle(false);

  return (
    <>
      <button className="flex h-max items-center md:hidden" onClick={toggle}>
        {button}
      </button>

      <div className="fixed right-0 top-0 md:hidden">
        {isToggled && (
          <Partner_NavBar
            className="fixed inset-0 bottom-16 top-16 z-10 w-full overflow-auto bg-[#f5f8fa] text-black md:hidden"
            partner={partner}
            onClickLink={toggle}
          />
        )}
      </div>
    </>
  );
}
