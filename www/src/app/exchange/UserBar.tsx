"use client";

//

// import BinocularsIcon from "@1/ui/icons/binoculars.svg";
// import { Binoculars } from "@1/ui/icons";
import { AppBar } from "@1/ui/shell";
import { useSession } from "next-auth/react";
import Link from "next/link";

//

function Binoculars(props: any) {
  props;
  return <></>;
}
export function UserBar() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      window.location.href = "/";
    },
  });
  if (!session) return <>Loading...</>;
  console.log({ session });
  return (
    <AppBar>
      <nav>
        <ul className="flex">
          <li>
            <Link className="flex min-w-[121px]" href="/exchange">
              <Binoculars className="w-5" />
              Échanges
            </Link>
          </li>
          <li>
            <Link className="flex min-w-[121px]" href="/exchange">
              <Binoculars className="w-5" />
              Échanges
            </Link>
          </li>
          <li>
            <Link className="flex min-w-[121px]" href="/exchange">
              <Binoculars className="w-5" />
              Échanges
            </Link>
          </li>
          <li>
            <Link className="flex min-w-[121px]" href="/exchange">
              <Binoculars className="w-5" />
              Échanges
            </Link>
          </li>
        </ul>
      </nav>
      <nav className="grid min-w-[160px] grid-cols-5 items-center justify-center">
        <button className="h-[20px] w-[20px]">{"➕"}</button>
        <button className="h-[20px] w-[20px]">{"🔔"}</button>
        <button className="h-[20px] w-[20px]">{"💬"}</button>
        <button className="h-[20px] w-[20px]">{"↔️"}</button>
        <img
          className="h-[20px] w-[20px] rounded-full border-2 border-white object-cover"
          src={session.user!.image!}
        />
      </nav>
    </AppBar>
  );
}

//
